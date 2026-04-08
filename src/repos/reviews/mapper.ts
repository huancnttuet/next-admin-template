import type { Review, ReviewDocument } from './types';

export function mapReviewDocument(doc: ReviewDocument): Review {
  if (!doc._id) {
    throw new Error('Invalid review document');
  }

  return {
    id: doc._id.toHexString(),
    name: doc.name,
    avatar: doc.avatar ?? '',
    title: doc.title ?? '',
    content: doc.content,
    productId: doc.productId,
    rating: doc.rating,
    images: doc.images ?? [],
    video: doc.video ?? '',
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
