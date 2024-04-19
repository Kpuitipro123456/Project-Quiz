import * as _ from 'lodash';
import {Injectable, NotFoundException} from '@nestjs/common';
import {QuestionTagsRepository} from './questionTag.repository';
import {CreateQuestionTagInput, QuestionTagsFilter} from './tag.dto';
import {filterMongooseText} from 'acd-util-help';
import {filtersText} from './tag.constant';

@Injectable()
export class QuestionTagsService {
  constructor(private readonly questionTagsRepository: QuestionTagsRepository) {}

  async indexQuestionTags(tagsFilter: QuestionTagsFilter) {
    const findParams: any = filterMongooseText(
      {
        _deleted: {
          $ne: true,
        },
      },
      tagsFilter,
      filtersText,
    );
    if (tagsFilter?.tagId) {
      findParams.tagId = tagsFilter.tagId;
    }
    if (tagsFilter?.questionId) {
      findParams.questionId = tagsFilter.questionId;
    }
    if (_.isArray(tagsFilter?.tags)) {
      findParams.tagId = {
        $in: tagsFilter.tags,
      };
    }
    return this.questionTagsRepository.find(findParams, {
      sort: {createdAt: -1},
    });
  }

  async findQuestionTags(conditions: Record<any, any>, customFileds?: Record<any, any>) {
    return this.questionTagsRepository.find(conditions, customFileds);
  }

  async createQuestionTag(createQuestionTagInput: CreateQuestionTagInput) {
    return this.questionTagsRepository.findOneOrCreate(
      createQuestionTagInput,
      createQuestionTagInput,
    );
  }

  async readQuestionTag(questionId: string, tagId: string) {
    const findQuestionTag = await this.questionTagsRepository.findOne({questionId, tagId});
    if (!findQuestionTag) {
      throw new NotFoundException('Question tag not found');
    }
    return findQuestionTag;
  }

  async deleteQuestionTags(conditions: Record<string, string>) {
    const deleteItems = await this.questionTagsRepository.deleteMany(conditions);
    return !!deleteItems;
  }
}
