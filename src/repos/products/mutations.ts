import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getProductsCollection } from './collection';
import { mapProductDocument } from './mapper';
import { createProductSchema, updateProductSchema } from './schema';
import type { ProductDocument } from './types';

function sanitizeSubProducts(value: unknown): ProductDocument['subProducts'] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is Record<string, unknown> =>
        !!item && typeof item === 'object',
    )
    .map((item) => ({
      name: typeof item.name === 'string' ? item.name.trim() : '',
      price:
        typeof item.price === 'number' ? item.price : Number(item.price ?? 0),
      originalPrice:
        typeof item.originalPrice === 'number'
          ? item.originalPrice
          : item.originalPrice === undefined || item.originalPrice === null
            ? undefined
            : Number(item.originalPrice),
      image: typeof item.image === 'string' ? item.image.trim() : '',
      quantity:
        typeof item.quantity === 'number'
          ? item.quantity
          : Number(item.quantity ?? 0),
    }))
    .filter(
      (item) =>
        item.name.length > 0 &&
        Number.isFinite(item.price) &&
        item.price >= 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity >= 0,
    )
    .map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Math.floor(Number(item.quantity)),
      originalPrice:
        typeof item.originalPrice === 'number' &&
        Number.isFinite(item.originalPrice)
          ? Number(item.originalPrice)
          : undefined,
    }));
}

export async function insertProduct(
  input: z.infer<typeof createProductSchema>,
) {
  const collection = await getProductsCollection();
  const now = new Date();

  const result = await collection.insertOne({
    name: input.name.trim(),
    sku: input.sku.trim().toUpperCase(),
    description: (input.description || '').trim(),
    categories: Array.from(
      new Set(
        (input.categories || [])
          .map((category) => category.trim())
          .filter(Boolean),
      ),
    ),
    price: input.price,
    originalPrice: input.originalPrice,
    quantity: input.quantity,
    image: (input.image || '').trim(),
    detailImages: Array.from(
      new Set(
        (input.detailImages || []).map((image) => image.trim()).filter(Boolean),
      ),
    ),
    videoUrl: (input.videoUrl || '').trim(),
    pieces: (input.pieces || '').trim(),
    difficulty: (input.difficulty || '').trim(),
    dimensions: (input.dimensions || '').trim(),
    shortDescription: (input.shortDescription || '').trim(),
    shopeeLink: (input.shopeeLink || '').trim(),
    tiktokLink: (input.tiktokLink || '').trim(),
    youtubeLink: (input.youtubeLink || '').trim(),
    subProducts: sanitizeSubProducts(input.subProducts),
    isActive: input.isActive,
    isFeatured: input.isFeatured,
    createdAt: now,
    updatedAt: now,
  } as ProductDocument);

  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error('Failed to create product');
  }

  return mapProductDocument(doc);
}

export async function updateProductById(
  id: string,
  patch: z.infer<typeof updateProductSchema>,
) {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getProductsCollection();
  const nextPatch: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (typeof patch.name === 'string') nextPatch.name = patch.name.trim();
  if (typeof patch.sku === 'string')
    nextPatch.sku = patch.sku.trim().toUpperCase();
  if (typeof patch.description === 'string')
    nextPatch.description = patch.description.trim();
  if (Array.isArray(patch.categories)) {
    nextPatch.categories = Array.from(
      new Set(
        patch.categories.map((category) => category.trim()).filter(Boolean),
      ),
    );
  }
  if (typeof patch.price === 'number') nextPatch.price = patch.price;
  if (typeof patch.originalPrice === 'number')
    nextPatch.originalPrice = patch.originalPrice;
  if (patch.originalPrice === null) nextPatch.originalPrice = null;
  if (typeof patch.quantity === 'number') nextPatch.quantity = patch.quantity;
  if (typeof patch.image === 'string') nextPatch.image = patch.image.trim();
  if (Array.isArray(patch.detailImages)) {
    nextPatch.detailImages = Array.from(
      new Set(patch.detailImages.map((image) => image.trim()).filter(Boolean)),
    );
  }
  if (typeof patch.videoUrl === 'string')
    nextPatch.videoUrl = patch.videoUrl.trim();
  if (typeof patch.pieces === 'string') nextPatch.pieces = patch.pieces.trim();
  if (typeof patch.difficulty === 'string')
    nextPatch.difficulty = patch.difficulty.trim();
  if (typeof patch.dimensions === 'string')
    nextPatch.dimensions = patch.dimensions.trim();
  if (typeof patch.shortDescription === 'string')
    nextPatch.shortDescription = patch.shortDescription.trim();
  if (typeof patch.shopeeLink === 'string')
    nextPatch.shopeeLink = patch.shopeeLink.trim();
  if (typeof patch.tiktokLink === 'string')
    nextPatch.tiktokLink = patch.tiktokLink.trim();
  if (typeof patch.youtubeLink === 'string')
    nextPatch.youtubeLink = patch.youtubeLink.trim();
  if (Array.isArray(patch.subProducts)) {
    nextPatch.subProducts = sanitizeSubProducts(patch.subProducts);
  }
  if (typeof patch.isActive === 'boolean') nextPatch.isActive = patch.isActive;
  if (typeof patch.isFeatured === 'boolean')
    nextPatch.isFeatured = patch.isFeatured;

  await collection.updateOne({ _id: new ObjectId(id) }, { $set: nextPatch });

  const updated = await collection.findOne({ _id: new ObjectId(id) });
  return updated ? mapProductDocument(updated) : null;
}

export async function deleteProductById(id: string) {
  if (!ObjectId.isValid(id)) return false;

  const collection = await getProductsCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function deleteProductsByIds(ids: string[]) {
  const uniqueValidIds = Array.from(new Set(ids)).filter((id) =>
    ObjectId.isValid(id),
  );

  if (uniqueValidIds.length === 0) {
    return {
      requestedCount: ids.length,
      deletedCount: 0,
    };
  }

  const collection = await getProductsCollection();
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
