import {getBaseSchema} from '../../shared/mongooes';
import {IOtpsDocument} from './otp.interface';
import {getEnumValues} from '../../shared/helpers';
import {OtpsStatus} from './otp.constant';

const OtpsSchema = getBaseSchema<IOtpsDocument>();

const allowFields = ['_id', 'email', 'otp', 'status', 'createdAt'];

OtpsSchema.add({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: getEnumValues<string>(OtpsStatus),
    default: OtpsStatus.VALID,
  },
});

OtpsSchema.methods = {
  toJSON() {
    const otp = this;
    const returnObject = {};
    allowFields.forEach((key) => {
      if (key === '_id') key = 'id';
      returnObject[key] = otp[key];
    });
    return returnObject;
  },
};

OtpsSchema.index({
  email: 1,
  status: 1,
});

export {OtpsSchema};
