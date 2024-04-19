import {ApiPropertyOptional, ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsOptional} from 'class-validator';
import {examples} from '../../shared/constants';

export class CategoriesResponse {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Category name',
    example: examples.categoryName,
  })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Slug',
    example: examples.categorySlug,
  })
  slug?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Code',
    example: examples.code,
  })
  code?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Image Url',
    example: examples.thumbnail,
  })
  imageUrl?: string;
}

export class CreateCategoryInput extends CategoriesResponse {
  constructor() {
    super();
  }
}

export class UpdateCategoryInput extends CategoriesResponse {
  constructor() {
    super();
  }
}

export class CategoriesFilter {
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category name',
  })
  name: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category slug',
  })
  slug: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    description: 'Category code',
  })
  code: string;
}
