import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getCategoriesCollection } from './collection';
import { mapCategoryDocument } from './mapper';
import { createCategorySchema, updateCategorySchema } from './schema';
import type { CategoryDocument } from './types';

export async function insertCategory(
  input: z.infer<typeof createCategorySchema>,
) {
  const collection = await getCategoriesCollection();
  const now = new Date();

  const result = await collection.insertOne({
    slug: input.slug.trim().toLowerCase(),
    name: input.name.trim(),
    description: (input.description || '').trim(),
    isActive: input.isActive,
    createdAt: now,
    updatedAt: now,
  } as CategoryDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create category');
  }

  return mapCategoryDocument(doc);
}

export async function updateCategoryById(
  id: string,
  patch: z.infer<typeof updateCategorySchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getCategoriesCollection();
  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.name === 'string') nextPatch.name = patch.name.trim();
  if (typeof patch.description === 'string')
    nextPatch.description = patch.description.trim();
  if (typeof patch.isActive === 'boolean') nextPatch.isActive = patch.isActive;

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextPatch });

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapCategoryDocument(updated) : null;
}

export async function deleteCategoryById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getCategoriesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteCategoriesByIds(ids: string[]) {
  const uniqueValidIds = Array.from(new Set(ids)).filter((id) =>
    ObjectId.isValid(id),
  );

  if (uniqueValidIds.length === 0) {
    return {
      requestedCount: ids.length,
      deletedCount: 0,
    };
  }

  const collection = await getCategoriesCollection();
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
