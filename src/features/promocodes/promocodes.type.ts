export const DISCOUNT_TYPE_VALUES = ['percent', 'fixed'] as const;

export type DiscountType = (typeof DISCOUNT_TYPE_VALUES)[number];

export function getDiscountTypeOptions(t: (key: string) => string) {
  return [
    { label: t('discountTypePercent'), value: 'percent' as const },
    { label: t('discountTypeFixed'), value: 'fixed' as const },
  ];
}

export interface Promocode {
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

export interface GetPromocodesParams {
  Page?: number;
  PageSize?: number;
  Keyword?: string;
  IsActive?: boolean;
  DiscountType?: DiscountType;
}

export interface CreatePromocodePayload {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  maxAmount?: number;
  minSpend?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
}

export type UpdatePromocodePayload = Omit<
  Partial<CreatePromocodePayload>,
  'code' | 'usedCount'
>;
