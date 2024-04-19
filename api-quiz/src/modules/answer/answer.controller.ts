import {Controller, Get, HttpStatus, Body, Param, Put, Query, Post, Delete} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {AnswersBaseController} from './answer.base.controller';
import {
  AnswersResponse,
  AnswersFilter,
  UpdateVerifyAnswerInput,
  CreateAnswerInput,
  AnswersYourFilter,
  UpdateAnswerInput,
} from './answer.dto';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';
import {IOwnerAnswer} from './answer.interface';

@ApiTags('answers')
@Controller('answers')
export class AnswersController extends AnswersBaseController {
  @Get('/questions/:questionId')
  @ApiOperation({
    operationId: 'indexAnswers',
    description: 'Index Answers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
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
  async indexAnswers(
    @Pagination() pagination: IPagination,
    @Param('questionId', ValidationObjectIdPipe) questionId: string,
  ) {
    return this.answersService.indexAnswers(pagination, questionId);
  }

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'createAnswer',
    description: 'Create Answer',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: AnswersResponse,
    description: 'Answer created',
  })
  @CommonErrorResponses()
  async createAnswer(
    @Body()
    createAnswerInput: CreateAnswerInput,
    @User() owner: IOwnerAnswer,
  ) {
    return this.answersService.createAnswer(createAnswerInput, owner);
  }

  @Get(':answerId')
  @ApiOperation({
    operationId: 'readAnswer',
    description: 'Read Answer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
  })
  @CommonErrorResponses()
  async readAnswer(@Param('answerId', ValidationObjectIdPipe) answerId: string) {
    return this.answersService.readAnswer(answerId);
  }

  @Put(':answerId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateAnswer',
    description: 'Update Answer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
  })
  @CommonErrorResponses()
  async updateAnswer(
    @Param('answerId', ValidationObjectIdPipe) answerId: string,
    @Body() updateInput: UpdateAnswerInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.answersService.updateAnswer(answerId, updateInput, userId);
  }

  @Delete(':answerId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'deleteAnswer',
    description: 'Delete Answer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
  })
  @CommonErrorResponses()
  async deleteAnswer(
    @Param('answerId', ValidationObjectIdPipe) answerId: string,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.answersService.deleteAnswer(answerId, userId);
  }

  @Get('')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'indexYourAnswers',
    description: 'Index Your Answers',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
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
  async indexYourAnswers(
    @Query() filters: AnswersYourFilter,
    @Pagination() pagination: IPagination,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.answersService.indexYourAnswers(filters, pagination, userId);
  }
}
