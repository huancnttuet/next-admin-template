import type { PromoCode, PromoCodeDocument } from './types';

export function mapPromocodeDocument(doc: PromoCodeDocument): PromoCode {
  if (!doc._id) {
    throw new Error('Invalid promocode document');
  }

  return {
    id: doc._id.toHexString(),
    code: doc.code,
    name: doc.name,
    description: doc.description ?? '',
    discountType: doc.discountType,
    discountValue: doc.discountValue,
    maxAmount: doc.maxAmount ?? 0,
    minSpend: doc.minSpend ?? 0,
    startDate: doc.startDate.toISOString(),
    endDate: doc.endDate.toISOString(),
    usageLimit: doc.usageLimit,
    usedCount: doc.usedCount,
    isActive: doc.isActive,
  };
}
