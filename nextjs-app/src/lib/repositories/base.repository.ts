import { getDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

export abstract class BaseRepository<T extends { id?: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async findAll(filter: Record<string, any> = {}, options: any = {}): Promise<T[]> {
    const db = await getDatabase();
    const query = db.collection(this.collectionName).find(filter);
    if (options.sort) query.sort(options.sort);
    if (options.limit) query.limit(options.limit);
    if (options.skip) query.skip(options.skip);
    return (await query.toArray()) as T[];
  }

  async findById(id: string): Promise<T | null> {
    const db = await getDatabase();
    const objectId = new ObjectId(id);
    return (await db.collection(this.collectionName).findOne({ _id: objectId })) as T | null;
  }

  async findOne(filter: Record<string, any>): Promise<T | null> {
    const db = await getDatabase();
    return (await db.collection(this.collectionName).findOne(filter)) as T | null;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const db = await getDatabase();
    const result = await db.collection(this.collectionName).insertOne(data as any);
    return { ...data, id: result.insertedId.toString() } as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const db = await getDatabase();
    const objectId = new ObjectId(id);
    const result = await db.collection(this.collectionName).findOneAndUpdate(
      { _id: objectId },
      { $set: data },
      { returnDocument: 'after' }
    );
    return result.value as T | null;
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const objectId = new ObjectId(id);
    const result = await db.collection(this.collectionName).deleteOne({ _id: objectId });
    return result.deletedCount > 0;
  }

  async deleteMany(filter: Record<string, any>): Promise<number> {
    const db = await getDatabase();
    const result = await db.collection(this.collectionName).deleteMany(filter);
    return result.deletedCount;
  }

  async count(filter: Record<string, any> = {}): Promise<number> {
    const db = await getDatabase();
    return await db.collection(this.collectionName).countDocuments(filter);
  }
}
