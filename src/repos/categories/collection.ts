import { getMongoDb } from '@/lib/mongodb';
import type { CategoryDocument } from './types';

const COLLECTION_NAME = 'categories';

export async function getCategoriesCollection() {
  const db = await getMongoDb();
  const collection = db.collection<CategoryDocument>(COLLECTION_NAME);
  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ name: 1 }, { unique: true });
  return collection;
}
