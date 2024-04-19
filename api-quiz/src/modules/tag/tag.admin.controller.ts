import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {TagsBaseController} from './tag.base.controller';
import {TagsResponse, CreateTagInput, UpdateTagInput, TagsFilter} from './tag.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('admin.tags')
@Controller('admin/tags')
export class TagsAdminController extends TagsBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
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

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'createTag',
    description: 'Create Tag',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: TagsResponse,
    description: 'Tag created',
  })
  @CommonErrorResponses()
  async createTag(
    @Body()
    createTagInput: CreateTagInput,
  ) {
    return this.tagsService.createTag(createTagInput);
  }

  @Get(':tagId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'readTag',
    description: 'Read Tag',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TagsResponse,
  })
  @CommonErrorResponses()
  async readTag(@Param('tagId', ValidationObjectIdPipe) tagId: string) {
    return this.tagsService.readTag(tagId);
  }

  @Put(':tagId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'updateTag',
    description: 'Update Tag',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TagsResponse,
  })
  @CommonErrorResponses()
  async updateTag(
    @Param('tagId', ValidationObjectIdPipe) tagId: string,
    @Body() updateInput: UpdateTagInput,
  ) {
    return this.tagsService.updateTag(tagId, updateInput);
  }

  @Delete(':tagId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'deleteTag',
    description: 'Delete Tag',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: TagsResponse,
  })
  @CommonErrorResponses()
  async deleteTag(@Param('tagId', ValidationObjectIdPipe) tagId: string) {
    return this.tagsService.deleteTag(tagId);
  }
}
