import type { Product, ProductDocument } from './types';

function mapSubProducts(doc: ProductDocument) {
  return (doc.subProducts ?? []).map((subProduct) => ({
    name: subProduct.name ?? '',
    price: typeof subProduct.price === 'number' ? subProduct.price : 0,
    originalPrice:
      typeof subProduct.originalPrice === 'number'
        ? subProduct.originalPrice
        : null,
    image: subProduct.image ?? '',
    quantity: typeof subProduct.quantity === 'number' ? subProduct.quantity : 0,
  }));
}

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
    pieces: doc.pieces ?? '',
    difficulty: doc.difficulty ?? '',
    dimensions: doc.dimensions ?? '',
    shortDescription: doc.shortDescription ?? '',
    shopeeLink: doc.shopeeLink ?? '',
    tiktokLink: doc.tiktokLink ?? '',
    youtubeLink: doc.youtubeLink ?? '',
    subProducts: mapSubProducts(doc),
    isActive: doc.isActive,
    isFeatured: doc.isFeatured,
  };
}
