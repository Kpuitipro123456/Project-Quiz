import {ClientSession, Document, PopulateOptions, SaveOptions, Schema} from 'mongoose';

type DocumentSaveCallback<T> = (err: any, doc: T) => void;

export interface IBaseDocument extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  _deleted?: boolean;
  softDelete(fn?: DocumentSaveCallback<this>): Promise<this>;
  softDelete(options?: SaveOptions, fn?: DocumentSaveCallback<this>): Promise<this>;
  restore(fn?: DocumentSaveCallback<this>): Promise<this>;
  restore(options?: SaveOptions, fn?: DocumentSaveCallback<this>): Promise<this>;
}

export function getBaseSchema<T extends IBaseDocument>(): Schema<T> {
  const schema = new Schema<T>(
    {
      _deleted: {
        type: Boolean,
        default: false,
        index: true,
      },
      createdAt: Date,
      updatedAt: Date,
      deletedAt: Date,
    },
    {
      timestamps: true,
      // toObject: {
      //     transform: (_, ret) => convertObject(ret),
      // },
      // toJSON: {
      //     transform: (_, ret) => convertObject(ret),
      // },
    },
  );

  schema.pre<T>('save', function (next) {
    if (!this._deleted) {
      this._deleted = false;
    }
    next();
  });

  return schema;
}

export interface IIncludeSoftDeletedOptions {
  includeSoftDeleted?: boolean;
}

interface ModelOptions {
  session?: ClientSession | null;
}

export interface IBaseFindOptions extends ModelOptions, IIncludeSoftDeletedOptions {
  lean?: boolean;
  populate?: string | PopulateOptions;
  maxTimeMS?: number;
  projection?: object;
}

export interface IFindOptions extends IBaseFindOptions {
  tailable?: boolean;
  sort?: object | string;
  limit?: number;
  skip?: number;
  maxscan?: number;
  batchSize?: number;
  comment?: string;
  snapshot?: boolean;
  readPreference?: string;
  hint?: object;
}

export interface IDeleteOptions extends ModelOptions {}

export interface IUpdateOptions extends IDeleteOptions, IIncludeSoftDeletedOptions {
  multi?: boolean;
  upsert?: boolean;
  setDefaultsOnInsert?: boolean;
  timestamps?: boolean;
  omitUndefined?: boolean;
  overwrite?: boolean;
  runValidators?: boolean;
  context?: string;
  multipleCastError?: boolean;
}

export interface IFindAndDeleteOptions extends IBaseFindOptions, IDeleteOptions {
  sort?: object | string;
}

export interface IFindAndUpdateOptions extends IFindAndDeleteOptions, IUpdateOptions {
  new?: boolean;
  fields?: object | string;
}

export interface IRepository<T extends Document> {
  aggregate(aggregations?: any[]): Promise<any[]>;

  count(conditions: any, options?: IIncludeSoftDeletedOptions): Promise<number>;

  countAll(options?: IIncludeSoftDeletedOptions): Promise<number>;

  create(doc: object, options?: SaveOptions): Promise<T>;

  create(docs: object[], options?: SaveOptions): Promise<T[]>;

  delete(doc: T, options?: IDeleteOptions): Promise<T>;

  delete(docs: T[], options?: IDeleteOptions): Promise<T[]>;

  deleteAll(options?: IDeleteOptions): Promise<any>;

  deleteById(id: any, options?: IFindAndDeleteOptions): Promise<T>;

  deleteMany(conditions: any, options?: IDeleteOptions): Promise<any>;

  deleteOne(conditions: any, options?: IFindAndDeleteOptions): Promise<T>;

  exists(conditions: any, options?: IIncludeSoftDeletedOptions): Promise<{_id: any}>;

  existsById(id: any, options?: IIncludeSoftDeletedOptions): Promise<{_id: any}>;

  find(conditions: any, options?: IFindOptions): Promise<T[]>;

  findAll(options?: IFindOptions): Promise<T[]>;

  findById(id: any, options?: any | IFindOptions): Promise<T>;

  findOne(conditions: any, options?: IFindOptions): Promise<T>;

  findOneOrCreate(conditions: any, doc: any, options?: IFindOptions & SaveOptions): Promise<T>;

  save(doc: T, options?: SaveOptions): Promise<T>;

  save(docs: T[], options?: SaveOptions): Promise<T[]>;

  softDelete(doc: T, options?: SaveOptions): Promise<T>;

  softDelete(docs: T[], options?: SaveOptions): Promise<T[]>;

  softDeleteAll(options?: IUpdateOptions): Promise<any>;

  softDeleteById(id: any, options?: IFindAndUpdateOptions): Promise<T>;

  softDeleteMany(conditions: any, options?: IUpdateOptions): Promise<any>;

  softDeleteOne(conditions: any, options?: IFindAndUpdateOptions): Promise<T>;

  update(conditions: any, doc: any, options?: IUpdateOptions): Promise<any>;

  updateById(id: any, doc: any, options?: IFindAndUpdateOptions): Promise<T>;

  updateMany(conditions: any, doc: any, options?: IUpdateOptions): Promise<any>;

  updateOne(conditions: any, doc: any, options?: IFindAndUpdateOptions): Promise<T>;

  updateOneOrCreate(conditions: any, doc: any, options?: IFindAndUpdateOptions): Promise<T>;

  withTransaction<U>(fn: (session: ClientSession) => Promise<U>): Promise<U>;

  getCollectionName(): string;

  createCollection(): Promise<void>;

  dropCollection(): Promise<void>;

  getPrimaryKey(): string;
}
