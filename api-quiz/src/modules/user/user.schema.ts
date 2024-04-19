import {getBaseSchema} from '../../shared/mongooes';
import {IUsersDocument} from './user.interface';
import {getEnumValues} from '../../shared/helpers';
import {UsersStatus, Genders} from './user.constant';

const UsersSchema = getBaseSchema<IUsersDocument>();

const allowFields = [
  '_id',
  'name',
  'userName',
  'phoneNumber',
  'email',
  'imageUrl',
  'authToken',
  'status',
  'roles',
  'isAdmin',
  'lastLoginAt',
];

UsersSchema.add({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  authToken: {
    type: String,
    required: false,
    trim: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default: false,
  },
  status: {
    type: String,
    required: true,
    enum: getEnumValues<string>(UsersStatus),
    default: UsersStatus.DRAFT,
  },
  password: {
    bcrypt: {
      type: String,
      trim: true,
    },
    tokens: [
      {
        ts: {
          type: Date,
        },
        accessToken: {
          type: String,
          trim: true,
        },
        _id: false,
      },
    ],
  },
  lastLoginAt: {
    type: Date,
    required: false,
  },
});

UsersSchema.methods = {
  toJSON() {
    const user = this;
    const returnObject = {};
    allowFields.forEach((key) => {
      if (key === '_id') key = 'id';
      returnObject[key] = user[key];
    });
    return returnObject;
  },
};

UsersSchema.index({
  status: 1,
});

export {UsersSchema};
