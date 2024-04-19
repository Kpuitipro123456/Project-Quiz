import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IQuestionsDocument} from './question.interface';

@Injectable()
export class QuestionsRepository
  extends BaseRepository<IQuestionsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Questions) model: Model<IQuestionsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
