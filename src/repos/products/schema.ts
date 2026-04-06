import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  description: z.string().optional().default(''),
  categories: z.array(z.string().min(1)).min(1),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional(),
  quantity: z.coerce.number().int().nonnegative().default(0),
  image: z.string().optional().default(''),
  detailImages: z.array(z.string()).optional().default([]),
  videoUrl: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export const updateProductSchema = createProductSchema.partial();
