import { getMongoDb } from '@/lib/mongodb';
import type { RoleDocument } from './types';

const COLLECTION_NAME = 'roles';

export async function getRolesCollection() {
  const db = await getMongoDb();
  const collection = db.collection<RoleDocument>(COLLECTION_NAME);
  await collection.createIndex({ code: 1 }, { unique: true });
  await collection.createIndex({ name: 1 }, { unique: true });
  return collection;
}
