import {createParamDecorator} from '@nestjs/common';
import {UserDataJwtProperties} from '../shared/constants';
import {getUserData} from '../middleware/user.middleware';

export const User = createParamDecorator(
  (property: UserDataJwtProperties | undefined | string, req) => {
    switch (property) {
      case UserDataJwtProperties.USERID:
        return getUserData(property);
      default:
        return getUserData();
    }
  },
);
