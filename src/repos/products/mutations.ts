import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getProductsCollection } from './collection';
import { mapProductDocument } from './mapper';
import { createProductSchema, updateProductSchema } from './schema';
import type { ProductDocument } from './types';

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
    images: Array.from(
      new Set(
        (input.images || []).map((image) => image.trim()).filter(Boolean),
      ),
    ),
    videoUrl: (input.videoUrl || '').trim(),
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
  if (Array.isArray(patch.images)) {
    nextPatch.images = Array.from(
      new Set(patch.images.map((image) => image.trim()).filter(Boolean)),
    );
  }
  if (typeof patch.videoUrl === 'string')
    nextPatch.videoUrl = patch.videoUrl.trim();
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
