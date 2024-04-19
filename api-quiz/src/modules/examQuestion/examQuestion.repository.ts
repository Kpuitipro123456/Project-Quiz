import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IExamQuestionsDocument} from './examQuestion.interface';

@Injectable()
export class ExamQuestionsRepository
  extends BaseRepository<IExamQuestionsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.ExamQuestions) model: Model<IExamQuestionsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
