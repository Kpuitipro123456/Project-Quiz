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
import {UsersBaseController} from './user.base.controller';
import {UsersResponse, CreateUserInput, UpdateUsersInputAdmin, UsersFilter} from './user.dto';
import {ValidationObjectIdPipe} from '../../pipes/validationObjectId.pipe';
import {ACCESS_TOKEN_HEADER_NAME} from '../../shared/constants';
import {Pagination} from '../../decorators/pagination.decorator';
import {IPagination} from '../../adapters/pagination/pagination.interface';

@ApiTags('admin.users')
@Controller('admin/users')
export class UsersAdminController extends UsersBaseController {
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //     PermissionGuard(
  //         [
  //             Permissions.ReadUser,
  //         ]
  //     )
  // )
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
    return this.usersService.indexUsers(filters, pagination);
  }

  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //     PermissionGuard(
  //         [
  //             Permissions.CreateUser,
  //         ]
  //     )
  // )
  @ApiOperation({
    operationId: 'createUser',
    description: 'Create User',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UsersResponse,
    description: 'User created',
  })
  @CommonErrorResponses()
  async createUser(
    @Body()
    createUserInput: CreateUserInput,
  ) {
    return this.usersService.createUser(createUserInput);
  }

  @Get(':userId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //     PermissionGuard(
  //         [
  //             Permissions.ReadUser,
  //         ]
  //     )
  // )
  @ApiOperation({
    operationId: 'readUser',
    description: 'Read User',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UsersResponse,
  })
  @CommonErrorResponses()
  async readUser(@Param('userId', ValidationObjectIdPipe) userId: string) {
    return this.usersService.readUser(userId);
  }

  @Put(':userId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //     PermissionGuard(
  //         [
  //             Permissions.UpdateUser,
  //         ]
  //     )
  // )
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
    @Body() updateInput: UpdateUsersInputAdmin,
  ) {
    return this.usersService.updateUser(userId, updateInput);
  }

  @Delete(':userId')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  // @UseGuards(
  //     PermissionGuard(
  //         [
  //             Permissions.DeleteUser,
  //         ]
  //     )
  // )
  @ApiOperation({
    operationId: 'deleteUser',
    description: 'Delete User',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: UsersResponse,
  })
  @CommonErrorResponses()
  async deleteDeivce(@Param('userId', ValidationObjectIdPipe) userId: string) {
    return this.usersService.deletedUser(userId);
  }
}
