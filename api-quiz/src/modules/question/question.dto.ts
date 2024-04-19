import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsArray, ArrayNotEmpty, IsString} from 'class-validator';
import {examples} from '../../shared/constants';
import {QuestionsStatus} from './question.constant';
import {getEnumValues} from '../../shared/helpers';
export class QuestionsBaseResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Title',
    example: examples.questionTitle,
  })
  title: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Code',
    example: examples.questionCode,
  })
  code?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Question',
    example: examples.questionContent,
  })
  question: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'explanation',
    example: examples.questionexplanation,
  })
  explanation: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Tags',
    example: examples.questionFields,
  })
  tags?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category Id',
    example: examples.objectId,
  })
  categoryId?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(QuestionsStatus),
    example: QuestionsStatus.ACTIVE,
  })
  status: QuestionsStatus;
}

export class QuestionsResponse extends QuestionsBaseResponse {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'answers',
    example: examples.questionAnswers,
  })
  answers?: Record<any, any>[];

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'UserId',
    example: examples.userId,
  })
  userId?: string;
}

export class QuestionInput extends QuestionsBaseResponse {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'answers',
    example: examples.questionAnswers,
  })
  answers?: Record<any, any>[];
}

export class CreateQuestionInput extends QuestionsBaseResponse {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'answers',
    example: examples.questionAnswersResult,
  })
  answers?: Record<any, any>[];
}

export class UpdateQuestionInput extends QuestionsBaseResponse {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'answers',
    example: examples.questionAnswersResult,
  })
  answers?: Record<any, any>[];
}

export class QuestionsFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Title',
  })
  title?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Tags',
  })
  tags?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Questions To Exam',
  })
  questionsToExam?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category Id',
  })
  categoryId?: string;
}

export class PracticeQuestionInputDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Question Id',
    example: examples.objectId,
  })
  questionId: string;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'answers',
    example: examples.questionAnswersResult,
  })
  yourAnswers?: Record<string, any>[];
}
