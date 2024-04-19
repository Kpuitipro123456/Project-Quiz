import {Controller, Post, HttpStatus, Body, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {ExamUsersBaseController} from './examUser.base.controller';
import {CreateExamUserAdminInput} from './examUser.dto';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';

@ApiTags('admin.exam.users')
@Controller('admin/exam/users')
export class ExamUsersAdminController extends ExamUsersBaseController {
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
    createExamUserAdminInput: CreateExamUserAdminInput,
  ) {
    return this.examUsersService.createExamUser(
      {
        examId: createExamUserAdminInput.examId,
      },
      createExamUserAdminInput.userId,
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
    createExamUserAdminInput: CreateExamUserAdminInput,
  ) {
    return this.examUsersService.deleteExamUser(
      createExamUserAdminInput.examId,
      createExamUserAdminInput.userId,
    );
  }
}
