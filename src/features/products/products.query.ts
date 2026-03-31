import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  getPagedProducts,
  getProductById,
  updateProduct,
} from './products.api';
import type {
  CreateProductPayload,
  GetProductsParams,
  UpdateProductPayload,
} from './products.type';

export const PRODUCT_QUERY_KEY = 'products';

export const usePagedProducts = (params: GetProductsParams) =>
  useQuery({
    queryKey: [PRODUCT_QUERY_KEY, params],
    queryFn: () => getPagedProducts(params),
    placeholderData: keepPreviousData,
  });

export const useProductById = (id: string) =>
  useQuery({
    queryKey: [PRODUCT_QUERY_KEY, id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => updateProduct(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
    },
  });
};
