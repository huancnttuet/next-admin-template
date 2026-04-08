import { ObjectId } from 'mongodb';

export interface ReviewDocument {
  _id?: ObjectId;
  name: string;
  avatar?: string;
  title?: string;
  content: string;
  productId: string;
  rating: number;
  images: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface ReviewPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  productId?: string;
}
