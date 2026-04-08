import axios from 'axios';
import type { PagedList } from '@/types/api';
import type {
  Category,
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from './categories.type';

export const getPagedCategories = async (
  params: GetCategoriesParams,
): Promise<PagedList<Category>> => {
  const res = await axios.get<PagedList<Category>>(
    '/api/categories/paged-list',
    {
      params,
    },
  );
  return res.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await axios.get<Category>(`/api/categories/${id}`);
  return res.data;
};

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const res = await axios.post<Category>('/api/categories', payload);
  return res.data;
};

export const updateCategory = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateCategoryPayload;
}): Promise<Category> => {
  const res = await axios.put<Category>(`/api/categories/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await axios.delete(`/api/categories/${id}`);
};

export const bulkDeleteCategories = async (ids: string[]): Promise<void> => {
  await axios.post('/api/categories/bulk-delete', { ids });
};
