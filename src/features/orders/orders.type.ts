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

export function getOrderStatusOptions(t: (key: string) => string) {
  return [
    { label: t('statusPending'), value: 'PENDING' as const },
    { label: t('statusConfirmed'), value: 'CONFIRMED' as const },
    { label: t('statusDelivering'), value: 'DELIVERING' as const },
    { label: t('statusDelivered'), value: 'DELIVERED' as const },
    { label: t('statusCancelled'), value: 'CANCELLED' as const },
  ];
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

export interface GetOrdersParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  Status?: OrderStatus;
}

export interface CreateOrderPayload {
  orderId: string;
  customer?: string;
  address?: string;
  note?: string;
  orderItems?: OrderItem[];
  discount?: number;
  shippingCost?: number;
  total?: number;
  status?: OrderStatus;
  isReviewed?: boolean;
}

export type UpdateOrderPayload = Partial<CreateOrderPayload>;
