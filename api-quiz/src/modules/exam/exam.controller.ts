import {Controller, Get, HttpStatus, Post, Body, Param, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {ExamsBaseController} from './exam.base.controller';
import {ExamsResponse, ExamsFilter, SubmitExamDtoInput} from './exam.dto';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';

@ApiTags('exams')
@Controller('exams')
export class ExamsController extends ExamsBaseController {
  @Get()
  @ApiOperation({
    operationId: 'indexExams',
    description: 'Index Exams',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
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
  async indexExams(@Query() filters: ExamsFilter, @Pagination() pagination: IPagination) {
    return this.examsService.indexExams(filters, pagination);
  }

  @Post('submit')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'submitExam',
    description: 'Submit Exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ExamsResponse,
  })
  @CommonErrorResponses()
  async submitExam(
    @Body()
    submitExamDtoInput: SubmitExamDtoInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examsService.submitExam(submitExamDtoInput, userId);
  }

  @Get(':examId')
  @ApiOperation({
    operationId: 'readExam',
    description: 'Read Exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
  })
  @CommonErrorResponses()
  async readExam(@Param('examId', ValidationObjectIdPipe) examId: string) {
    return this.examsService.getExamDetail(examId);
  }

  @Get(':examId/members')
  @ApiOperation({
    operationId: 'getMembers',
    description: 'Get members',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
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
  async getMembers(
    @Pagination() pagination: IPagination,
    @Param('examId', ValidationObjectIdPipe) examId: string,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examsService.getMembers(examId, pagination, userId);
  }

  @Get(':examId/achievements')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'getAchievements',
    description: 'Get my achievement in the exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
  })
  @CommonErrorResponses()
  async getAchievements(
    @Param('examId', ValidationObjectIdPipe) examId: string,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examsService.getAchievements(examId, userId);
  }
}
