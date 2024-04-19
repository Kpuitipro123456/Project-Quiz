import {getBaseSchema} from '../../shared/mongooes';
import {IQuestionsDocument} from './question.interface';
import {getEnumValues} from '../../shared/helpers';
import {QuestionsStatus, QuestionsType} from './question.constant';
import {IndexDefinition} from '../../shared/constants';

const QuestionsSchema = getBaseSchema<IQuestionsDocument>();

const allowFields = [
  '_id',
  'title',
  'code',
  'question',
  'explanation',
  'answers',
  'results',
  'userId',
  'status',
  'createdAt',
  'updatedAt',
];

QuestionsSchema.add({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: false,
    trim: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  explanation: {
    type: String,
    required: true,
    trim: true,
  },
  answers: {
    type: [
      {
        answerUid: {type: String, required: false},
        content: {type: String, required: false},
        _id: false,
      },
    ],
    default: [],
  },
  results: {
    type: [
      {
        answerUid: {type: String, required: false},
        content: {type: String, required: false},
        isTrue: {type: Boolean, required: false},
        _id: false,
      },
    ],
    default: [],
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: getEnumValues<string>(QuestionsStatus),
    default: QuestionsStatus.ACTIVE,
  },
});

QuestionsSchema.methods = {
  toJSON() {
    const obj = this;
    const returnObject = {};
    allowFields.forEach((key) => {
      if (key === '_id') key = 'id';
      returnObject[key] = obj[key];
    });
    return returnObject;
  },
};

const multiKeys = [{userId: 1}, {status: 1}];

multiKeys.forEach((createIndex) => QuestionsSchema.index(createIndex as IndexDefinition));

export {QuestionsSchema};
