import {IBaseDocument} from '../../shared/mongooes';
import {UsersStatus} from './user.constant';
interface ITokenPasswords {
  ts?: Date;
  accessToken?: string;
  _id?: boolean;
}

export interface IPasswords {
  bcrypt: string;
  tokens?: ITokenPasswords[];
}

export interface IUsers {
  id?: any;

  name: string;
  userName: string;
  phoneNumber: string;
  email?: string;
  imageUrl?: string;
  authToken?: string;
  status: UsersStatus;
  password: IPasswords;
  isAdmin: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IUsersDocument extends IUsers, IBaseDocument {}

export interface IUsersCondition {
  phoneNumber?: string;
  userName?: string;
  email?: string;
  password?: string;
  status?: UsersStatus;
}
