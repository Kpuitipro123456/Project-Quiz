import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IExamsDocument} from './exam.interface';

@Injectable()
export class ExamsRepository
  extends BaseRepository<IExamsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Exams) model: Model<IExamsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
    // this.model.updateMany({}, {totalView: 1000}, {upsert: true}, function (error, result) {});
  }
}
