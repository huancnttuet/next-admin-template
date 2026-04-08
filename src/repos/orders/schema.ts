import { z } from 'zod';
import { ORDER_STATUS_VALUES } from './types';

const orderItemSchema = z.object({
  productId: z.string().optional().default(''),
  productName: z.string().optional().default(''),
  quantity: z.coerce.number().int().nonnegative().default(1),
  price: z.coerce.number().nonnegative().default(0),
  image: z.string().optional().default(''),
  typeName: z.string().optional().default(''),
  _id: z.string().optional().default(''),
});

export const createOrderSchema = z.object({
  orderId: z.string().min(1),
  customer: z.string().optional().default(''),
  address: z.string().optional().default(''),
  note: z.string().optional().default(''),
  orderItems: z.array(orderItemSchema).optional().default([]),
  discount: z.coerce.number().nonnegative().default(0),
  shippingCost: z.coerce.number().nonnegative().default(0),
  total: z.coerce.number().nonnegative().default(0),
  status: z.enum(ORDER_STATUS_VALUES).default('PENDING'),
  isReviewed: z.boolean().optional().default(false),
  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export const updateOrderSchema = createOrderSchema.partial();
