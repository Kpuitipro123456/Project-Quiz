import {IBaseDocument} from '../../shared/mongooes';

export interface ICategories {
  id?: any;
  name: string;
  slug?: string;
  code?: string;
  imageUrl?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface ICategoriesDocument extends ICategories, IBaseDocument {}
