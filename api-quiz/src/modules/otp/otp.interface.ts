import {IBaseDocument} from '../../shared/mongooes';
import {OtpsStatus} from './otp.constant';

export interface IOtps {
  id?: any;

  email: string;
  otp: string;
  status: OtpsStatus;

  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IOtpsDocument extends IOtps, IBaseDocument {}
