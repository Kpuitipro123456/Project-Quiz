import {IBaseDocument} from '../../shared/mongooes';
import {ExamsStatus} from './exam.constant';

export interface IOwnerExam {
  id: string;
  imageUrl: string;
  name: string;
  _id?: boolean;
}

export interface IExams {
  id?: any;
  name: string;
  slug?: string;
  description: string;
  imageMobileUrl?: string;
  imageUrl: string;
  coverMobileUrl?: string;
  coverUrl: string;
  priority: number;
  status: ExamsStatus;
  owner?: IOwnerExam;
  totalMember: number;
  totalView: number;
  rate: number;
  totalTime?: number;

  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
}

export interface IExamsDocument extends IExams, IBaseDocument {}
