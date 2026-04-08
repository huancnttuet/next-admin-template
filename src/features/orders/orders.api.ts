import axios from 'axios';
import type { PagedList } from '@/types/api';
import type {
  CreateOrderPayload,
  GetOrdersParams,
  Order,
  UpdateOrderPayload,
} from './orders.type';

export const getPagedOrders = async (
  params: GetOrdersParams,
): Promise<PagedList<Order>> => {
  const res = await axios.get<PagedList<Order>>('/api/orders/paged-list', {
    params,
  });
  return res.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await axios.get<Order>(`/api/orders/${id}`);
  return res.data;
};

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const res = await axios.post<Order>('/api/orders', payload);
  return res.data;
};

export const updateOrder = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateOrderPayload;
}): Promise<Order> => {
  const res = await axios.put<Order>(`/api/orders/${id}`, payload);
  return res.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`/api/orders/${id}`);
};

export const bulkDeleteOrders = async (ids: string[]): Promise<void> => {
  await axios.post('/api/orders/bulk-delete', { ids });
};
