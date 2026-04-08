import { ObjectId } from 'mongodb';
import type { PagedList } from '@/types/api';
import { getOrdersCollection } from './collection';
import { mapOrderDocument } from './mapper';
import type { Order, OrderPagedParams } from './types';

export async function findOrdersPaged({
  page,
  pageSize,
  keyword,
  status,
}: OrderPagedParams): Promise<PagedList<Order>> {
  const collection = await getOrdersCollection();
  const filter: Record<string, unknown> = {};

  if (status) {
    filter.status = status;
  }

  if (keyword) {
    filter.$or = [
      { orderId: { $regex: keyword, $options: 'i' } },
      { customer: { $regex: keyword, $options: 'i' } },
      { address: { $regex: keyword, $options: 'i' } },
      { note: { $regex: keyword, $options: 'i' } },
      { orderItems: { $regex: keyword, $options: 'i' } },
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
    items: docs.map(mapOrderDocument),
    totalCount,
    page: normalizedPage,
    pageSize,
    totalPages,
    hasNextPage: normalizedPage < totalPages,
    hasPreviousPage: normalizedPage > 1,
  };
}

export async function findOrderById(id: string) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getOrdersCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? mapOrderDocument(doc) : null;
}
