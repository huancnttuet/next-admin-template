import axios from 'axios';
import type { PagedList } from '@/types/api';
import type {
  CreateReviewPayload,
  GetReviewsParams,
  Review,
  UpdateReviewPayload,
} from './reviews.type';

export const getPagedReviews = async (
  params: GetReviewsParams,
): Promise<PagedList<Review>> => {
  const res = await axios.get<PagedList<Review>>('/api/reviews/paged-list', {
    params,
  });
  return res.data;
};

export const getReviewById = async (id: string): Promise<Review> => {
  const res = await axios.get<Review>(`/api/reviews/${id}`);
  return res.data;
};

export const createReview = async (
  payload: CreateReviewPayload,
): Promise<Review> => {
  const res = await axios.post<Review>('/api/reviews', payload);
  return res.data;
};

export const updateReview = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateReviewPayload;
}): Promise<Review> => {
  const res = await axios.put<Review>(`/api/reviews/${id}`, payload);
  return res.data;
};

export const deleteReview = async (id: string): Promise<void> => {
  await axios.delete(`/api/reviews/${id}`);
};

export const bulkDeleteReviews = async (ids: string[]): Promise<void> => {
  await axios.post('/api/reviews/bulk-delete', { ids });
};
