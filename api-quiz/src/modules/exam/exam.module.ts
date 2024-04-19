import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {ExamsAdminController} from './exam.admin.controller';
import {ExamsController} from './exam.controller';
import {ExamsService} from './exam.service';
import {ExamsAdminService} from './exam.admin.service';
import {ExamsRepository} from './exam.repository';
import {ExamsSchema} from './exam.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {UserModule} from '../user/user.module';
import {ExamUserModule} from '../examUser/examUser.module';
import {QuestionModule} from '../question/question.module';
import {ExamQuestionModule} from '../examQuestion/examQuestion.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbModel.Exams, schema: ExamsSchema}]),
    UserModule,
    forwardRef(() => ExamUserModule),
    forwardRef(() => QuestionModule),
    forwardRef(() => ExamQuestionModule),
  ],
  providers: [PaginationHeaderHelper, ExamsRepository, ExamsService, ExamsAdminService],
  controllers: [ExamsController, ExamsAdminController],
  exports: [ExamsService],
})
export class ExamModule {}
