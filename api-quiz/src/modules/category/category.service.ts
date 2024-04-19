import * as _ from 'lodash';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {CategoriesRepository} from './category.repository';
import {CreateCategoryInput, UpdateCategoryInput, CategoriesFilter} from './category.dto';
import {generateSlug, filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText} from './category.constant';
import {ICategories} from './category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
  ) {}

  async indexCategories(categoriesFilter: CategoriesFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      categoriesFilter,
      filtersText,
    );
    const [categories, count] = await Promise.all([
      this.categoriesRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: {createdAt: -1}, // or sort: '-createdAt',
      }),
      this.categoriesRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: categories,
      headers: responseHeaders,
    };
  }

  async createCategory(createCategoryInput: CreateCategoryInput) {
    const slug = createCategoryInput?.slug
      ? generateSlug(createCategoryInput.slug)
      : generateSlug(createCategoryInput.name);
    const conditions: Record<string, any> = [{name: createCategoryInput.name}, {slug}];
    if (!!createCategoryInput?.code) {
      conditions.push({code: createCategoryInput.code});
    }
    const findCategory = await this.categoriesRepository.findOne({
      $or: conditions,
    });
    if (!findCategory) {
      return this.categoriesRepository.create({
        ...createCategoryInput,
        slug,
      });
    }
    if (findCategory.name === createCategoryInput.name) {
      throw new BadRequestException(`Category name ${findCategory.name} is exist`);
    }
    if (findCategory.slug === slug) {
      throw new BadRequestException(
        `Slug ${slug} is exist. Please change category name ${findCategory.name}`,
      );
    }
    if (createCategoryInput?.code && findCategory.code === createCategoryInput.code) {
      throw new BadRequestException(`Category code ${findCategory.code} is exist`);
    }
    throw new InternalServerErrorException();
  }

  async findCategory(categoryId: string) {
    try {
      return await this.readCategory(categoryId);
    } catch (error) {
      return null;
    }
  }

  async readCategory(categoryId: string) {
    let findCategory = await this.categoriesRepository.findById(categoryId);
    if (!findCategory) {
      throw new NotFoundException('Category not found');
    }
    return findCategory;
  }

  async readCategoryByConditions(conditions: Record<any, any>) {
    return this.categoriesRepository.findOne(conditions);
  }

  async updateCategoryCondition(categoryId: string, conditions: {}) {
    const findCategory = await this.categoriesRepository.findById(categoryId);
    if (!findCategory) {
      throw new NotFoundException('Category not found');
    }
    return this.categoriesRepository.updateById(categoryId, {...conditions, updatedAt: new Date()});
  }

  async updateCategory(categoryId: string, updateCategoryInput: UpdateCategoryInput) {
    await this.readCategory(categoryId);
    const genSlug = updateCategoryInput?.slug
      ? generateSlug(updateCategoryInput.slug)
      : generateSlug(updateCategoryInput?.name);
    const findCategory = await this.categoriesRepository.findOne({
      _id: {$ne: categoryId},
      $or: [
        {name: updateCategoryInput.name},
        {slug: genSlug},
        updateCategoryInput.code && {code: updateCategoryInput.code},
      ],
    });
    if (!findCategory) {
      return this.categoriesRepository.updateById(categoryId, {
        ...updateCategoryInput,
        ...(updateCategoryInput?.name && {slug: genSlug}),
        updatedAt: new Date(),
      });
    }
    if (findCategory.name === updateCategoryInput.name) {
      throw new BadRequestException(`Category name ${findCategory.name} is exist`);
    }
    if (findCategory.slug === genSlug) {
      throw new BadRequestException(
        `Slug ${genSlug} is exist. Please change category name ${findCategory.name}`,
      );
    }
    if (findCategory.code === updateCategoryInput.code) {
      throw new BadRequestException(`Category code ${findCategory.code} is exist`);
    }
    throw new InternalServerErrorException();
  }

  async deleteCategory(categoryId: string) {
    const deleteCategory = await this.categoriesRepository.deleteById(categoryId);
    if (!deleteCategory) {
      throw new NotFoundException('Category not found');
    }
    return _.pick(deleteCategory, ['id', 'name', 'slug', 'code']);
  }
}
