import type { Product, ProductDocument } from './types';

export function mapProductDocument(doc: ProductDocument): Product {
  if (!doc._id) {
    throw new Error('Invalid product document');
  }

  return {
    id: doc._id.toHexString(),
    name: doc.name,
    sku: doc.sku,
    description: doc.description ?? '',
    categories: doc.categories ?? [],
    price: doc.price,
    originalPrice:
      typeof doc.originalPrice === 'number' ? doc.originalPrice : null,
    quantity: doc.quantity,
    image: doc.image ?? '',
    detailImages: doc.detailImages ?? doc.images ?? [],
    videoUrl: doc.videoUrl ?? '',
    isActive: doc.isActive,
    isFeatured: doc.isFeatured,
  };
}
