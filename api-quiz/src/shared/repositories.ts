import {merge, slice} from 'lodash';
import {
  IRepository,
  IIncludeSoftDeletedOptions,
  IDeleteOptions,
  IFindAndDeleteOptions,
  IFindOptions,
  IUpdateOptions,
  IFindAndUpdateOptions,
} from './mongooes';
import {ClientSession, Document, Model, SaveOptions} from 'mongoose';
import {readConfig} from '../modules/common/config.provider';

export function getMaxTimeMs() {
  const maxTimeMs = Number(readConfig('mongodb.maxTimeMS'));
  return maxTimeMs || 10000;
}

export class BaseRepository<T extends Document> implements IRepository<T> {
  protected primaryKey: string = '_id';
  private readonly isSoftDeleteSupported: boolean = false;

  constructor(public readonly model: Model<T>) {
    this.isSoftDeleteSupported = this.isModelSupportSoftDelete(model);
  }

  aggregate(aggregations?: any[], options?: IIncludeSoftDeletedOptions): Promise<any[]> {
    aggregations = slice(aggregations);
    if (this.isNotIncludeSoftDeleted(options)) {
      aggregations.unshift({$match: {_deleted: {$ne: true}}});
    }
    const opts = {
      maxTimeMS: getMaxTimeMs(),
    };
    return this.model.aggregate(aggregations).option(opts).exec();
  }

  async count(conditions: any, options?: IIncludeSoftDeletedOptions): Promise<number> {
    return this.modifyQuery(this.model.countDocuments(conditions), options).exec();
  }

  async countAll(options?: IIncludeSoftDeletedOptions): Promise<number> {
    return this.count({}, options);
  }

  async create(doc: object, options?: SaveOptions): Promise<T>;
  async create(docs: object[], options?: SaveOptions): Promise<T[]>;
  async create(docs: object | object[], options?: SaveOptions): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.create(doc, options));
      }
      return result;
    }
    return this.save(new this.model(docs), options);
  }

  async delete(doc: T, options?: IDeleteOptions): Promise<T>;
  async delete(docs: T[], options?: IDeleteOptions): Promise<T[]>;
  async delete(docs: T | T[], options?: IDeleteOptions): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.delete(doc, options));
      }
      return result;
    }
    if (options && options.session) {
      docs.$session(options.session);
    }
    return docs.remove();
  }

  async deleteAll(options?: IDeleteOptions): Promise<number> {
    return this.deleteMany({}, options);
  }

  async deleteById(id: any, options?: IFindAndDeleteOptions): Promise<T> {
    return this.deleteOne({[this.primaryKey]: id});
  }

  async deleteMany(conditions: any, options?: IDeleteOptions): Promise<number> {
    let query = this.model.deleteMany(conditions);
    if (options && options.session) {
      query = query.session(options.session);
    }
    const result = await query.exec();
    return result.deletedCount;
  }

  async deleteOne(conditions: any, options?: IFindAndDeleteOptions): Promise<T> {
    return this.model.findOneAndDelete(conditions, options).exec();
  }

  async exists(conditions: any, options?: IIncludeSoftDeletedOptions): Promise<{_id: any}> {
    if (this.isNotIncludeSoftDeleted(options)) {
      conditions = merge({}, conditions, {_deleted: {$ne: true}});
    }
    return this.model.exists(conditions);
  }

  async existsById(id: any, options?: IIncludeSoftDeletedOptions): Promise<{_id: any}> {
    return this.exists({[this.primaryKey]: id});
  }

  async find(conditions: any, options?: IFindOptions): Promise<T[]> {
    return this.modifyQuery(this.model.find(conditions, null, options as Object), options).exec();
  }

  async findAll(options?: IFindOptions): Promise<T[]> {
    return this.find({}, options);
  }

  async findById(id: any, options?: IFindOptions): Promise<T> {
    return this.findOne({[this.primaryKey]: id}, options);
  }

  async findOne(conditions: any, options?: IFindOptions): Promise<T> {
    return this.modifyQuery(
      this.model.findOne(conditions, null, options as Object),
      options,
    ).exec();
  }

  async findOneOrCreate(
    conditions: any,
    doc: any,
    options?: IFindOptions & SaveOptions,
  ): Promise<T> {
    let document = await this.findOne(conditions, options);
    if (!document) {
      document = await this.create(merge({}, conditions, doc), options);
    }
    return document;
  }

  async save(doc: T, options?: SaveOptions): Promise<T>;
  async save(docs: T[], options?: SaveOptions): Promise<T[]>;
  async save(docs: T | T[], options?: SaveOptions): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.save(doc, options));
      }
      return result;
    }
    return docs.save(options);
  }

  async softDelete(doc: T, options?: SaveOptions): Promise<T>;
  async softDelete(docs: T[], options?: SaveOptions): Promise<T[]>;
  async softDelete(docs: T | T[], options?: SaveOptions): Promise<T | T[]> {
    this.checkIfSoftDeleteSupported();
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.softDelete(doc, options));
      }
      return result;
    }
    docs.set({
      _deleted: true,
      deletedAt: new Date(),
    });
    return docs.save(options);
  }

  async softDeleteAll(options?: IUpdateOptions): Promise<number> {
    return this.softDeleteMany({}, options);
  }

  async softDeleteById(id: any, options?: IFindAndUpdateOptions): Promise<T> {
    return this.softDeleteOne({[this.primaryKey]: id}, options);
  }

  async softDeleteMany(conditions: any = {}, options?: IUpdateOptions): Promise<number> {
    this.checkIfSoftDeleteSupported();
    return this.updateMany(conditions, {_deleted: true, deletedAt: new Date()}, options);
  }

  async softDeleteOne(conditions: any, options?: IFindAndUpdateOptions): Promise<T> {
    this.checkIfSoftDeleteSupported();
    return this.updateOne(conditions, {_deleted: true, deletedAt: new Date()}, options);
  }

  async update(conditions: any, doc: any, options?: IUpdateOptions): Promise<number> {
    const result = await this.modifyQuery(
      this.model.update(conditions, doc, options),
      options,
    ).exec();
    return result.ok ? result.nModified : 0;
  }

  async updateById(id: any, doc: any, options?: IFindAndUpdateOptions): Promise<T> {
    return this.updateOne({[this.primaryKey]: id}, doc, options);
  }

  async updateMany(conditions: any, doc: any, options?: IUpdateOptions): Promise<number> {
    const result = await this.modifyQuery(
      this.model.updateMany(conditions, doc, options),
      options,
    ).exec();
    return result.ok ? result.nModified : 0;
  }

  async updateOne(conditions: any, doc: any, options?: IFindAndUpdateOptions): Promise<T> {
    return this.modifyQuery(
      this.model.findOneAndUpdate(conditions, doc, merge({new: true}, options)),
      options,
    ).exec();
  }

  async updateOneOrCreate(conditions: any, doc: any, options?: IFindAndUpdateOptions): Promise<T> {
    return this.updateOne(
      conditions,
      doc,
      merge({new: true, upsert: true, setDefaultsOnInsert: true}, options),
    );
  }

  async withTransaction<U>(fn: (session: ClientSession) => Promise<U>): Promise<U> {
    const session = await this.model.db.startSession();
    try {
      session.startTransaction();
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  getCollectionName(): string {
    return this.model.collection.collectionName;
  }

  async createCollection(): Promise<void> {
    if (!(await this.isCollectionExists())) {
      await this.model.createCollection();
    }
  }

  async dropCollection(): Promise<void> {
    if (await this.isCollectionExists()) {
      await this.model.collection.drop();
    }
  }

  getPrimaryKey(): string {
    return this.primaryKey;
  }

  private isModelSupportSoftDelete(model: Model<T>): boolean {
    return (
      model.schema.pathType('_deleted') === 'real' && model.schema.pathType('deletedAt') === 'real'
    );
  }

  private isNotIncludeSoftDeleted(options?: IIncludeSoftDeletedOptions) {
    return this.isSoftDeleteSupported && (!options || !options.includeSoftDeleted);
  }

  private checkIfSoftDeleteSupported() {
    if (!this.isSoftDeleteSupported) {
      throw new Error('Model does not support soft-delete');
    }
  }

  private modifyQuery(query: any, options?: any) {
    // check maxtime ms
    query = query.maxTimeMS(getMaxTimeMs());

    // check soft deleted feature
    if (this.isNotIncludeSoftDeleted(options)) {
      query = query.where('_deleted').ne(true);
    }
    return query;
  }

  private async isCollectionExists(): Promise<boolean> {
    const result = await this.model.db.db
      .listCollections({name: this.model.collection.collectionName})
      .next();
    return !!result;
  }
}
