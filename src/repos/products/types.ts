import { ObjectId } from 'mongodb';

export interface SubProductDocument {
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  quantity: number;
}

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
  detailImages: string[];
  images?: string[];
  videoUrl?: string;
  pieces?: string;
  difficulty?: string;
  dimensions?: string;
  shortDescription?: string;
  shopeeLink?: string;
  tiktokLink?: string;
  youtubeLink?: string;
  subProducts?: SubProductDocument[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubProduct {
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  quantity: number;
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
  detailImages: string[];
  videoUrl: string;
  pieces: string;
  difficulty: string;
  dimensions: string;
  shortDescription: string;
  shopeeLink: string;
  tiktokLink: string;
  youtubeLink: string;
  subProducts: SubProduct[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface ProductPagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  isActive?: boolean;
  category?: string;
  categories?: string[];
  isFeatured?: boolean;
}
