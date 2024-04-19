import {Controller, Post, HttpStatus, Body, BadRequestException} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {ExamUsersBaseController} from './examUser.base.controller';
import {CreateExamUserInput, CreateExamUserAdminInput} from './examUser.dto';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';

@ApiTags('exam.users')
@Controller('exam/users')
export class ExamUsersController extends ExamUsersBaseController {
  @Post('join')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'joinExam',
    description: 'Join exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async joinExam(
    @Body()
    createExamUserInput: CreateExamUserInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examUsersService.createExamUser(createExamUserInput, userId);
  }

  @Post('leave')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'leaveExam',
    description: 'Leave exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async leaveExam(
    @Body()
    createExamUserInput: CreateExamUserInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examUsersService.deleteExamUser(createExamUserInput.examId, userId);
  }

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
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    if (!(await this.examsService.isOwnerExam(createExamUserAdminInput.examId, userId))) {
      throw new BadRequestException(`You don't have permission to add user`);
    }
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
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    if (!(await this.examsService.isOwnerExam(createExamUserAdminInput.examId, userId))) {
      throw new BadRequestException(`You don't have permission to remove user`);
    }
    return this.examUsersService.deleteExamUser(
      createExamUserAdminInput.examId,
      createExamUserAdminInput.userId,
    );
  }
}
