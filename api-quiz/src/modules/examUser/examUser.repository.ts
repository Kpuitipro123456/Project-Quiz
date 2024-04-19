import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IExamUsersDocument} from './examUser.interface';

@Injectable()
export class ExamUsersRepository
  extends BaseRepository<IExamUsersDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.ExamUsers) model: Model<IExamUsersDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
