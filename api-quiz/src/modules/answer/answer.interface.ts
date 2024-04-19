import {IBaseDocument} from '../../shared/mongooes';

export interface IOwnerAnswer {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
  _id?: boolean;
}

export interface IAnswers {
  id?: any;
  content: string;
  imageUrls: string[];
  questionId: string;
  parentId: string;
  totalHeart: number;
  totalPoint: number;
  isVerify: boolean;
  isRoot: boolean;
  userId?: string;
  owner?: IOwnerAnswer;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IAnswersDocument extends IAnswers, IBaseDocument {}
