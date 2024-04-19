import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import {examples} from '../../shared/constants';

export class CreateExamUserInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Exam Id',
    example: examples.objectId,
  })
  examId: string;
}

export class ExamUsersFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Exam Id',
  })
  examId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'User Id',
  })
  userId?: string;
}

export class CreateExamUserAdminInput extends CreateExamUserInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User Id',
    example: examples.objectId,
  })
  userId: string;
}
