import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {TagsAdminController} from './tag.admin.controller';
import {TagsController} from './tag.controller';
import {TagsService} from './tag.service';
import {QuestionTagsService} from './questionTag.service';
import {TagsRepository} from './tag.repository';
import {QuestionTagsRepository} from './questionTag.repository';
import {TagsSchema, QuestionTagsSchema} from './tag.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {QuestionModule} from '../question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: DbModel.Tags, schema: TagsSchema},
      {name: DbModel.QuestionTags, schema: QuestionTagsSchema},
    ]),
    forwardRef(() => QuestionModule),
  ],
  providers: [
    PaginationHeaderHelper,
    TagsRepository,
    TagsService,
    QuestionTagsRepository,
    QuestionTagsService,
  ],
  controllers: [TagsController, TagsAdminController],
  exports: [TagsRepository, TagsService, QuestionTagsService],
})
export class TagModule {}
