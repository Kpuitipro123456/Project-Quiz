import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {AnswersAdminController} from './answer.admin.controller';
import {AnswersController} from './answer.controller';
import {AnswersService} from './answer.service';
import {AnswersAdminService} from './answer.admin.service';
import {AnswersRepository} from './answer.repository';
import {AnswersSchema} from './answer.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {QuestionModule} from '../question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbModel.Answers, schema: AnswersSchema}]),
    QuestionModule,
  ],
  providers: [PaginationHeaderHelper, AnswersRepository, AnswersService, AnswersAdminService],
  controllers: [AnswersController, AnswersAdminController],
  exports: [AnswersRepository, AnswersService],
})
export class AnswerModule {}
