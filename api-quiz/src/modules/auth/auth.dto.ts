import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsEmail} from 'class-validator';
import {examples} from '../../shared/constants';

export class CredentialAuthDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Phone number or email',
    example: examples.email,
  })
  phoneNumberOrEmail: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: examples.password,
  })
  password: string;
}

export class AuthsResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Id',
    example: examples.objectId,
  })
  id: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Name',
    example: examples.name,
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User name',
    example: examples.userName,
  })
  userName: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: examples.phoneNumber,
  })
  phoneNumber: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    type: String,
    description: 'Email',
    example: examples.email,
  })
  email?: string;
}

export class AuthForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email',
    example: examples.email,
  })
  email: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Url redirect',
    example: examples.urlRedirect,
  })
  url?: string;
}

export class AuthVerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email',
    example: examples.email,
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Otp',
    example: examples.otp,
  })
  otp: string;
}

export class AuthResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: examples.password,
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Token',
    example: examples.token,
  })
  token: string;
}
