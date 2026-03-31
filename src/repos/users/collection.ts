import { getMongoDb } from '@/lib/mongodb';
import type { UserDocument } from './types';

const COLLECTION_NAME = 'users';

export async function getUsersCollection() {
  const db = await getMongoDb();
  const collection = db.collection<UserDocument>(COLLECTION_NAME);
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ userName: 1 }, { unique: true });
  return collection;
}
