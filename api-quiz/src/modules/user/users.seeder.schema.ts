import {Prop, Schema} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {Factory} from 'nestjs-seeder';
import {UsersStatus} from './user.constant';

@Schema()
export class User extends Document {
  @Factory(() => 'Harvey')
  @Prop()
  name: string;

  @Factory(() => 'Dominich')
  @Prop()
  userName: string;

  @Factory(() => '0981248920')
  @Prop()
  phoneNumber: string;

  @Factory(() => 'acd-exam@gmail.com')
  @Prop()
  email: string;

  @Factory((faker) => faker.image.avatar())
  @Prop()
  imageUrl: string;

  @Factory(() => 'veryverysecret')
  @Prop()
  password: string;

  @Factory(() => UsersStatus.ACTIVE)
  @Prop()
  status: string;

  @Factory(() => [])
  @Prop()
  roles: [string];
}
