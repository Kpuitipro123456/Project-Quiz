import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsEmail, Min, Max} from 'class-validator';
import {examples} from '../../shared/constants';
import {OtpsStatus, OTP_LENGTH} from './otp.constant';
import {getEnumValues} from '../../shared/helpers';

export class OtpsResponse {
  @IsEmail()
  @ApiProperty({
    type: String,
    description: 'Email',
    example: examples.email,
  })
  email: string;

  @IsOptional()
  @Min(OTP_LENGTH)
  @Max(OTP_LENGTH)
  @ApiPropertyOptional({
    type: String,
    description: 'Otp',
    example: examples.otp,
  })
  otp?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(OtpsStatus),
    example: OtpsStatus.VALID,
  })
  status?: OtpsStatus;
}

export class CreateOtpInput extends OtpsResponse {
  constructor() {
    super();
  }
}

export class UpdateOtpInput {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(OtpsStatus),
    example: OtpsStatus.VALID,
  })
  status?: OtpsStatus;
}
