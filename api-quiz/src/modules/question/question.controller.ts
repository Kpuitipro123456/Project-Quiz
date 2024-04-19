import {Controller, HttpStatus, Get, Query, Param, Post, Body, Delete} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {QuestionsBaseController} from './question.base.controller';
import {QuestionsResponse, QuestionsFilter, PracticeQuestionInputDto} from './question.dto';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {User} from 'src/decorators/user.decorator';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController extends QuestionsBaseController {
  @Get()
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
    return this.questionsService.indexQuestions(filters, pagination);
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
    return this.questionsService.readQuestion(questionId);
  }

  @Post('submit')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'submitPracticeQuestion',
    description: 'Submit Practice Question',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: QuestionsResponse,
  })
  @CommonErrorResponses()
  async submitPracticeQuestion(
    @Body()
    practiceQuestionInputDto: PracticeQuestionInputDto,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.questionsService.submitPracticeQuestion(practiceQuestionInputDto, userId);
  }
}
