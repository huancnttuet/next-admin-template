import type { Order, OrderDocument } from './types';

export function mapOrderDocument(doc: OrderDocument): Order {
  if (!doc._id) {
    throw new Error('Invalid order document');
  }

  return {
    id: doc._id.toHexString(),
    orderId: doc.orderId,
    customer: doc.customer ?? '',
    address: doc.address ?? '',
    note: doc.note ?? '',
    orderItems: doc.orderItems ?? [],
    discount: doc.discount ?? 0,
    shippingCost: doc.shippingCost ?? 0,
    total: doc.total ?? 0,
    status: doc.status,
    isReviewed: doc.isReviewed ?? false,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
