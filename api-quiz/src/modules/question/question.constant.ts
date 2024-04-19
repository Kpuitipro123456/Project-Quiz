export enum QuestionsType {
  TU_LUAN = 'TU_LUAN',
  TRAC_NGHIEM = 'TRAC_NGHIEM',
}

export enum QuestionsTypeLabel {
  TU_LUAN = 'Tự luận',
  TRAC_NGHIEM = 'Trắc nghiệm',
}

export interface BufferedFile {
  fieldName: string;
  originalname: string;
  encoding: string;
  mimetype: 'text/csv';
  size: number;
  buffer: Buffer;
}

export enum QuestionsStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
}

export const filtersText = ['title'];

export const defaultManyToManyQueries = [
  {
    collection: 'question_tags',
    locationKey: '_id',
    foreignKey: 'questionId',
    nest: {
      collection: 'tags',
      locationKey: '_id',
      foreignKey: 'tagId',
      as: 't_tags',
    },
    as: 'tags',
  },
];

export const defaultOneToManyQueries: any[] = [
  {
    collection: 'exams',
    as: 'exam',
    foreignKey: 'examId',
  },
  {
    collection: 'categories',
    as: 'category',
    foreignKey: 'categoryId',
  },
  {
    collection: 'users',
    as: 'user',
    foreignKey: 'userId',
    customFields: {
      imageUrl: 1,
      userName: 1,
      position: 1,
    },
  },
];

export const defaultFields: Record<string, any> = {
  id: {
    $toString: '$_id',
  },
  _id: 0,
  title: 1,
  code: 1,
  key: 1,
  results: 1,
  question: 1,
  explanation: 1,
  answers: 1,
  examId: 1,
  categoryId: 1,
  userId: 1,
  totalHeart: 1,
  totalShare: 1,
  status: 1,
  createdAt: 1,
  user: {
    $arrayElemAt: ['$user', 0],
  },
};
