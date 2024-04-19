import * as _ from 'lodash';
import {
  Inject,
  forwardRef,
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {TagsRepository} from './tag.repository';
import {CreateTagInput, UpdateTagInput, TagsFilter} from './tag.dto';
import {generateSlug, filterMongooseText} from 'acd-util-help';
import {IPagination} from '../../adapters/pagination/pagination.interface';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {filtersText} from './tag.constant';
import {QuestionTagsService} from './questionTag.service';
@Injectable()
export class TagsService {
  constructor(
    private readonly tagsRepository: TagsRepository,
    private readonly paginationHeaderHelper: PaginationHeaderHelper,
    private readonly questionTagsService: QuestionTagsService,
  ) {}

  async indexTags(tagsFilter: TagsFilter, pagination?: IPagination) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      tagsFilter,
      filtersText,
    );
    if (tagsFilter?.fieldId) {
      findParams.fieldId = tagsFilter.fieldId;
    }
    const [tags, count] = await Promise.all([
      this.tagsRepository.find(findParams, {
        ...(pagination && {skip: pagination.startIndex}),
        ...(pagination && {limit: pagination.perPage}),
        sort: {createdAt: -1},
      }),
      this.tagsRepository.count(findParams),
    ]);
    const responseHeaders = this.paginationHeaderHelper.getHeaders(pagination, count);
    return {
      items: tags,
      headers: responseHeaders,
    };
  }

  async createTag(createTagInput: CreateTagInput) {
    const slug = createTagInput?.slug
      ? generateSlug(createTagInput.slug)
      : generateSlug(createTagInput.name);
    const findTag = await this.tagsRepository.findOne({
      $or: [{name: createTagInput.name}, {slug}],
    });
    if (!findTag) {
      return this.tagsRepository.create({
        ...createTagInput,
        slug,
      });
    }
    if (findTag.name === createTagInput.name) {
      throw new BadRequestException(`Tag name ${findTag.name} is exist`);
    }
    if (findTag.slug === slug) {
      throw new BadRequestException(
        `Slug ${slug} is exist. Please change tag name ${findTag.name}`,
      );
    }
    throw new InternalServerErrorException();
  }

  async readTag(tagId: string) {
    const findTag = await this.tagsRepository.findById(tagId);
    if (!findTag) {
      throw new NotFoundException('Tag not found');
    }
    return findTag;
  }

  async readTagByConditions(conditions: Record<any, any>) {
    return this.tagsRepository.find(conditions);
  }

  async updateTagCondition(tagId: string, conditions: {}) {
    const findTag = await this.tagsRepository.findById(tagId);
    if (!findTag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagsRepository.updateById(tagId, {...conditions, updatedAt: new Date()});
  }

  async updateTag(tagId: string, updateTagInput: UpdateTagInput) {
    await this.readTag(tagId);
    const genSlug = updateTagInput?.slug
      ? generateSlug(updateTagInput.slug)
      : generateSlug(updateTagInput?.name);
    const findTag = await this.tagsRepository.findOne({
      _id: {$ne: tagId},
      $or: [{name: updateTagInput.name}, {slug: genSlug}],
    });
    if (!findTag) {
      return this.tagsRepository.updateById(tagId, {
        ...updateTagInput,
        ...(updateTagInput?.name && {slug: genSlug}),
        updatedAt: new Date(),
      });
    }
    if (findTag.name === updateTagInput.name) {
      throw new BadRequestException(`Tag name ${findTag.name} is exist`);
    }
    if (findTag.slug === genSlug) {
      throw new BadRequestException(
        `Slug ${genSlug} is exist. Please change tag name ${findTag.name}`,
      );
    }
    throw new InternalServerErrorException();
  }

  async deleteTag(tagId: string) {
    const deleteTag = await this.tagsRepository.deleteById(tagId);
    if (!deleteTag) {
      throw new NotFoundException('Tag not found');
    }
    await this.questionTagsService.deleteQuestionTags({tagId});
    return _.pick(deleteTag, ['id', 'name', 'slug']);
  }
}
