import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getPromocodesCollection } from './collection';
import { mapPromocodeDocument } from './mapper';
import { createPromocodeSchema, updatePromocodeSchema } from './schema';
import type { PromoCodeDocument } from './types';

export async function insertPromocode(
  input: z.infer<typeof createPromocodeSchema>,
) {
  const collection = await getPromocodesCollection();
  const now = new Date();
  const startDate =
    typeof input.startDate === 'string' ? new Date(input.startDate) : now;
  const endDate =
    typeof input.endDate === 'string' ? new Date(input.endDate) : startDate;

  const result = await collection.insertOne({
    code: input.code.trim().toUpperCase(),
    name: input.name.trim(),
    description: (input.description || '').trim(),
    discountType: input.discountType,
    discountValue: input.discountValue,
    maxAmount: input.maxAmount,
    minSpend: input.minSpend,
    startDate,
    endDate,
    usageLimit: input.usageLimit,
    usedCount: input.usedCount,
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  } as PromoCodeDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create promocode');
  }

  return mapPromocodeDocument(doc);
}

export async function updatePromocodeById(
  id: string,
  patch: z.infer<typeof updatePromocodeSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getPromocodesCollection();
  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.name === 'string') nextPatch.name = patch.name.trim();
  if (typeof patch.description === 'string') {
    nextPatch.description = patch.description.trim();
  }
  if (patch.discountType === 'percent' || patch.discountType === 'fixed') {
    nextPatch.discountType = patch.discountType;
  }
  if (typeof patch.discountValue === 'number') {
    nextPatch.discountValue = patch.discountValue;
  }
  if (typeof patch.maxAmount === 'number') {
    nextPatch.maxAmount = patch.maxAmount;
  }
  if (typeof patch.minSpend === 'number') {
    nextPatch.minSpend = patch.minSpend;
  }
  if (
    typeof patch.startDate === 'string' &&
    patch.startDate.trim().length > 0
  ) {
    nextPatch.startDate = new Date(patch.startDate);
  }
  if (typeof patch.endDate === 'string' && patch.endDate.trim().length > 0) {
    nextPatch.endDate = new Date(patch.endDate);
  }
  if (typeof patch.usageLimit === 'number') {
    nextPatch.usageLimit = patch.usageLimit;
  }
  if (typeof patch.isActive === 'boolean') {
    nextPatch.isActive = patch.isActive;
  }

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextPatch });

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapPromocodeDocument(updated) : null;
}

export async function deletePromocodeById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getPromocodesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deletePromocodesByIds(ids: string[]) {
  const uniqueValidIds = Array.from(new Set(ids)).filter((id) =>
    ObjectId.isValid(id),
  );

  if (uniqueValidIds.length === 0) {
    return {
      requestedCount: ids.length,
      deletedCount: 0,
    };
  }

  const collection = await getPromocodesCollection();
  const result = await collection.deleteMany({
    _id: {
      $in: uniqueValidIds.map((id) => new ObjectId(id)),
    },
  });

  return {
    requestedCount: ids.length,
    deletedCount: result.deletedCount,
  };
}
