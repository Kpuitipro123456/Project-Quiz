import {Controller, HttpStatus, Post, Body, Get, Query, Param, Put, Delete} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {QuestionsBaseController} from './question.base.controller';
import {
  QuestionsResponse,
  CreateQuestionInput,
  UpdateQuestionInput,
  QuestionsFilter,
} from './question.dto';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {User} from 'src/decorators/user.decorator';

@ApiTags('admin.questions')
@Controller('admin/questions')
export class QuestionsAdminController extends QuestionsBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'indexQuestions',
    description: 'Index Questions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: QuestionsResponse,
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
  async indexPositions(@Pagination() pagination: IPagination, @Query() filters: QuestionsFilter) {
    return this.questionsAdminService.indexQuestions(filters, pagination);
  }

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'createQuestion',
    description: 'Create Question',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: QuestionsResponse,
    description: 'Question created',
  })
  @CommonErrorResponses()
  async createField(
    @Body()
    questionInput: CreateQuestionInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.questionsAdminService.createQuestion(questionInput, userId);
  }

  @Get(':questionId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'readQuestion',
    description: 'Read Question',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: QuestionsResponse,
  })
  @CommonErrorResponses()
  async readQuestion(@Param('questionId', ValidationObjectIdPipe) questionId: string) {
    return this.questionsAdminService.readQuestion(questionId);
  }

  @Put(':questionId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateQuestion',
    description: 'Update Question',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: QuestionsResponse,
    description: 'Question updated',
  })
  @CommonErrorResponses()
  async updateQuestion(
    @Param('questionId', ValidationObjectIdPipe) questionId: string,
    @Body() updateInput: UpdateQuestionInput,
  ) {
    return this.questionsAdminService.updateQuestion(questionId, updateInput);
  }

  @Delete(':questionId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'deleteQuestion',
    description: 'Delete Question',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: QuestionsResponse,
  })
  @CommonErrorResponses()
  async deleteQuestion(@Param('questionId', ValidationObjectIdPipe) questionId: string) {
    return this.questionsAdminService.deleteQuestion(questionId);
  }
}
