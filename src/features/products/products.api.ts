import axios from 'axios';
import type { PagedList } from '@/types/api';
import type {
  CreateProductPayload,
  GetProductsParams,
  ImportProductsResult,
  Product,
  UpdateProductPayload,
} from './products.type';

export const getPagedProducts = async (
  params: GetProductsParams,
): Promise<PagedList<Product>> => {
  const res = await axios.get<PagedList<Product>>('/api/products/paged-list', {
    params,
  });
  return res.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await axios.get<Product>(`/api/products/${id}`);
  return res.data;
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const res = await axios.post<Product>('/api/products', payload);
  return res.data;
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const res = await axios.put<Product>(`/api/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axios.delete(`/api/products/${id}`);
};

export const bulkDeleteProducts = async (ids: string[]): Promise<void> => {
  await axios.post('/api/products/bulk-delete', { ids });
};

export const importProductsFromXlsx = async (
  file: File,
): Promise<ImportProductsResult> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post<ImportProductsResult>(
    '/api/products/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return res.data;
};
