import { z } from 'zod';

export const createCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = createCategorySchema
  .omit({ slug: true })
  .partial();
