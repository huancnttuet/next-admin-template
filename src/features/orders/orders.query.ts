import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkDeleteOrders,
  createOrder,
  deleteOrder,
  getOrderById,
  getPagedOrders,
  updateOrder,
} from './orders.api';
import type { GetOrdersParams } from './orders.type';

export const ORDER_QUERY_KEY = 'orders';

export const usePagedOrders = (params: GetOrdersParams) =>
  useQuery({
    queryKey: [ORDER_QUERY_KEY, params],
    queryFn: () => getPagedOrders(params),
  });

export const useOrderById = (id: string) =>
  useQuery({
    queryKey: [ORDER_QUERY_KEY, id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
    },
  });
};

export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteOrders(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
    },
  });
};
