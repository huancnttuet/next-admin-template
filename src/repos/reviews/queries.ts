import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import { getReviewsCollection } from './collection';
import { mapReviewDocument } from './mapper';
import type { Review, ReviewPagedParams } from './types';

export async function findReviewsPaged({
  page,
  pageSize,
  keyword,
  productId,
}: ReviewPagedParams): Promise<PagedList<Review>> {
  const collection = await getReviewsCollection();
  const filter: Record<string, unknown> = {};

  if (productId) {
    filter.productId = productId;
  }

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { title: { $regex: keyword, $options: 'i' } },
      { content: { $regex: keyword, $options: 'i' } },
      { productId: { $regex: keyword, $options: 'i' } },
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
    items: docs.map(mapReviewDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findReviewById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getReviewsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapReviewDocument(doc) : null;
}
