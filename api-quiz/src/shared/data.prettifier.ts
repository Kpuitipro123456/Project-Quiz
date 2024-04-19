import {Model} from 'mongoose';

const convertObject = (dbObj: any, exclude?: Array<string>): object => {
  const apiObj = {};

  if (dbObj instanceof Model) {
    dbObj = dbObj.toObject();
  }

  for (let name of Object.keys(dbObj)) {
    let value = dbObj[name];
    if (name === '_id') {
      name = 'id';
      value = value.toString();
    }
    if (name.indexOf('_') === 0) {
      continue;
    }
    if (exclude && exclude.indexOf(name) >= 0) {
      continue;
    }
    apiObj[name] = value;
  }

  return apiObj;
};

export function db2api<T1, T2>(db: T1, exclude?: string[]): T2 {
  let response = null;
  if (Array.isArray(db)) {
    response = [];
    for (const obj of db) {
      response.push(convertObject(obj, exclude));
    }
  } else {
    response = convertObject(db, exclude);
  }
  return response;
}
