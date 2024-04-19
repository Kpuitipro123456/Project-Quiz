import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IQuestionTagsDocument} from './tag.interface';

@Injectable()
export class QuestionTagsRepository
  extends BaseRepository<IQuestionTagsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.QuestionTags) model: Model<IQuestionTagsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
