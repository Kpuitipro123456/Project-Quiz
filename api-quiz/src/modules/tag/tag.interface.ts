import {IBaseDocument} from '../../shared/mongooes';

export interface ITags {
  id?: any;
  name: string;
  slug?: string;
  fieldId?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface ITagsDocument extends ITags, IBaseDocument {}

export interface IQuestionTags {
  id?: any;
  tagId: string;
  questionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IQuestionTagsDocument extends IQuestionTags, IBaseDocument {}
