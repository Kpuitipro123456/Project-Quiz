import {Controller, Get, HttpStatus, Post, Body, Param, Put, Delete, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {CategoriesBaseController} from './category.base.controller';
import {
  CategoriesResponse,
  CreateCategoryInput,
  UpdateCategoryInput,
  CategoriesFilter,
} from './category.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('admin.categories')
@Controller('admin/categories')
export class CategoriesAdminController extends CategoriesBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
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

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'createCategory',
    description: 'Create Category',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CategoriesResponse,
    description: 'Category created',
  })
  @CommonErrorResponses()
  async createCategory(
    @Body()
    createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoriesService.createCategory(createCategoryInput);
  }

  @Get(':categoryId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'readCategory',
    description: 'Read Category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoriesResponse,
  })
  @CommonErrorResponses()
  async readCategory(@Param('categoryId', ValidationObjectIdPipe) categoryId: string) {
    return this.categoriesService.readCategory(categoryId);
  }

  @Put(':categoryId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateCategory',
    description: 'Update Category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoriesResponse,
  })
  @CommonErrorResponses()
  async updateCategory(
    @Param('categoryId', ValidationObjectIdPipe) categoryId: string,
    @Body() updateInput: UpdateCategoryInput,
  ) {
    return this.categoriesService.updateCategory(categoryId, updateInput);
  }

  @Delete(':categoryId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'deleteCategory',
    description: 'Delete Category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CategoriesResponse,
  })
  @CommonErrorResponses()
  async deleteCategory(@Param('categoryId', ValidationObjectIdPipe) categoryId: string) {
    return this.categoriesService.deleteCategory(categoryId);
  }
}
