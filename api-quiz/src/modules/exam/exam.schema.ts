import {getBaseSchema} from '../../shared/mongooes';
import {IExamsDocument} from './exam.interface';
import {ExamsStatus} from './exam.constant';
import moment = require('moment');

const ExamsSchema = getBaseSchema<IExamsDocument>();

const allowFields = [
  '_id',
  'name',
  'slug',
  'description',
  'imageMobileUrl',
  'imageUrl',
  'coverMobileUrl',
  'coverUrl',
  'priority',
  'totalMember',
  'totalTime',
  'status',
  'owner',
  'createdBy',
  'updatedBy',
  'createdAt',
  'updatedAt',
  'rate',
  'totalView',
];

ExamsSchema.add({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: false,
  },
  imageMobileUrl: {
    type: String,
    required: false,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
  },
  coverMobileUrl: {
    type: String,
    required: false,
    trim: true,
  },
  coverUrl: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: Number,
    required: false,
    default: 0,
  },
  rate: {
    type: Number,
    required: false,
    default: 1,
  },
  totalView: {
    type: Number,
    required: false,
    default: 1,
  },
  totalMember: {
    type: Number,
    required: false,
    default: 1,
  },
  totalTime: {
    type: Number,
    required: false,
    default: 0,
  },
  owner: {
    type: {
      id: {type: String, required: false},
      name: {type: String, required: false},
      imageUrl: {type: String, required: false},
      _id: false,
    },
    required: false,
  },
  status: {
    type: String,
    required: true,
    default: ExamsStatus.PUBLIC,
  },
  createdBy: {
    type: String,
    required: false,
    trim: true,
  },
  updatedBy: {
    type: String,
    required: false,
    trim: true,
  },
});

ExamsSchema.methods = {
  toJSON() {
    const obj = this;
    const returnObject = {};
    allowFields.forEach((key) => {
      if (key === '_id') key = 'id';
      if (key === 'createdAt' || key === 'updatedAt' || key === 'startTime' || key === 'endTime') {
        returnObject[key] = moment(obj[key]).format('DD/MM/YYYY HH:mm');
      } else {
        returnObject[key] = obj[key];
      }
    });
    return returnObject;
  },
};

ExamsSchema.index({
  createdBy: 1,
});

ExamsSchema.index({
  status: 1,
});

export {ExamsSchema};
