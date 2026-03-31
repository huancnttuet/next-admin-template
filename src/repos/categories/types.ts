import { ObjectId } from 'mongodb';

export interface CategoryDocument {
  _id?: ObjectId;
  slug: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface CategoryPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  isActive?: boolean;
}
