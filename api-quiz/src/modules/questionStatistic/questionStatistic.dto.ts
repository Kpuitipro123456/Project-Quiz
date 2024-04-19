import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsOptional, IsNotEmpty} from 'class-validator';

export class QuestionAuthorDto {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Id',
  })
  id?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Name',
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image url',
  })
  imageUrl?: string;
}

export class CreateQuestionStatisticsDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Exam Id',
  })
  examId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User Id',
  })
  userId: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: QuestionAuthorDto,
    description: 'Author',
    required: false,
  })
  author?: string;
}

export class DeleteQuestionStatisticsDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Exam Id',
  })
  examId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'User Id',
  })
  userId: string;
}

export class QuestionStatisticsFilter {
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
