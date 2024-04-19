import {Injectable} from '@nestjs/common';
import {QuestionStatisticsRepository} from './questionStatistic.repository';
import {
  QuestionStatisticsFilter,
  CreateQuestionStatisticsDto,
  DeleteQuestionStatisticsDto,
} from './questionStatistic.dto';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filterMongooseText} from 'acd-util-help';
import {filtersText} from './questionStatistic.constant';

@Injectable()
export class QuestionStatisticsService {
  constructor(
    private readonly questionStatisticsRepository: QuestionStatisticsRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  async incrementNumberField(id: string, field: string, num: number) {
    const incrementObject = {};
    incrementObject[field] = num;
    return this.questionStatisticsRepository.updateById(id, {
      $inc: incrementObject,
    });
  }

  async createContribute(createQuestionStatisticsDto: CreateQuestionStatisticsDto) {
    const checkExist = await this.questionStatisticsRepository.findOne(createQuestionStatisticsDto);
    if (!checkExist) {
      return this.questionStatisticsRepository.create(createQuestionStatisticsDto);
    }
    return this.incrementNumberField(checkExist.id, 'totalQuestions', 1);
  }

  async deleteContribute(deleteQuestionStatisticsDto: DeleteQuestionStatisticsDto) {
    const checkExist = await this.questionStatisticsRepository.findOne(deleteQuestionStatisticsDto);
    if (!checkExist) {
      return this.questionStatisticsRepository.create({
        ...deleteQuestionStatisticsDto,
        totalQuestions: 0,
      });
    }
    return this.incrementNumberField(
      checkExist.id,
      'totalQuestions',
      checkExist.totalQuestions >= 1 ? -1 : 0,
    );
  }

  async indexContributes(filter: QuestionStatisticsFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      filter,
      filtersText,
    );
    if (filter?.examId) {
      findParams.examId = filter.examId;
    }
    if (filter?.userId) {
      findParams.userId = filter.userId;
    }
    const [statistics, count] = await Promise.all([
      this.questionStatisticsRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: '-totalQuestions',
      }),
      this.questionStatisticsRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: statistics,
      headers: responseHeaders,
    };
  }
}
