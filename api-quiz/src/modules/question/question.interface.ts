import {IBaseDocument} from '../../shared/mongooes';
import {QuestionsStatus} from './question.constant';

export interface ReferenceAnswer {
  answerUid: string;
  content: string;
}

export interface ReferenceResult extends ReferenceAnswer {
  isTrue?: boolean;
}

export interface IQuestions {
  id?: any;
  title: string;
  code?: string;
  question: string;
  explanation: string;
  answers?: ReferenceAnswer[];
  results?: ReferenceResult[];
  categoryId?: string;
  userId?: string;
  status: QuestionsStatus;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IQuestionsDocument extends IQuestions, IBaseDocument {}
