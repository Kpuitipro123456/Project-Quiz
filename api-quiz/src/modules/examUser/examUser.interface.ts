import {IBaseDocument} from '../../shared/mongooes';

export interface IExamUsers {
  id?: any;
  examId: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IExamUsersDocument extends IExamUsers, IBaseDocument {}
