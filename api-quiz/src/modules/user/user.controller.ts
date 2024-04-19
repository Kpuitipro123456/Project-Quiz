import {Controller, Get, HttpStatus, Body, Param, Put, Query} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {UsersBaseController} from './user.base.controller';
import {UsersResponse, UpdateUsersInput, UsersFilter} from './user.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('users')
@Controller('users')
export class UsersController extends UsersBaseController {
  @Get(':userId')
  @ApiOperation({
    operationId: 'readPublicUserInfo',
    description: 'Read public user information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UsersResponse,
  })
  @CommonErrorResponses()
  async readPublicUserInfo(@Param('userId', ValidationObjectIdPipe) userId: string) {
    return this.usersService.readPublicUserInfo(userId);
  }

  @Put(':userId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'updateUser',
    description: 'Update User',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UsersResponse,
  })
  @CommonErrorResponses()
  async updateUser(
    @Param('userId', ValidationObjectIdPipe) userId: string,
    @Body() updateInput: UpdateUsersInput,
    @User(UserDataJwtProperties.USERID) selfUserId: string,
  ) {
    return this.usersService.updateUser(userId, updateInput, selfUserId);
  }

  @Get()
  @ApiOperation({
    operationId: 'indexUsers',
    description: 'Index Users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UsersResponse,
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
  async indexUsers(@Pagination() pagination: IPagination, @Query() filters: UsersFilter) {
    return this.usersService.indexPublicUsersInfo(filters, pagination);
  }
}
