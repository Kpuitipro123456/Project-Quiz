import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import {examples} from '../../shared/constants';

export class CreateExamQuestionInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Exam Id',
    example: examples.objectId,
  })
  examId: string;
}

export class ExamQuestionsFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Exam Id',
  })
  examId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Question Id',
  })
  questionId?: string;
}

export class CreateExamQuestionAdminInput extends CreateExamQuestionInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Question Id',
    example: examples.objectId,
  })
  questionId: string;
}
