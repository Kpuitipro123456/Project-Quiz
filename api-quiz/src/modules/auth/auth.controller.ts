import {Controller, Post, Body, HttpStatus, Get} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import {CommonErrorResponses} from '../../decorators/commonErrorResponses.decorator';
import {AuthService} from './auth.service';
import {
  CredentialAuthDto,
  AuthForgotPasswordDto,
  AuthVerifyOtpDto,
  AuthResetPasswordDto,
} from './auth.dto';
import {CreateUserInput} from '../user/user.dto';
import {ACCESS_TOKEN_HEADER_NAME, UserDataJwtProperties} from '../../shared/constants';
import {User} from '../../decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    operationId: 'register',
    description: 'Register Account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  register(@Body() createUserInput: CreateUserInput) {
    return this.authService.register(createUserInput);
  }

  @Post('login')
  @ApiOperation({
    operationId: 'login',
    description: 'Login Account',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  create(@Body() credentialAuthDto: CredentialAuthDto) {
    return this.authService.login(credentialAuthDto);
  }

  @Get('user')
  @ApiBearerAuth(ACCESS_TOKEN_HEADER_NAME)
  @ApiOperation({
    operationId: 'getUserAuthData',
    description: 'Get user auth data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  async getUserAuthData(@User(UserDataJwtProperties.USERID) userId: string) {
    return this.authService.readUser(userId);
  }

  @Post('forgot-password')
  @ApiOperation({
    operationId: 'forgotPassword',
    description: 'Forgot password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  forgotPassword(@Body() authForgotPasswordDto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(authForgotPasswordDto);
  }

  @Post('verify-otp')
  @ApiOperation({
    operationId: 'verifyOtp',
    description: 'Verify Otp',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  verifyOtp(@Body() authVerifyOtpDto: AuthVerifyOtpDto) {
    return this.authService.verifyOtp(authVerifyOtpDto);
  }

  @Post('reset-password')
  @ApiOperation({
    operationId: 'resetPassword',
    description: 'Reset Password',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
  })
  @CommonErrorResponses()
  resetPassword(@Body() authResetPasswordDto: AuthResetPasswordDto) {
    return this.authService.resetPassword(authResetPasswordDto);
  }
}
