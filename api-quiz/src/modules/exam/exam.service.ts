import * as _ from 'lodash';
import * as moment from 'moment';
import {
  Inject,
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {ExamsRepository} from './exam.repository';
import {CreateExamInput, UpdateExamInput, ExamsFilter, SubmitExamDtoInput} from './exam.dto';
import {generateSlug, filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText, ExamsStatus} from './exam.constant';
import {UsersService} from '../user/user.service';
import {ExamUsersService} from '../examUser/examUser.service';
import {QuestionsService} from '../question/question.service';
import {ExamQuestionsService} from '../examQuestion/examQuestion.service';

moment.locale('vi');
@Injectable()
export class ExamsService {
  constructor(
    @Inject(forwardRef(() => ExamUsersService))
    private readonly examUsersService: ExamUsersService,
    private readonly examsRepository: ExamsRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => QuestionsService))
    private readonly questionsService: QuestionsService,
    private readonly examQuestionsService: ExamQuestionsService,
  ) {}

  async isOwnerExam(examId: string, userId: string) {
    const findExam = await this.readExam(examId);
    const findUser = await this.usersService.readUser(userId);
    return findUser.isAdmin || findExam.createdBy === userId;
  }

  async incrementNumberField(examId: string, field: string, num: number) {
    const incrementObject = {};
    incrementObject[field] = num;
    return this.examsRepository.updateById(examId, {
      $inc: incrementObject,
    });
  }

  async getMembers(examId: string, pagination?: IPagination, userId?: string) {
    const examsToMembers = await this.examUsersService.readExamUsers(examId);
    return this.usersService.indexPublicUsersInfo({members: examsToMembers}, pagination, userId);
  }

  async getAchievements(examId: string, userId: string) {
    const totalQuestionsExam = await this.questionsService.countQuestions({examId, userId});
    // const totalAnswersExam = await this.answersService.countAnswers({examId, userId});
    return {totalQuestions: totalQuestionsExam, totalAnswers: 0};
  }

  async submitExam(submitExamDtoInput: SubmitExamDtoInput, userId?: string) {
    const {contestId, answers} = submitExamDtoInput;
    await this.readExam(contestId);
    const questionsToExam = await this.examQuestionsService.readExamQuestions(contestId);

    let listQuestion = [],
      totalQuestion = 0;
    if (questionsToExam.length) {
      const {items: questions, headers = []} = await this.questionsService.indexQuestions(
        {questionsToExam},
        {
          startIndex: 0,
          perPage: 1000,
        } as IPagination,
      );
      listQuestion = questions;
      totalQuestion = headers['x-total-count'];
    }

    const results = {},
      statusResults = {};
    let point = 0;
    for (const question of listQuestion) {
      const submitting = await this.questionsService.submitPracticeQuestion(
        {
          questionId: question.id,
          yourAnswers: answers[question.id] || [],
        },
        userId,
      );
      if (submitting.isCorrect) {
        point++;
      }
      results[question.id] = submitting.results;
      statusResults[question.id] = submitting.isCorrect;
    }

    return {
      message: `You got ${point} out of ${totalQuestion} questions correct`,
      ...submitExamDtoInput,
      statusResults,
      point,
      totalQuestion,
      results,
      success: true,
    };
  }

  async indexExams(examsFilter: ExamsFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
        status: ExamsStatus.PUBLIC,
      },
      examsFilter,
      filtersText,
    );
    const sort: Record<any, any> = {priority: -1};

    const [groups, count] = await Promise.all([
      this.examsRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort,
      }),
      this.examsRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: groups,
      headers: responseHeaders,
    };
  }

  async createExam(createExamInput: CreateExamInput, owner: any) {
    if (!createExamInput?.totalTime || createExamInput?.totalTime <= 0) {
      throw new BadRequestException(`Total time is invalid`);
    }
    const newExam = await this.examsRepository.create({
      ...createExamInput,
      slug: createExamInput?.slug
        ? generateSlug(createExamInput.slug)
        : generateSlug(createExamInput.name),
      createdBy: owner.id,
      owner: {
        id: owner.id,
        name: owner.name,
        imageUrl: owner.imageUrl,
      },
    });
    // default: add owner to exam
    // await this.examUsersService.createExamUser({examId: newExam.id}, owner.id);
    if (_.isArray(createExamInput?.questionIds) && createExamInput.questionIds.length) {
      for (const questionId of createExamInput.questionIds) {
        await this.examQuestionsService.createExamQuestion({examId: newExam.id}, questionId);
      }
    }
    return newExam;
  }

  async findExam(examId: string) {
    try {
      return await this.readExam(examId);
    } catch (error) {
      return null;
    }
  }

  async readExam(examId: string) {
    const findExam = await this.examsRepository.findById(examId);
    if (!findExam) {
      throw new NotFoundException('Exam not found');
    }
    await this.incrementNumberField(examId, 'totalView', 1);
    return findExam;
  }

  async getExamDetail(examId: string) {
    const findExam = await this.readExam(examId);
    const examsToMembers = await this.examUsersService.readExamUsers(examId);
    const {items: members} = await this.usersService.indexPublicUsersInfo(
      {members: examsToMembers},
      {
        startIndex: 0,
        perPage: 6,
      } as IPagination,
    );
    const questionsToExam = await this.examQuestionsService.readExamQuestions(examId);

    let listQuestion = [],
      totalQuestion = 0;
    if (questionsToExam.length) {
      const {items: questions, headers = {}} = await this.questionsService.indexQuestions(
        {questionsToExam},
        {
          startIndex: 0,
          perPage: 1000,
        } as IPagination,
      );
      listQuestion = questions;
      totalQuestion = headers['x-total-count'];
    }
    await this.incrementNumberField(examId, 'totalView', 1);
    return {
      examInfo: findExam,
      questions: listQuestion,
      members,
      statistic: {
        totalMember: findExam.totalMember,
        totalQuestion,
      },
    };
  }

  async updateExam(examId: string, updateExamInput: UpdateExamInput, userId?: string) {
    const findExam = await this.readExam(examId);
    if (updateExamInput?.totalTime && updateExamInput?.totalTime <= 0) {
      throw new BadRequestException(`Total time is invalid`);
    }
    if (!(await this.isOwnerExam(examId, userId))) {
      throw new BadRequestException(`You don't have permission to update the exam`);
    }

    if (_.isArray(updateExamInput?.questionIds) && updateExamInput.questionIds.length) {
      await this.examQuestionsService.deleteExamQuestionByExamId(examId);
      for (const questionId of updateExamInput.questionIds) {
        await this.examQuestionsService.createExamQuestion({examId: findExam.id}, questionId);
      }
    }
    return this.examsRepository.updateById(examId, {
      ...updateExamInput,
      ...(updateExamInput?.name && {
        slug: updateExamInput?.slug
          ? generateSlug(updateExamInput.slug)
          : generateSlug(updateExamInput?.name),
      }),
      updatedAt: new Date(),
      updatedBy: userId,
    });
  }
}
