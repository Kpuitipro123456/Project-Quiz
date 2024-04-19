import {getBaseSchema} from '../../shared/mongooes';
import {ICategoriesDocument} from './category.interface';

const CategoriesSchema = getBaseSchema<ICategoriesDocument>();

const allowFields = ['_id', 'name', 'slug', 'code', 'imageUrl'];

CategoriesSchema.add({
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
  code: {
    type: String,
    required: false,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
});

CategoriesSchema.methods = {
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

CategoriesSchema.index({
  code: 1,
});

export {CategoriesSchema};
