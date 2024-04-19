import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {examples} from '../../shared/constants';
import {ExamsStatus} from './exam.constant';
import {getEnumValues} from '../../shared/helpers';

export class BaseExamsResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Name',
    example: examples.examName,
  })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Slug',
    example: examples.examSlug,
  })
  slug?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Description',
    example: examples.groupDescription,
  })
  description: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image url',
    example: examples.thumbnail,
  })
  imageUrl: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image mobile url',
    example: examples.thumbnail,
  })
  imageMobileUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Cover mobile url',
    example: examples.thumbnail,
  })
  coverMobileUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Cover url',
    example: examples.thumbnail,
  })
  coverUrl?: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    description: 'Total time',
    example: 120,
  })
  totalTime: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Priority',
    example: 2,
  })
  priority?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Rate',
    example: 5,
  })
  rate?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(ExamsStatus),
    example: ExamsStatus.PUBLIC,
  })
  status?: ExamsStatus;
}

export class ExamsResponse extends BaseExamsResponse {
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Priority',
    example: 1,
  })
  priority: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Total member',
    example: 9999,
  })
  totalMember: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Total point',
    example: 122,
  })
  totalPoint: number;
}

export class CreateExamInput extends BaseExamsResponse {
  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    description: 'Questions Id',
  })
  @IsString({each: true})
  questionIds?: string[];
}

export class UpdateExamInput {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Name',
    example: examples.examName,
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Slug',
    example: examples.examSlug,
  })
  slug?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Description',
    example: examples.groupDescription,
  })
  description?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image url',
    example: examples.thumbnail,
  })
  imageUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image mobile url',
    example: examples.thumbnail,
  })
  imageMobileUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Cover mobile url',
    example: examples.thumbnail,
  })
  coverMobileUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Cover url',
    example: examples.thumbnail,
  })
  coverUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Total time',
    example: 120,
  })
  totalTime?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Priority',
    example: 2,
  })
  priority?: number;

  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'Rate',
    example: 5,
  })
  rate?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Status',
    type: 'enum',
    enum: getEnumValues<string>(ExamsStatus),
    example: ExamsStatus.PUBLIC,
  })
  status?: ExamsStatus;

  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    description: 'Questions Id',
  })
  @IsString({each: true})
  questionIds?: string[];
}

export class ExamsFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Name',
  })
  name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Description',
  })
  description?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'User Id',
  })
  userId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Date,
    description: 'Start time',
  })
  startTime: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Date,
    description: 'End time',
  })
  endTime: string;
}

export class SubmitExamDtoInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Contest Id',
  })
  contestId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: Object,
    description: 'Answers',
  })
  answers: Record<string, any>;
}
