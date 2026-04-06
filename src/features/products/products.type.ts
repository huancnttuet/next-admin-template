export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  detailImages: string[];
  videoUrl: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface GetProductsParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  IsActive?: boolean;
  Category?: string;
  Categories?: string;
  IsFeatured?: boolean;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  description?: string;
  categories: string[];
  price: number;
  originalPrice?: number;
  quantity?: number;
  image?: string;
  detailImages?: string[];
  videoUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
