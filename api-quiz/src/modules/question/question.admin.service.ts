import * as _ from 'lodash';
import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import {filtersText, QuestionsStatus, defaultFields} from './question.constant';
import {QuestionsRepository} from './question.repository';
import {CreateQuestionInput, UpdateQuestionInput, QuestionsFilter} from './question.dto';
import {CategoriesService} from '../category/category.service';
import {TagsService} from '../tag/tag.service';
import {filterMongooseText} from 'acd-util-help';
import {QuestionTagsService} from '../tag/questionTag.service';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {UsersService} from '../user/user.service';
import {isObjectId, uuidForUid} from '../../shared/helpers';
import {QuestionsService} from './question.service';

@Injectable()
export class QuestionsAdminService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly categoriesService: CategoriesService,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    private readonly questionTagsService: QuestionTagsService,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly questionsService: QuestionsService,
    private readonly usersService: UsersService,
  ) {}

  private readonly defaultParams: any = filterMongooseText({_deleted: {$ne: true}}, {}, []);

  async readQuestion(questionId: string) {
    return this.readQuestionById(questionId);
  }

  async createQuestion(createQuestionInput: CreateQuestionInput, userId: string) {
    await this._validateQuestionInput(createQuestionInput);
    if (createQuestionInput?.code) {
      const isExistQuestion = await this.questionsRepository.findOne({
        code: createQuestionInput.code,
        _deleted: {
          $ne: true,
        },
      });
      if (isExistQuestion) {
        throw new BadRequestException(`Code ${createQuestionInput.code} is exist`);
      }
    }
    const createQuestion = await this.questionsRepository.create({...createQuestionInput, userId});

    const handelCreateQuestionTags = createQuestionInput?.tags?.map(async (tagId) => {
      this.questionTagsService.createQuestionTag({questionId: createQuestion.id, tagId});
    });

    await Promise.all([handelCreateQuestionTags]);

    const results = createQuestionInput.answers.map((o) => {
      return {
        answerUid: o.answerUid || uuidForUid(),
        content: o.content,
        isTrue: o.isTrue,
      };
    });
    await this.questionsRepository.updateById(createQuestion.id, {
      results,
      answers: results.map((o) => {
        return {
          answerUid: o.answerUid,
          content: o.content,
        };
      }),
    });
    return createQuestion;
  }

  async updateQuestion(questionId: string, updateQuestionInput: UpdateQuestionInput) {
    const findQuestion = await this.questionsRepository.findOne({
      _id: questionId,
      _deleted: {
        $ne: true,
      },
    });
    if (!findQuestion) {
      throw new NotFoundException('Question not found');
    }
    await this._validateQuestionInput(updateQuestionInput);
    await this.questionTagsService.deleteQuestionTags({questionId: findQuestion.id});

    const handelCreateQuestionTags = updateQuestionInput?.tags?.map(async (tagId) => {
      this.questionTagsService.createQuestionTag({questionId: findQuestion.id, tagId});
    });

    await Promise.all([handelCreateQuestionTags]);

    const results = updateQuestionInput.answers.map((o) => {
      return {
        answerUid: o.answerUid || uuidForUid(),
        content: o.content,
        isTrue: o.isTrue,
      };
    });

    return this.questionsRepository.updateById(findQuestion.id, {
      ...(updateQuestionInput.title && {title: updateQuestionInput.title}),
      ...(updateQuestionInput.code && {code: updateQuestionInput.code}),
      ...(updateQuestionInput.question && {question: updateQuestionInput.question}),
      ...(updateQuestionInput.explanation && {explanation: updateQuestionInput.explanation}),
      ...(updateQuestionInput.status && {status: updateQuestionInput.status}),
      results,
      answers: results.map((o) => {
        return {
          answerUid: o.answerUid,
          content: o.content,
        };
      }),
      updatedAt: new Date(),
    });
  }

  async deleteQuestion(questionId: string, userId?: string) {
    await this.readQuestionById(questionId);
    await this.questionTagsService.deleteQuestionTags({questionId});
    return this.questionsRepository.updateById(questionId, {
      _deleted: true,
      status: QuestionsStatus.INACTIVE,
    });
  }

  async indexQuestions(questionFilter: QuestionsFilter, pagination?: IPagination) {
    let findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      questionFilter,
      filtersText,
    );
    findParams = await this.questionsService.handleQuestionFilters(findParams, questionFilter);
    const sort: Record<string, number> = {createdAt: -1};
    const [questions, count] = await Promise.all([
      this.questionsRepository.aggregate([
        {
          $match: findParams,
        },
        {
          $project: defaultFields,
        },
        {$sort: sort},
        {$skip: pagination.startIndex},
        {$limit: pagination.perPage},
      ]),
      this.countQuestions(findParams),
    ]);

    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    for (const question of questions) {
      try {
        const questionTags = await this.questionTagsService.findQuestionTags({
          questionId: question.id,
        });
        const tagIds = questionTags.filter((q) => isObjectId(q.tagId)).map((o) => o.tagId);
        const [userInfo, categoryInfo, tagInfos] = await Promise.all([
          this.usersService.findUser(question.userId),
          this.categoriesService.findCategory(question.categoryId),
          this.tagsService.readTagByConditions({
            _id: {
              $in: tagIds,
            },
          }),
        ]);
        question.user = userInfo && {
          id: userInfo.id,
          name: userInfo.name,
          userName: userInfo.userName,
          imageUrl: userInfo.imageUrl,
        };
        question.category = categoryInfo && {
          id: categoryInfo?.id,
          name: categoryInfo?.name,
        };
        question.tags =
          tagInfos &&
          tagInfos.length &&
          tagInfos.map((t) => {
            return {
              id: t.id,
              name: t.name,
            };
          });
      } catch (error) {
        // tslint:disable: no-console
        console.log(`QuestionsAdminService::indexQuestions questionId=${question.id} error`, error);
      }
    }
    return {
      items: questions,
      headers: responseHeaders,
    };
  }

  async countQuestions(findParams: Record<string, any>) {
    return this.questionsRepository.count({...findParams, ...this.defaultParams});
  }

  async readQuestionById(questionId: string) {
    const findQuestion = await this.questionsRepository.findById(questionId);
    if (!findQuestion) {
      throw new NotFoundException('Question not found');
    }
    return findQuestion;
  }

  async _validateQuestionInput(createQuestionInput: CreateQuestionInput) {
    if (createQuestionInput?.categoryId) {
      if (!isObjectId(createQuestionInput.categoryId)) {
        throw new BadRequestException(`${createQuestionInput.categoryId} isn't ObjectId type`);
      }
      await this.categoriesService.readCategory(createQuestionInput.categoryId);
    }
    if (createQuestionInput?.tags) {
      for (const tagId of createQuestionInput?.tags) {
        if (!isObjectId(tagId)) {
          throw new BadRequestException(`${tagId} isn't ObjectId type`);
        }
        await this.tagsService.readTag(tagId);
      }
    }
    return true;
  }
}
