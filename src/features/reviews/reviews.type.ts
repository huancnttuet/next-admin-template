export interface Review {
  id: string;
  name: string;
  avatar: string;
  title: string;
  content: string;
  productId: string;
  rating: number;
  images: string[];
  video: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReviewsParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  ProductId?: string;
}

export interface CreateReviewPayload {
  name: string;
  avatar?: string;
  title?: string;
  content: string;
  productId: string;
  rating: number;
  images?: string[];
  video?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateReviewPayload = Partial<CreateReviewPayload>;
