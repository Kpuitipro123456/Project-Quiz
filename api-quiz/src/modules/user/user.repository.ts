import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IUsersDocument} from './user.interface';

@Injectable()
export class UsersRepository
  extends BaseRepository<IUsersDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Users) model: Model<IUsersDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
