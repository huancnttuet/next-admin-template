import { getMongoDb } from '@/lib/mongodb';
import type { OrderDocument } from './types';

const COLLECTION_NAME = 'orders';

export async function getOrdersCollection() {
  const db = await getMongoDb();
  const collection = db.collection<OrderDocument>(COLLECTION_NAME);
  await collection.createIndex({ orderId: 1 }, { unique: true });
  await collection.createIndex({ status: 1 });
  await collection.createIndex({ createdAt: -1 });
  return collection;
}
