import { getMongoDb } from '@/lib/mongodb';
import type { ReviewDocument } from './types';

const COLLECTION_NAME = 'reviews';

export async function getReviewsCollection() {
  const db = await getMongoDb();
  const collection = db.collection<ReviewDocument>(COLLECTION_NAME);
  await collection.createIndex({ productId: 1 });
  await collection.createIndex({ name: 1 });
  await collection.createIndex({ createdAt: -1 });
  return collection;
}
