import {Controller, Post, HttpStatus, Body, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {ExamQuestionsBaseController} from './examQuestion.base.controller';
import {CreateExamQuestionAdminInput} from './examQuestion.dto';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';

@ApiTags('admin.exam.questions')
@Controller('admin/exam/questions')
export class ExamQuestionsAdminController extends ExamQuestionsBaseController {
  @Post('add')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'addMember',
    description: 'Add member',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async addMember(
    @Body()
    createExamQuestionAdminInput: CreateExamQuestionAdminInput,
  ) {
    return this.examQuestionsService.createExamQuestion(
      {
        examId: createExamQuestionAdminInput.examId,
      },
      createExamQuestionAdminInput.questionId,
    );
  }

  @Post('remove')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'removeQuestion',
    description: 'Remove Question',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async removeQuestion(
    @Body()
    createExamQuestionAdminInput: CreateExamQuestionAdminInput,
  ) {
    return this.examQuestionsService.deleteExamQuestion(
      createExamQuestionAdminInput.examId,
      createExamQuestionAdminInput.questionId,
    );
  }
}
