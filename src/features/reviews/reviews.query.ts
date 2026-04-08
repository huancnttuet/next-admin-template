import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkDeleteReviews,
  createReview,
  deleteReview,
  getPagedReviews,
  getReviewById,
  updateReview,
} from './reviews.api';
import type { GetReviewsParams } from './reviews.type';

export const REVIEW_QUERY_KEY = 'reviews';

export const usePagedReviews = (params: GetReviewsParams) =>
  useQuery({
    queryKey: [REVIEW_QUERY_KEY, params],
    queryFn: () => getPagedReviews(params),
  });

export const useReviewById = (id: string) =>
  useQuery({
    queryKey: [REVIEW_QUERY_KEY, id],
    queryFn: () => getReviewById(id),
    enabled: Boolean(id),
  });

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEY] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEY] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEY] });
    },
  });
};

export const useBulkDeleteReviews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteReviews(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVIEW_QUERY_KEY] });
    },
  });
};
