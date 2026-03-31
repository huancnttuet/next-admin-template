import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getUsersCollection } from './collection';
import { mapUserDocument } from './mapper';
import { createUserSchema, updateUserSchema } from './schema';
import type { UserDocument } from './types';

export async function insertUser(input: z.infer<typeof createUserSchema>) {
  const collection = await getUsersCollection();
  const now = new Date();

  const result = await collection.insertOne({
    fullName: input.fullName,
    userName: input.userName,
    email: input.email,
    roleIds: [],
    isVerify: input.isVerify,
    isLock: input.isLock,
    createdAt: now,
    updatedAt: now,
  } as UserDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create user');
  }

  return mapUserDocument(doc);
}

export async function updateUserById(
  id: string,
  patch: z.infer<typeof updateUserSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getUsersCollection();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } },
  );

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapUserDocument(updated) : null;
}

export async function deleteUserById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getUsersCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function seedUsersIfEmpty() {
  const collection = await getUsersCollection();
  const totalCount = await collection.estimatedDocumentCount();
  if (totalCount > 0) {
    return { created: 0 };
  }

  const now = new Date();
  const initialUsers: UserDocument[] = [
    {
      fullName: 'Admin User',
      userName: 'admin',
      email: process.env.JWT_ADMIN_EMAIL || 'admin@example.com',
      roleIds: [],
      isVerify: true,
      isLock: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      fullName: 'Demo Operator',
      userName: 'operator',
      email: 'operator@example.com',
      roleIds: [],
      isVerify: true,
      isLock: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      fullName: 'Guest User',
      userName: 'guest',
      email: 'guest@example.com',
      roleIds: [],
      isVerify: false,
      isLock: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const result = await collection.insertMany(initialUsers);
  return { created: result.insertedCount };
}
