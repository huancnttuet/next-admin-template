import { ObjectId } from 'mongodb';

export type DiscountType = 'percent' | 'fixed';

export interface PromoCodeDocument {
  _id?: ObjectId;
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxAmount: number;
  minSpend: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxAmount: number;
  minSpend: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface PromoCodePagedParams {
  page: number;
  pageSize: number;
  keyword?: string;
  isActive?: boolean;
  discountType?: DiscountType;
}
