import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import { getCategoriesCollection } from './collection';
import { mapCategoryDocument } from './mapper';
import type { Category, CategoryPagedParams } from './types';

export async function findCategoriesPaged({
  page,
  pageSize,
  keyword,
  isActive,
}: CategoryPagedParams): Promise<PagedList<Category>> {
  const collection = await getCategoriesCollection();
  const filter: Record<string, unknown> = {};

  if (typeof isActive === 'boolean') {
    filter.isActive = isActive;
  }

  if (keyword) {
    filter.$or = [
      { slug: { $regex: keyword, $options: 'i' } },
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
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
    items: docs.map(mapCategoryDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findCategoryById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getCategoriesCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapCategoryDocument(doc) : null;
}
