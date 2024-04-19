import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {ITagsDocument} from './tag.interface';

@Injectable()
export class TagsRepository
  extends BaseRepository<ITagsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Tags) model: Model<ITagsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
