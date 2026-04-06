import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import { getProductsCollection } from './collection';
import { mapProductDocument } from './mapper';
import type { Product, ProductPagedParams } from './types';

export async function findProductsPaged({
  page,
  pageSize,
  keyword,
  isActive,
  category,
  categories,
  isFeatured,
}: ProductPagedParams): Promise<PagedList<Product>> {
  const collection = await getProductsCollection();
  const filter: Record<string, unknown> = {};

  if (typeof isActive === 'boolean') {
    filter.isActive = isActive;
  }

  if (typeof isFeatured === 'boolean') {
    filter.isFeatured = isFeatured;
  }

  if (typeof category === 'string' && category.trim().length > 0) {
    filter.categories = category.trim();
  }

  if (Array.isArray(categories) && categories.length > 0) {
    filter.categories = {
      $in: categories
        .map((item) => item.trim())
        .filter((item) => item.length > 0),
    };
  }

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { sku: { $regex: keyword, $options: 'i' } },
      { categories: { $regex: keyword, $options: 'i' } },
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
    items: docs.map(mapProductDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findProductById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getProductsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapProductDocument(doc) : null;
}
