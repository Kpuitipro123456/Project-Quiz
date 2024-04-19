import * as moment from 'moment';
import {getBaseSchema} from '../../shared/mongooes';
import {IAnswersDocument} from './answer.interface';

const AnswersSchema = getBaseSchema<IAnswersDocument>();

const allowFields = [
  '_id',
  'content',
  'imageUrls',
  'questionId',
  'parentId',
  'owner',
  'totalHeart',
  'totalPoint',
  'isVerify',
  'isRoot',
  'userId',
  'createdAt',
];

AnswersSchema.add({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrls: {
    type: [{type: String, required: false}],
    default: [],
  },
  questionId: {
    type: String,
    required: true,
    trim: true,
  },
  parentId: {
    type: String,
    required: false,
    trim: true,
  },
  owner: {
    type: {
      id: {type: String, required: false},
      name: {type: String, required: false},
      imageUrl: {type: String, required: false},
      position: {type: String, required: false},
      _id: false,
    },
    required: false,
  },
  totalHeart: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPoint: {
    type: Number,
    required: true,
    default: 0,
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: false,
    trim: true,
  },
});

AnswersSchema.methods = {
  toJSON() {
    const obj = this;
    const returnObject = {};
    allowFields.forEach((key) => {
      if (key === '_id') key = 'id';
      if (key === 'createdAt' || key === 'updatedAt') {
        returnObject[key] = moment(obj[key]).format('DD/MM/YYYY HH:mm');
      } else {
        returnObject[key] = obj[key];
      }
    });
    return returnObject;
  },
};

AnswersSchema.index({
  userId: 1,
});
AnswersSchema.index({
  questionId: 1,
});
AnswersSchema.index({
  parentId: 1,
});
AnswersSchema.index({
  isRoot: 1,
});

export {AnswersSchema};
