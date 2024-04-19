import {BaseRepository} from '../../shared/repositories';
import {DbModel} from '../../shared/constants';
import {OnApplicationBootstrap, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';
import {InjectModel} from '@nestjs/mongoose';
import {IOtpsDocument} from './otp.interface';

@Injectable()
export class OtpsRepository
  extends BaseRepository<IOtpsDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(DbModel.Otps) model: Model<IOtpsDocument>) {
    super(model);
  }

  async onApplicationBootstrap(): Promise<void> {
    await this.createCollection();
  }
}
