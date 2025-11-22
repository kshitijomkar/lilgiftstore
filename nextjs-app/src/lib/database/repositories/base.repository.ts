import { MongoClient, Db, Collection, ObjectId, Filter } from 'mongodb';
import { getDatabase } from '@/lib/db';

/**
 * Base Repository Pattern
 * Provides common CRUD operations for all collections
 * Implements abstraction layer between routes and database
 */
export abstract class BaseRepository<T> {
  protected db: Db | null = null;
  protected collectionName: string = '';

  abstract initializeCollection(): Promise<Collection<T>>;

  async getDatabase(): Promise<Db> {
    if (!this.db) {
      this.db = await getDatabase();
    }
    return this.db;
  }

  async getCollection(): Promise<Collection<T>> {
    const db = await this.getDatabase();
    return db.collection<T>(this.collectionName);
  }

  // CREATE
  async create(data: Partial<T>): Promise<T> {
    const collection = await this.getCollection();
    const result = await collection.insertOne(data as T);
    return { _id: result.insertedId, ...data } as T;
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const collection = await this.getCollection();
    const result = await collection.insertMany(data as T[]);
    return data.map((item, idx) => ({
      _id: result.insertedIds[idx],
      ...item,
    })) as T[];
  }

  // READ
  async findById(id: string): Promise<T | null> {
    const collection = await this.getCollection();
    const filter = { _id: new ObjectId(id) } as Filter<T>;
    return collection.findOne(filter);
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    const collection = await this.getCollection();
    return collection.findOne(filter);
  }

  async find(filter: Filter<T> = {}, skip = 0, limit = 10): Promise<T[]> {
    const collection = await this.getCollection();
    return collection
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  async findAll(): Promise<T[]> {
    const collection = await this.getCollection();
    return collection.find({}).toArray();
  }

  async count(filter: Filter<T> = {}): Promise<number> {
    const collection = await this.getCollection();
    return collection.countDocuments(filter);
  }

  // UPDATE
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const collection = await this.getCollection();
    const filter = { _id: new ObjectId(id) } as Filter<T>;
    const result = await collection.findOneAndUpdate(
      filter,
      { $set: data },
      { returnDocument: 'after' }
    );
    return result.value || null;
  }

  async updateMany(filter: Filter<T>, data: Partial<T>): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.updateMany(filter, { $set: data });
    return result.modifiedCount;
  }

  // DELETE
  async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const filter = { _id: new ObjectId(id) } as Filter<T>;
    const result = await collection.deleteOne(filter);
    return result.deletedCount > 0;
  }

  async deleteMany(filter: Filter<T>): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany(filter);
    return result.deletedCount;
  }

  // AGGREGATION
  async aggregate(pipeline: any[]): Promise<any[]> {
    const collection = await this.getCollection();
    return collection.aggregate(pipeline).toArray();
  }

  // EXISTENCE CHECK
  async exists(filter: Filter<T>): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.findOne(filter, { projection: { _id: 1 } });
    return result !== null;
  }
}
