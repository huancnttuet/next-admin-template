import type { Category, CategoryDocument } from './types';

export function mapCategoryDocument(doc: CategoryDocument): Category {
  if (!doc._id) {
    throw new Error('Invalid category document');
  }

  return {
    id: doc._id.toHexString(),
    slug: doc.slug,
    name: doc.name,
    description: doc.description ?? '',
    isActive: doc.isActive,
  };
}
