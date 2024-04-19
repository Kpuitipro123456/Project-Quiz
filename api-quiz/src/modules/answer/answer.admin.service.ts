import {Injectable, NotFoundException} from '@nestjs/common';
import {
  CreateAnswerInput,
  UpdateAnswerInput,
  AnswersFilter,
  UpdateVerifyAnswerInput,
} from './answer.dto';
import {filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {AnswersRepository} from './answer.repository';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText} from './answer.constant';
import {AnswersService} from './answer.service';

@Injectable()
export class AnswersAdminService {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly answersService: AnswersService,
  ) {}

  async indexAnswers(answersFilter: AnswersFilter, pagination?: IPagination, userId?: string) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      answersFilter,
      filtersText,
    );
    if (userId) {
      findParams.userId = userId;
    }
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

  async updateVerifyAnswer(answerId: string, updateVerifyAnswerInput: UpdateVerifyAnswerInput) {
    await this.answersService.readAnswer(answerId);
    return this.answersRepository.updateById(answerId, {
      isVerify: updateVerifyAnswerInput.isVerify,
    });
  }

  async updateAnswer(answerId: string, updateAnswer: UpdateAnswerInput, userId: string) {
    await this.answersService.readAnswer(answerId);
    return this.answersRepository.updateById(answerId, updateAnswer);
  }

  async deleteAnswer(answerId: string) {
    await this.answersService.readAnswer(answerId);
    return this.answersRepository.deleteById(answerId);
  }
}
