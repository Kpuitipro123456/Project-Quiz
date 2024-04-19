import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IAnswersDocument} from './answer.interface';

@Injectable()
export class AnswersRepository
  extends BaseRepository<IAnswersDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Answers) model: Model<IAnswersDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
