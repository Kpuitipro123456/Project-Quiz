import {Controller, Get, HttpStatus, Post, Body, Param, Put, Delete} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {OtpsBaseController} from './otp.base.controller';
import {OtpsResponse, CreateOtpInput, UpdateOtpInput} from './otp.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('admin.otps')
@Controller('admin/otps')
export class OtpsAdminController extends OtpsBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'indexOtps',
    description: 'Index Otps',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: OtpsResponse,
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
  async indexOtps(@Pagination() pagination: IPagination) {
    return this.otpsService.indexOtps(pagination);
  }

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'createOtp',
    description: 'Create Otp',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: OtpsResponse,
    description: 'Otp created',
  })
  @CommonErrorResponses()
  async createOtp(
    @Body()
    createOtpInput: CreateOtpInput,
  ) {
    return this.otpsService.createOtp(createOtpInput);
  }

  @Get(':otpId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'readOtp',
    description: 'Read Otp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: OtpsResponse,
  })
  @CommonErrorResponses()
  async readOtp(@Param('otpId', ValidationObjectIdPipe) otpId: string) {
    return this.otpsService.readOtp(otpId);
  }

  @Put(':otpId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateOtp',
    description: 'Update Otp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: OtpsResponse,
  })
  @CommonErrorResponses()
  async updateOtp(
    @Param('otpId', ValidationObjectIdPipe) otpId: string,
    @Body() updateInput: UpdateOtpInput,
  ) {
    return this.otpsService.updateOtp(otpId, updateInput);
  }

  @Delete(':otpId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'deleteOtp',
    description: 'Delete Otp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: OtpsResponse,
  })
  @CommonErrorResponses()
  async deleteDeivce(@Param('otpId', ValidationObjectIdPipe) otpId: string) {
    return this.otpsService.deleteOtp(otpId);
  }
}
