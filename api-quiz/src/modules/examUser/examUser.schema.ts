import {getBaseSchema} from '../../shared/mongooes';
import {IExamUsersDocument} from './examUser.interface';

// Exam User
const ExamUsersSchema = getBaseSchema<IExamUsersDocument>();

const allowQuestionTag = ['_id', 'examId', 'userId', 'createdAt'];

ExamUsersSchema.add({
  examId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
});

ExamUsersSchema.methods = {
  toJSON() {
    const obj = this;
    const returnObject = {};
    allowQuestionTag.forEach((key) => {
      if (key === '_id') key = 'id';
      returnObject[key] = obj[key];
    });
    return returnObject;
  },
};

ExamUsersSchema.index({
  examId: 1,
});
ExamUsersSchema.index({
  userId: 1,
});

export {ExamUsersSchema};
