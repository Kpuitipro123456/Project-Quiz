import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsEmail, IsArray, IsString} from 'class-validator';
import {examples} from '../../shared/constants';
import {UsersStatus, Genders} from './user.constant';
import {getEnumValues} from '../../shared/helpers';

export class BaseUsersResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'First and last name',
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
    description: 'Avatar',
    example: examples.thumbnail,
  })
  imageUrl: string;
}

export class UsersResponse extends BaseUsersResponse {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Code',
    example: examples.referralCode,
  })
  code: string; // Mã giới thiệu của bản thân

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(UsersStatus),
    example: UsersStatus.DRAFT,
  })
  status?: UsersStatus;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'enum',
    description: 'Gender',
    enum: getEnumValues<string>(Genders),
    example: Genders.FEMALE,
  })
  gender?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Age',
    example: 18,
  })
  age?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Target',
    example: 'Đỗ đại học',
  })
  target?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'totalPoint',
    example: 862,
  })
  totalPoint?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'totalHeart',
    example: 235,
  })
  totalHeart?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'totalExam',
    example: 3,
  })
  totalExam?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'totalQuestions',
    example: 62,
  })
  totalQuestions?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'totalAnswers',
    example: 16,
  })
  totalAnswers?: number;
}
export class CreateUserInput extends BaseUsersResponse {
  constructor() {
    super();
  }

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Password',
    example: examples.password,
  })
  password: string;
}

export class UpdateUsersInput {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Name',
    example: examples.name,
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'User name',
    example: examples.userName,
  })
  userName?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Phone number',
    example: examples.phoneNumber,
  })
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    type: String,
    description: 'Email',
    example: examples.email,
  })
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Avatar',
    example: examples.thumbnail,
  })
  imageUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Password',
    example: examples.password,
  })
  password?: string;
}

export class UpdateUsersInputAdmin extends UpdateUsersInput {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(UsersStatus),
    example: UsersStatus.DRAFT,
  })
  status: UsersStatus;
}

export class UsersFilter {
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Members',
    default: [],
  })
  @IsString({each: true})
  members?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Sort point desc',
  })
  sortPointDesc?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Include manager account',
  })
  isAdmin?: boolean;
}
