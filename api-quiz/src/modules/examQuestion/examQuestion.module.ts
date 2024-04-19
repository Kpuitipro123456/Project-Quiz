import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {ExamUsersController} from './examQuestion.controller';
import {ExamQuestionsAdminController} from './examQuestion.admin.controller';
import {ExamQuestionsService} from './examQuestion.service';
import {ExamQuestionsRepository} from './examQuestion.repository';
import {ExamQuestionsSchema} from './examQuestion.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {ExamModule} from '../exam/exam.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbModel.ExamQuestions, schema: ExamQuestionsSchema}]),
    forwardRef(() => ExamModule),
  ],
  providers: [PaginationHeaderHelper, ExamQuestionsRepository, ExamQuestionsService],
  controllers: [ExamUsersController, ExamQuestionsAdminController],
  exports: [ExamQuestionsService],
})
export class ExamQuestionModule {}
