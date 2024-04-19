import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import {IUsers} from '../modules/user/user.interface';
import {IJwtPayload} from '../modules/auth/auth.interface';
import {readConfig} from '../modules/common/config.provider';

// returns - The decoded token
export const verifyToken = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(
      token,
      readConfig('jwtConfig.secret_access_token'),
      (error: any, decoded: IJwtPayload) => {
        if (error) {
          return reject(error);
        }
        resolve(decoded);
      },
    );
  });

export const generateToken = (user: IUsers) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      _.pick(user, ['id', 'phoneNumber', 'name', 'permissions', 'imageUrl', 'email']),
      readConfig('jwtConfig.secret_access_token'),
      {expiresIn: +readConfig('jwtConfig.secret_access_token_expire')},
      (error: any, token: any) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      },
    );
  });

export const generateRefreshToken = (user: IUsers) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      _.pick(user, ['id', 'phoneNumber', 'name', 'permissions', 'imageUrl', 'email']),
      readConfig('jwtConfig.secret_refresh_access_token'),
      {expiresIn: +readConfig('jwtConfig.secret_refresh_access_token_expire')},
      (error: any, token: any) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      },
    );
  });

export const generateTokenCommon = (information: any) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      {
        ..._.pick(information, ['email']),
        createdAt: new Date(),
      },
      readConfig('jwtConfig.secret_access_token'),
      {expiresIn: +readConfig('jwtConfig.secret_access_token_expire')},
      (error: any, token: any) => {
        if (error) {
          reject(error);
        }
        resolve(token);
      },
    );
  });

// export function generateToken(user: IUsers) {
//     return jwt.sign(
//         _.pick(user, ['_id', 'phoneNumber', 'name', 'roles', 'imageUrl', 'email']),
//         readConfig('jwtConfig.secret_access_token'),
//         { expiresIn: +readConfig('jwtConfig.secret_access_token_expire') },
//     );
// }

// export function generateRefreshToken(user: IUsers) {
//     return jwt.sign(
//         _.pick(user, ['_id', 'phoneNumber', 'name', 'roles', 'imageUrl', 'email']),
//         readConfig('jwtConfig.secret_refresh_access_token'),
//         { expiresIn: +readConfig('jwtConfig.secret_refresh_access_token_expire') },
//     );
// }

// returns - The decoded token
// export function verifyToken(token: string) {
//     return jwt.verify(token, readConfig('jwtConfig.secret_access_token'));
// }
