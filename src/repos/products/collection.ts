import { getMongoDb } from '@/lib/mongodb';
import type { ProductDocument } from './types';

const COLLECTION_NAME = 'products';

export async function getProductsCollection() {
  const db = await getMongoDb();
  const collection = db.collection<ProductDocument>(COLLECTION_NAME);
  await collection.createIndex({ sku: 1 }, { unique: true });
  await collection.createIndex({ name: 1 });
  await collection.createIndex({ categories: 1 });
  return collection;
}
