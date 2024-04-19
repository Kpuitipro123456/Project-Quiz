import * as _ from 'lodash';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import {filtersText, QuestionsStatus, defaultFields} from './question.constant';
import {QuestionsRepository} from './question.repository';
import {CreateQuestionInput, QuestionsFilter, PracticeQuestionInputDto} from './question.dto';
import {CategoriesService} from '../category/category.service';
import {TagsService} from '../tag/tag.service';
import {filterMongooseText} from 'acd-util-help';
import {QuestionTagsService} from '../tag/questionTag.service';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {UsersService} from '../user/user.service';
import * as mongoose from 'mongoose';
import {isObjectId} from 'src/shared/helpers';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly categoriesService: CategoriesService,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    private readonly questionTagsService: QuestionTagsService,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly usersService: UsersService,
  ) {}

  private readonly defaultParams: any = filterMongooseText({_deleted: {$ne: true}}, {}, []);

  async readQuestion(questionId: string) {
    const findQuestion = await this.readQuestionById(questionId);
    _.set(findQuestion, 'explanation', null);
    return findQuestion;
  }

  async handleQuestionFilters(findParams, questionFilter) {
    if (questionFilter?.examId) {
      findParams.examId = questionFilter.examId;
    }
    if (questionFilter?.categoryId) {
      findParams.categoryId = questionFilter.categoryId;
    }
    let questionRefIds = [];
    if (_.isArray(questionFilter?.tags)) {
      const questionRefTags = await this.questionTagsService.indexQuestionTags({
        tags: questionFilter.tags,
      });
      questionRefIds = [...questionRefIds, ...questionRefTags.map((o) => o.questionId)];
    }
    if (_.isArray(questionFilter?.questionsToExam)) {
      questionRefIds = [...questionRefIds, ...questionFilter.questionsToExam];
    }
    if (questionRefIds.length) {
      findParams._id = {
        $in: questionRefIds.map((questionId) => new mongoose.Types.ObjectId(questionId)),
      };
    }
    return findParams;
  }

  async indexQuestions(questionFilter: QuestionsFilter, pagination?: IPagination) {
    let findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
        status: QuestionsStatus.ACTIVE,
      },
      questionFilter,
      filtersText,
    );
    findParams = await this.handleQuestionFilters(findParams, questionFilter);
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

    const handleQuestions = questions.map(async (oQuestion) => {
      const question = oQuestion;
      question.explanation = null;
      question.key = null;
      const questionTags = await this.questionTagsService.findQuestionTags({
        questionId: question.id,
      });
      const tagIds = questionTags.filter((q) => isObjectId(q.tagId)).map((o) => o.tagId);
      try {
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
        console.log(`QuestionsService::indexQuestions questionId=${question.id} error`, error);
        return oQuestion;
      }
      return question;
    });

    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: await Promise.all(handleQuestions),
      headers: responseHeaders,
    };
  }

  // Submit practice
  async submitPracticeQuestion(practiceQuestionInputDto: PracticeQuestionInputDto, userId: string) {
    const {questionId, yourAnswers} = practiceQuestionInputDto;
    if (!isObjectId(questionId)) {
      throw new BadRequestException(`${questionId} isn't ObjectId type`);
    }
    // if (!(_.isArray(yourAnswers) && yourAnswers.length)) {
    //   throw new BadRequestException(`${yourAnswers} is invalid`);
    // }
    if (!userId) {
      throw new BadRequestException(`Please login to submit your practice`);
    }
    const findQuestion = await this.questionsRepository.findOne({
      _id: questionId,
    });
    if (!findQuestion) {
      throw new NotFoundException(`Question not found`);
    }

    const results = findQuestion.results;
    if (!(_.isArray(yourAnswers) && yourAnswers.length)) {
      return {
        isCorrect: false,
        yourAnswers,
        results,
      };
    }
    try {
      let isCorrect = true;
      for (let i = 0; i < yourAnswers.length; i++) {
        if (yourAnswers[i].isTrue !== results[i].isTrue) {
          isCorrect = false;
          break;
        }
      }
      return {
        isCorrect,
        yourAnswers,
        results,
      };
    } catch (error) {
      // tslint:disable: no-console
      console.log(`QuestionsService::submitPracticeQuestion error: ${error}`);
      return {
        isCorrect: false,
        yourAnswers,
        results,
      };
    }
  }

  async incrementNumberField(questionId: string, field: string, num: number) {
    const incrementObject = {};
    incrementObject[field] = num;
    return this.questionsRepository.updateById(questionId, {
      $inc: incrementObject,
    });
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
      await this.categoriesService.readCategory(createQuestionInput.categoryId);
    }
    return true;
  }
}
