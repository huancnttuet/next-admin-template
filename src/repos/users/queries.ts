import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import type { User } from '@/services/users';
import { getUsersCollection } from './collection';
import { mapUserDocument } from './mapper';
import type { UserPagedParams } from './types';

export async function findUsersPaged({
  page,
  pageSize,
  keyword,
  isVerify,
  isLock,
}: UserPagedParams): Promise<PagedList<User>> {
  const collection = await getUsersCollection();
  const filter: Record<string, unknown> = {};

  if (typeof isVerify === 'boolean') {
    filter.isVerify = isVerify;
  }

  if (typeof isLock === 'boolean') {
    filter.isLock = isLock;
  }

  if (keyword) {
    filter.$or = [
      { fullName: { $regex: keyword, $options: 'i' } },
      { userName: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } },
    ];
  }

  const totalCount = await collection.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const normalizedPage = Math.min(Math.max(page, 1), totalPages);
  const skip = (normalizedPage - 1) * pageSize;

  const docs = await collection
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  return {
    items: docs.map(mapUserDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findUserById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getUsersCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapUserDocument(doc) : null;
}
