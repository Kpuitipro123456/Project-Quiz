import * as _ from 'lodash';
import * as express from 'express';
import * as mongoose from 'mongoose';
import {MongooseModuleOptions} from '@nestjs/mongoose';
import {readConfig} from '../modules/common/config.provider';
import {v4 as uuidv4} from 'uuid';
import {BadRequestException} from '@nestjs/common';

export function checkInternalRequest(request: express.Request) {
  const host = request.headers.host;
  const internalServiceRegex = readConfig('service.internalServicesRegex');
  if (!internalServiceRegex) {
    return false;
  }
  return RegExp(internalServiceRegex).test(host);
}

export function createMongooseOptions(uriConfigPath: string): MongooseModuleOptions {
  return {
    uri: readConfig(uriConfigPath),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
}

export function getEnumKeys<T extends string | number>(e: Record<string, T>): string[] {
  return _.difference(_.keys(e), _.map(_.filter(_.values(e), _.isNumber), _.toString));
}

export function getEnumValues<T extends string | number>(e: Record<string, T>): T[] {
  return _.values(_.pick(e, getEnumKeys(e)));
}

export function isObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function getFirstErrorMessage(errors: any[]): string {
  if (errors.length) {
    const error = errors[0];
    if (error.children && error.children.length > 0) {
      return getFirstErrorMessage(error.children);
    }
    return error.constraints[Object.keys(error.constraints)[0]];
  }
}

export function extractToken(authorization: string) {
  const bearerHeader = authorization.split(' ');
  if (bearerHeader.length === 2 && bearerHeader[0] === 'Bearer') {
    return bearerHeader[1];
  }
  return '';
}

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export const uuidForUid = () => {
  return uuidv4();
};

// tslint:disable-next-line:no-shadowed-variable
export const handleFileFilter = (_, file, cb) => {
  if (
    file.originalname.match(/\.(xlsx)$/) &&
    (file.mimetype.match(/\/(xlsx)$/) ||
      file.mimetype.includes('excel') ||
      file.mimetype.includes('spreadsheetml'))
  ) {
    cb(null, true);
  } else {
    // Only xlsx file format is permitted
    cb(new BadRequestException('Only xlsx file format is permitted'), false);
  }
};

export const randomOtp = (limit: number): string => {
  let text: string = '';
  const possible: string = '0123456789';
  for (let i = 0; i < limit; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

export const MOBILE_REGEX =
  /^(0|\+84)((3[2-9])|(4[0-9])|(5[2689])|(7[06-9])|(8[1-9])|(9[0-46-9]))(\d)(\d{3})(\d{3})$/;
export function validateMobile(mobile) {
  return MOBILE_REGEX.test(mobile);
}

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function validateEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function generateRandomNumber(from: number, to: number): number {
  return Math.floor(Math.random() * to) + from;
}

export function generateRandomNumbersArray(length: number, sum: number): number[] {
  const numbersArray = [];
  for (let i = 0; i < length; i++) {
    numbersArray[i] = 1;
  }
  sum = sum - length;
  for (let i = 0; i < sum; i++) {
    numbersArray[generateRandomNumber(0, length) % length]++;
  }
  return numbersArray;
}

export function generateRandomString(numbersArray: number[], lettersArray: string[]): string {
  return numbersArray
    .map((len, i) => {
      return Array(len)
        .fill(lettersArray[i])
        .map((x) => {
          return x[generateRandomNumber(0, x.length)];
        })
        .join('');
    })
    .concat()
    .join('');
}
