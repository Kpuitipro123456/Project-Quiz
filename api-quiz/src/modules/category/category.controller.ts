import {Controller, Get, HttpStatus, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {CategoriesBaseController} from './category.base.controller';
import {CategoriesResponse, CategoriesFilter} from './category.dto';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController extends CategoriesBaseController {
  @Get()
  @ApiOperation({
    operationId: 'indexCategories',
    description: 'Index Categories',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoriesResponse,
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
  async indexCategories(@Pagination() pagination: IPagination, @Query() filters: CategoriesFilter) {
    return this.categoriesService.indexCategories(filters, pagination);
  }
}
