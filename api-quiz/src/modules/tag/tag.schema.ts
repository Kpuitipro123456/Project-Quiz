import {getBaseSchema} from '../../shared/mongooes';
import {ITagsDocument, IQuestionTagsDocument} from './tag.interface';

const TagsSchema = getBaseSchema<ITagsDocument>();

const allowFields = ['_id', 'name', 'slug', 'fieldId'];

TagsSchema.add({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: false,
    trim: true,
  },
  fieldId: {
    type: String,
    required: false,
    trim: true,
  },
});

TagsSchema.methods = {
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

TagsSchema.index({
  slug: 1,
});

export {TagsSchema};

// Question Tag
const QuestionTagsSchema = getBaseSchema<IQuestionTagsDocument>();

const allowQuestionTag = ['_id', 'tagId', 'questionId'];

QuestionTagsSchema.add({
  tagId: {
    type: String,
    required: true,
  },
  questionId: {
    type: String,
    required: false,
  },
});

QuestionTagsSchema.methods = {
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

QuestionTagsSchema.index({
  tagId: 1,
});

QuestionTagsSchema.index({
  questionId: 1,
});

export {QuestionTagsSchema};
