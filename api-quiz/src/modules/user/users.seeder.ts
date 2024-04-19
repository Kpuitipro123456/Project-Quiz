import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import mongoose from 'mongoose';
import {IUsersDocument} from './user.interface';
import {Seeder, DataFactory} from 'nestjs-seeder';
import {DbModel} from '../../shared/constants';
import {User} from './users.seeder.schema';
import * as bcrypt from 'bcrypt';
import {saltRounds} from './user.constant';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(@InjectModel(DbModel.Users) private readonly user: Model<IUsersDocument>) {}

  async generateManualRolePermission() {}

  async generateAdministrator() {}
  async seed(): Promise<any> {}

  async drop(): Promise<any> {
    // return this.user.deleteMany({});
  }
}
