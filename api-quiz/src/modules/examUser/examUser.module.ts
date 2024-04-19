import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {ExamUsersController} from './examUser.controller';
import {ExamUsersAdminController} from './examUser.admin.controller';
import {ExamUsersService} from './examUser.service';
import {ExamUsersRepository} from './examUser.repository';
import {ExamUsersSchema} from './examUser.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {ExamModule} from '../exam/exam.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: DbModel.ExamUsers, schema: ExamUsersSchema}]),
    forwardRef(() => ExamModule),
  ],
  providers: [PaginationHeaderHelper, ExamUsersRepository, ExamUsersService],
  controllers: [ExamUsersController, ExamUsersAdminController],
  exports: [ExamUsersService],
})
export class ExamUserModule {}
