import * as moment from 'moment';
import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateAnswerInput, UpdateAnswerInput, AnswersFilter} from './answer.dto';
import {filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {AnswersRepository} from './answer.repository';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText} from './answer.constant';
import {IOwnerAnswer} from './answer.interface';
import {QuestionsService} from '../question/question.service';
import {isObjectId} from '../../shared/helpers';

@Injectable()
export class AnswersService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly questionsService: QuestionsService,
  ) {}

  async indexAnswers(pagination: IPagination, questionId: string) {
    if (!isObjectId(questionId)) {
      throw new BadRequestException(`${questionId} isn't ObjectId type`);
    }
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      {},
      filtersText,
    );
    if (questionId) {
      findParams.questionId = questionId;
    }
    const [answers, count] = await Promise.all([
      this.answersRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: 'createdAt',
      }),
      this.answersRepository.count({...findParams, isRoot: true}),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);

    const parentAnswers = [];
    const mappingChildrenAnswers = {};
    for (const answer of answers) {
      if (answer.isRoot) {
        parentAnswers.push(answer);
        continue;
      }
      if (mappingChildrenAnswers[answer.parentId]) {
        mappingChildrenAnswers[answer.parentId].push(answer);
        continue;
      }
      mappingChildrenAnswers[answer.parentId] = [answer];
    }

    return {
      items: parentAnswers.map((o) => {
        return {
          id: o.id,
          content: o.content,
          imageUrls: o.imageUrls,
          questionId: o.questionId,
          parentId: o.parentId,
          owner: o.owner,
          totalHeart: o.totalHeart,
          totalPoint: o.totalHeart,
          isVerify: o.isVerify,
          isRoot: o.isRoot,
          userId: o.userId,
          createdAt: moment(o.createdAt).format('DD/MM/YYYY HH:mm'),
          updatedAt: moment(o.updatedAt).format('DD/MM/YYYY HH:mm'),
          replyAnswers: mappingChildrenAnswers[o.id] || [],
        };
      }),
      headers: responseHeaders,
    };
  }

  async indexYourAnswers(answersFilter: AnswersFilter, pagination: IPagination, userId: string) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      answersFilter,
      filtersText,
    );
    if (answersFilter?.questionId) {
      findParams.questionId = answersFilter.questionId;
    }
    findParams.userId = userId;
    const [answers, count] = await Promise.all([
      this.answersRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: '-createdAt',
      }),
      this.answersRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: answers,
      headers: responseHeaders,
    };
  }

  private async _validateAnswer(inputDate: CreateAnswerInput) {
    if (!isObjectId(inputDate.questionId)) {
      throw new BadRequestException(`${inputDate.questionId} isn't ObjectId type`);
    }
    await this.questionsService.readQuestion(inputDate.questionId);
    if (inputDate?.parentId) {
      if (!isObjectId(inputDate.parentId)) {
        throw new BadRequestException(`${inputDate.parentId} isn't ObjectId type`);
      }
      await this.readAnswer(inputDate.parentId);
    }
  }

  async createAnswer(createAnswerInput: CreateAnswerInput, owner: IOwnerAnswer) {
    await this._validateAnswer(createAnswerInput);
    return this.answersRepository.create({
      ...createAnswerInput,
      parentId: createAnswerInput?.parentId || null,
      isRoot: !createAnswerInput?.parentId,
      userId: owner.id,
      owner: {
        id: owner.id,
        name: owner.name,
        userName: owner.name,
        imageUrl: owner.imageUrl,
        position: owner.position,
      },
    });
  }

  async readAnswer(answerId: string) {
    const findAnswer = await this.answersRepository.findById(answerId);
    if (!findAnswer) {
      throw new NotFoundException('Answer not found');
    }
    return findAnswer;
  }

  async updateAnswer(answerId: string, updateAnswer: UpdateAnswerInput, userId: string) {
    const findAnswer = await this.readAnswer(answerId);
    if (findAnswer.userId !== userId) {
      throw new BadRequestException(`You don't have permission to update this answer`);
    }
    return this.answersRepository.updateById(answerId, updateAnswer);
  }

  async deleteAnswer(answerId: string, userId: string) {
    const findAnswer = await this.readAnswer(answerId);
    if (findAnswer.userId !== userId) {
      throw new BadRequestException(`You don't have permission to delete this answer`);
    }
    return this.answersRepository.deleteById(answerId);
  }
}
