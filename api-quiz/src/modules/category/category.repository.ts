import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {ICategoriesDocument} from './category.interface';

@Injectable()
export class CategoriesRepository
  extends BaseRepository<ICategoriesDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Categories) model: Model<ICategoriesDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
