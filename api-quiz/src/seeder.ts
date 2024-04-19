import {seeder} from 'nestjs-seeder';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersSchema} from './modules/user/user.schema';
import {UsersSeeder} from './modules/user/users.seeder';
import {createMongooseOptions} from './shared/helpers';
import {DbModel} from './shared/constants';

seeder({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => createMongooseOptions('mongodb.uri'),
    }),
    MongooseModule.forFeature([{name: DbModel.Users, schema: UsersSchema}]),
  ],
}).run([UsersSeeder]);
