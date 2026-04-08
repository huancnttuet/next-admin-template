import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getOrdersCollection } from './collection';
import { mapOrderDocument } from './mapper';
import { createOrderSchema, updateOrderSchema } from './schema';
import type { OrderDocument } from './types';

export async function insertOrder(input: z.infer<typeof createOrderSchema>) {
  const collection = await getOrdersCollection();
  const now = new Date();

  const total = (input.orderItems || []).reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0,
  ) + (input.shippingCost ?? 0) - (input.discount ?? 0);

  const result = await collection.insertOne({
    orderId: input.orderId.trim().toUpperCase(),
    customer: (input.customer || '').trim(),
    address: (input.address || '').trim(),
    note: (input.note || '').trim(),
    orderItems: input.orderItems || [],
    discount: input.discount,
    shippingCost: input.shippingCost,
    total,
    status: input.status,
    isReviewed: input.isReviewed,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  } as OrderDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create order');
  }

  return mapOrderDocument(doc);
}

export async function updateOrderById(
  id: string,
  patch: z.infer<typeof updateOrderSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getOrdersCollection();
  const existingOrder = await collection.findOne({ _id: new ObjectId(id) });
  if (!existingOrder) return null;

  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.orderId === 'string') {
    nextPatch.orderId = patch.orderId.trim().toUpperCase();
  }
  if (typeof patch.customer === 'string') {
    nextPatch.customer = patch.customer.trim();
  }
  if (typeof patch.address === 'string') {
    nextPatch.address = patch.address.trim();
  }
  if (typeof patch.note === 'string') {
    nextPatch.note = patch.note.trim();
  }

  // Calculate potential new total based on existing document + patch updates
  let currentDiscount = existingOrder.discount ?? 0;
  let currentShippingCost = existingOrder.shippingCost ?? 0;
  let currentItemsTotal =
    existingOrder.orderItems?.reduce(
      (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
      0,
    ) ?? 0;

  if (Array.isArray(patch.orderItems)) {
    const sanitizedItems = patch.orderItems || [];
    nextPatch.orderItems = sanitizedItems;
    currentItemsTotal = sanitizedItems.reduce(
      (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
      0,
    );
  }
  if (typeof patch.discount === 'number') {
    nextPatch.discount = patch.discount;
    currentDiscount = patch.discount;
  }
  if (typeof patch.shippingCost === 'number') {
    nextPatch.shippingCost = patch.shippingCost;
    currentShippingCost = patch.shippingCost;
  }

  nextPatch.total = Math.max(
    currentItemsTotal + currentShippingCost - currentDiscount,
    patch.total ?? 0,
  );

  if (typeof patch.status === 'string') {
    nextPatch.status = patch.status;
  }
  if (typeof patch.isReviewed === 'boolean') {
    nextPatch.isReviewed = patch.isReviewed;
  }

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextPatch });

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapOrderDocument(updated) : null;
}

export async function deleteOrderById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getOrdersCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteOrdersByIds(ids: string[]) {
  const uniqueValidIds = Array.from(new Set(ids)).filter((id) =>
    ObjectId.isValid(id),
  );

  if (uniqueValidIds.length === 0) {
    return {
      requestedCount: ids.length,
      deletedCount: 0,
    };
  }

  const collection = await getOrdersCollection();
  const result = await collection.deleteMany({
    _id: {
      $in: uniqueValidIds.map((id) => new ObjectId(id)),
    },
  });

  return {
    requestedCount: ids.length,
    deletedCount: result.deletedCount,
  };
}
