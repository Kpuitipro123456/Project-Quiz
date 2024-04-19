import {Controller, Post, HttpStatus, Body, BadRequestException} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {ExamQuestionsBaseController} from './examQuestion.base.controller';
import {CreateExamQuestionInput, CreateExamQuestionAdminInput} from './examQuestion.dto';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';

@ApiTags('exam.questions')
@Controller('exam/questions')
export class ExamUsersController extends ExamQuestionsBaseController {
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
    operationId: 'removeUser',
    description: 'Remove user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async removeUser(
    @Body()
    createExamQuestionAdminInput: CreateExamQuestionAdminInput,
  ) {
    return this.examQuestionsService.deleteExamQuestion(
      createExamQuestionAdminInput.examId,
      createExamQuestionAdminInput.questionId,
    );
  }
}
