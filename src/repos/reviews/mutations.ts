import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getReviewsCollection } from './collection';
import { mapReviewDocument } from './mapper';
import { createReviewSchema, updateReviewSchema } from './schema';
import type { ReviewDocument } from './types';

function normalizeDateValue(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

export async function insertReview(input: z.infer<typeof createReviewSchema>) {
  const collection = await getReviewsCollection();
  const now = new Date();

  const createdAt = normalizeDateValue(input.createdAt, now);
  const updatedAt = normalizeDateValue(input.updatedAt, now);

  const result = await collection.insertOne({
    name: input.name.trim(),
    avatar: (input.avatar || '').trim(),
    title: (input.title || '').trim(),
    content: input.content.trim(),
    productId: input.productId.trim(),
    rating: input.rating,
    images: input.images,
    video: (input.video || '').trim(),
    createdAt,
    updatedAt,
  } as ReviewDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create review');
  }

  return mapReviewDocument(doc);
}

export async function updateReviewById(
  id: string,
  patch: z.infer<typeof updateReviewSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getReviewsCollection();
  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.name === 'string') nextPatch.name = patch.name.trim();
  if (typeof patch.avatar === 'string') nextPatch.avatar = patch.avatar.trim();
  if (typeof patch.title === 'string') nextPatch.title = patch.title.trim();
  if (typeof patch.content === 'string')
    nextPatch.content = patch.content.trim();
  if (typeof patch.productId === 'string') {
    nextPatch.productId = patch.productId.trim();
  }
  if (typeof patch.rating === 'number') nextPatch.rating = patch.rating;
  if (Array.isArray(patch.images)) nextPatch.images = patch.images;
  if (typeof patch.video === 'string') nextPatch.video = patch.video.trim();
  if (typeof patch.createdAt === 'string') {
    nextPatch.createdAt = normalizeDateValue(patch.createdAt, new Date());
  }
  if (typeof patch.updatedAt === 'string') {
    nextPatch.updatedAt = normalizeDateValue(patch.updatedAt, new Date());
  }

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextPatch });

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapReviewDocument(updated) : null;
}

export async function deleteReviewById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getReviewsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteReviewsByIds(ids: string[]) {
  const uniqueValidIds = Array.from(new Set(ids)).filter((id) =>
    ObjectId.isValid(id),
  );

  if (uniqueValidIds.length === 0) {
    return {
      requestedCount: ids.length,
      deletedCount: 0,
    };
  }

  const collection = await getReviewsCollection();
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
