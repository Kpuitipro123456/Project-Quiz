import {getBaseSchema} from '../../shared/mongooes';
import {IExamQuestionsDocument} from './examQuestion.interface';

// Exam User
const ExamQuestionsSchema = getBaseSchema<IExamQuestionsDocument>();

const allowQuestionTag = ['_id', 'examId', 'questionId', 'createdAt'];

ExamQuestionsSchema.add({
  examId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: false,
  },
});

ExamQuestionsSchema.methods = {
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

ExamQuestionsSchema.index({
  examId: 1,
});
ExamQuestionsSchema.index({
  questionId: 1,
});

export {ExamQuestionsSchema};
