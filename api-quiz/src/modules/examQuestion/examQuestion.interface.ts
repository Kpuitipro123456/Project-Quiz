import {IBaseDocument} from '../../shared/mongooes';

export interface IExamQuestions {
  id?: any;
  examId: string;
  questionId: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IExamQuestionsDocument extends IExamQuestions, IBaseDocument {}
