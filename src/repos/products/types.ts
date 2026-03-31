import { ObjectId } from 'mongodb';

export interface ProductDocument {
  _id?: ObjectId;
  name: string;
  sku: string;
  description?: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
  images: string[];
  videoUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  categories: string[];
  price: number;
  originalPrice: number | null;
  quantity: number;
  image: string;
  images: string[];
  videoUrl: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface ProductPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
}
