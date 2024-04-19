import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IQuestionStatisticsDocument} from './questionStatistic.interface';

@Injectable()
export class QuestionStatisticsRepository
  extends BaseRepository<IQuestionStatisticsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.QuestionStatistics) model: Model<IQuestionStatisticsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
