import {getBaseSchema} from '../../shared/mongooes';
import {IQuestionStatisticsDocument} from './questionStatistic.interface';

const QuestionStatisticsSchema = getBaseSchema<IQuestionStatisticsDocument>();

const allowFields = ['_id', 'userId', 'examId', 'author', 'totalQuestions'];

QuestionStatisticsSchema.add({
  examId: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: {
      id: {type: String, required: false},
      name: {type: String, required: false},
      imageUrl: {type: String, required: false},
      _id: false,
    },
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 1,
  },
  createdAt: {
    type: Date,
    required: false,
    trim: true,
  },
});

QuestionStatisticsSchema.methods = {
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

QuestionStatisticsSchema.index({
  examId: 1,
});

QuestionStatisticsSchema.index({
  userId: 1,
});

export {QuestionStatisticsSchema};
