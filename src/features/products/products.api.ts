import axios from 'axios';
import type { PagedList } from '@/types/api';
import type {
  CreateProductPayload,
  GetProductsParams,
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
