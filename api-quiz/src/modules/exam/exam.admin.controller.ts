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
import {ExamsBaseController} from './exam.base.controller';
import {ExamsResponse, CreateExamInput, UpdateExamInput, ExamsFilter} from './exam.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';
import {PermissionGuard} from '../../guards/permission.guard';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('admin.exams')
@Controller('admin/exams')
export class ExamsAdminController extends ExamsBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
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
  async indexExams(@Pagination() pagination: IPagination, @Query() filters: ExamsFilter) {
    return this.examsAdminService.indexExams(filters, pagination);
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
    operationId: 'createExam',
    description: 'Create Exam',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ExamsResponse,
    description: 'Exam created',
  })
  @CommonErrorResponses()
  async createExam(
    @Body()
    createExamInput: CreateExamInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examsService.createExam(createExamInput, userId);
  }

  @Get(':examId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
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

  @Put(':examId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'updateExam',
    description: 'Update Exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
  })
  @CommonErrorResponses()
  async updateExam(
    @Param('examId', ValidationObjectIdPipe) examId: string,
    @Body() updateInput: UpdateExamInput,
    @User(UserDataJwtProperties.USERID) userId: string,
  ) {
    return this.examsService.updateExam(examId, updateInput, userId);
  }

  @Delete(':examId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //   PermissionGuard(
  //     [
  //     ]
  //   )
  // )
  @ApiOperation({
    operationId: 'deleteExam',
    description: 'Delete Exam',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ExamsResponse,
  })
  @CommonErrorResponses()
  async deleteExam(@Param('examId', ValidationObjectIdPipe) examId: string) {
    return this.examsAdminService.deleteExam(examId);
  }
}
