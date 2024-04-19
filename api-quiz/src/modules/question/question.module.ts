import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {QuestionsAdminController} from './question.admin.controller';
import {QuestionsController} from './question.controller';
import {QuestionsService} from './question.service';
import {QuestionsAdminService} from './question.admin.service';
import {QuestionsRepository} from './question.repository';
import {QuestionsSchema} from './question.schema';
import {CategoryModule} from '../category/category.module';
import {TagModule} from '../tag/tag.module';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {QuestionStatisticsModule} from '../questionStatistic/questionStatistic.module';
import {UserModule} from '../user/user.module';
import {ExamModule} from '../exam/exam.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbModel.Questions, schema: QuestionsSchema}]),
    CategoryModule,
    forwardRef(() => TagModule),
    QuestionStatisticsModule,
    UserModule,
    forwardRef(() => ExamModule),
  ],
  providers: [PaginationHeaderHelper, QuestionsRepository, QuestionsService, QuestionsAdminService],
  controllers: [QuestionsController, QuestionsAdminController],
  exports: [QuestionsRepository, QuestionsService],
})
export class QuestionModule {}
