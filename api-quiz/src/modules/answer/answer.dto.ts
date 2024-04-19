import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import {examples} from '../../shared/constants';

export class CreateAnswerInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Question Id',
    example: examples.userId,
  })
  questionId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: examples.content,
  })
  content: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Parent Id',
    example: examples.userId,
  })
  parentId: string;
}

export class AnswersResponse extends CreateAnswerInput {}

export class UpdateAnswerInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: examples.content,
  })
  content: string;
}

export class UpdateVerifyAnswerInput {
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    description: 'Verify',
  })
  isVerify: boolean;
}

export class AnswersFilter {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Question Id',
  })
  questionId: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'User Id',
  })
  userId?: string;
}

export class AnswersAdminFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Question Id',
  })
  questionId: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'User Id',
  })
  userId?: string;
}

export class AnswersYourFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Content',
  })
  content: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Question Id',
  })
  questionId: string;
}
