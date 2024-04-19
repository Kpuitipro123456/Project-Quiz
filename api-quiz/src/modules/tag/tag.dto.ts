import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional, IsString, IsArray} from 'class-validator';
import {examples} from '../../shared/constants';

export class TagsResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Tag name',
    example: examples.tagName,
  })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Slug',
    example: examples.tagSlug,
  })
  slug?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Field Id',
    example: examples.objectId,
  })
  fieldId?: string;
}

export class CreateTagInput extends TagsResponse {
  constructor() {
    super();
  }
}

export class UpdateTagInput extends TagsResponse {
  constructor() {
    super();
  }
}

export class TagsFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Tag name',
  })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Tag slug',
  })
  slug?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Field Id',
  })
  fieldId?: string;
}

export class StatisticTagsFilter extends TagsFilter {
  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Field Ids',
    default: [],
  })
  @IsString({each: true})
  fieldIds?: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Exam Id',
  })
  examId?: string;
}

export class CreateQuestionTagInput {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Question Id',
    example: examples.objectId,
  })
  questionId: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Tag Id',
    example: examples.objectId,
  })
  tagId: string;
}

export class QuestionTagsFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Question Id',
  })
  questionId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Tag Id',
  })
  tagId?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: Array,
    isArray: true,
    description: 'Tags',
  })
  tags?: string[];
}
