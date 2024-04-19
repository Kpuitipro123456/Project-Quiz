import {IBaseDocument} from '../../shared/mongooes';

export interface IQuestionAuthor {
  id: string;
  imageUrl: string;
  name: string;
  _id?: boolean;
}

export interface IQuestionStatistics {
  id?: any;
  examId: string;
  userId: string;
  author: IQuestionAuthor;
  totalQuestions: number;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IQuestionStatisticsDocument extends IQuestionStatistics, IBaseDocument {}
