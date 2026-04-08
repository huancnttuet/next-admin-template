import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkDeleteCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  getPagedCategories,
  updateCategory,
} from './categories.api';
import type { GetCategoriesParams } from './categories.type';

export const CATEGORY_QUERY_KEY = 'categories';

export const usePagedCategories = (params: GetCategoriesParams) =>
  useQuery({
    queryKey: [CATEGORY_QUERY_KEY, params],
    queryFn: () => getPagedCategories(params),
  });

export const useCategoryById = (id: string) =>
  useQuery({
    queryKey: [CATEGORY_QUERY_KEY, id],
    queryFn: () => getCategoryById(id),
    enabled: Boolean(id),
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteCategories(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};
