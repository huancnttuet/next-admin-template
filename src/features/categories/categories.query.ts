import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getPagedCategories,
  updateCategory,
} from './categories.api';
import type {
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from './categories.type';

export const CATEGORY_QUERY_KEY = 'categories';

export const usePagedCategories = (params: GetCategoriesParams) =>
  useQuery({
    queryKey: [CATEGORY_QUERY_KEY, params],
    queryFn: () => getPagedCategories(params),
    placeholderData: keepPreviousData,
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
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCategoryPayload;
    }) => updateCategory(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CATEGORY_QUERY_KEY, variables.id],
      });
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
