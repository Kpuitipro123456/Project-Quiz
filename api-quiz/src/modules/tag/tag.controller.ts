import {Controller, Get, HttpStatus, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {TagsBaseController} from './tag.base.controller';
import {TagsResponse, TagsFilter, StatisticTagsFilter} from './tag.dto';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('tags')
@Controller('tags')
export class TagsController extends TagsBaseController {
  @Get()
  @ApiOperation({
    operationId: 'indexTags',
    description: 'Index Tags',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TagsResponse,
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
  async indexTags(@Pagination() pagination: IPagination, @Query() filters: TagsFilter) {
    return this.tagsService.indexTags(filters, pagination);
  }
}
