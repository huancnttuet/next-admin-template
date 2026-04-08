import { ObjectId } from 'mongodb';

export const ORDER_STATUS_VALUES = [
  'PENDING',
  'CONFIRMED',
  'DELIVERING',
  'DELIVERED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  typeName: string;
  _id: string;
}

export interface OrderDocument {
  _id?: ObjectId;
  orderId: string;
  customer?: string;
  address: string;
  note?: string;
  orderItems?: OrderItem[];
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  isReviewed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderId: string;
  customer: string;
  address: string;
  note: string;
  orderItems: OrderItem[];
  discount: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  isReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: OrderStatus;
}
