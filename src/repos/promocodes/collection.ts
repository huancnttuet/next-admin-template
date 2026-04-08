import { getMongoDb } from '@/lib/mongodb';
import type { PromoCodeDocument } from './types';

const COLLECTION_NAME = 'promocodes';

export async function getPromocodesCollection() {
  const db = await getMongoDb();
  const collection = db.collection<PromoCodeDocument>(COLLECTION_NAME);
  await collection.createIndex({ code: 1 }, { unique: true });
  await collection.createIndex({ isActive: 1 });
  await collection.createIndex({ startDate: 1, endDate: 1 });
  return collection;
}
