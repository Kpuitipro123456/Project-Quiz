import {Controller, Get, HttpStatus, Body, Param, Put, Delete, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {AnswersBaseController} from './answer.base.controller';
import {
  AnswersResponse,
  UpdateAnswerInput,
  AnswersAdminFilter,
  UpdateVerifyAnswerInput,
} from './answer.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';

@ApiTags('admin.answers')
@Controller('admin/answers')
export class AnswersAdminController extends AnswersBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
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
  async indexAnswers(@Query() filters: AnswersAdminFilter, @Pagination() pagination: IPagination) {
    return this.answersAdminService.indexAnswers(filters, pagination);
  }

  @Get(':answerId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
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
    return this.answersAdminService.updateAnswer(answerId, updateInput, userId);
  }

  @Put(':answerId/verify')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateVerifyAnswer',
    description: 'Update Verify Answer',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: AnswersResponse,
  })
  @CommonErrorResponses()
  async updateVerifyAnswer(
    @Param('answerId', ValidationObjectIdPipe) answerId: string,
    @Body() updateInput: UpdateVerifyAnswerInput,
  ) {
    return this.answersAdminService.updateVerifyAnswer(answerId, updateInput);
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
  async deleteAnswer(@Param('answerId', ValidationObjectIdPipe) answerId: string) {
    return this.answersAdminService.deleteAnswer(answerId);
  }
}
