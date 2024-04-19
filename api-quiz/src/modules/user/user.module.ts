import {Module, forwardRef} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {DbModel} from '../../shared/constants';
import {UsersController} from './user.controller';
import {UsersAdminController} from './user.admin.controller';
import {UsersService} from './user.service';
import {UsersRepository} from './user.repository';
import {UsersSchema} from './user.schema';
import {PaginationHeaderHelper} from '../../adapters/pagination/pagination.helper';
import {MailModule} from '../mail/mail.module';

@Module({
  imports: [MongooseModule.forFeature([{name: DbModel.Users, schema: UsersSchema}]), MailModule],
  providers: [PaginationHeaderHelper, UsersRepository, UsersService],
  controllers: [UsersController, UsersAdminController],
  exports: [UsersRepository, UsersService],
})
export class UserModule {}
