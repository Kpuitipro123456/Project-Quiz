import {Controller, HttpStatus, Get, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {QuestionStatisticsBaseController} from './questionStatistic.base.controller';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {QuestionStatisticsFilter} from './questionStatistic.dto';

@ApiTags('statistics')
@Controller('statistics')
export class QuestionStatisticsController extends QuestionStatisticsBaseController {
  // @Get('top/contributes')
  @ApiOperation({
    operationId: 'indexContributes',
    description: 'Index Contributes',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Items per page',
    type: Number,
  })
  @CommonErrorResponses()
  async indexTopContributes(
    @Pagination() pagination: IPagination,
    @Query() filters: QuestionStatisticsFilter,
  ) {
    return this.questionStatisticsService.indexContributes(filters, pagination);
  }
}
