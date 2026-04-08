import { z } from 'zod';

const optionalDateStringSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    const raw = String(value).trim();
    return raw.length === 0 ? undefined : raw;
  },
  z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .optional(),
);

const optionalUrlSchema = z
  .string()
  .url('Invalid URL')
  .optional()
  .or(z.literal(''));

export const createReviewSchema = z.object({
  name: z.string().min(1),
  avatar: optionalUrlSchema.default(''),
  title: z.string().optional().default(''),
  content: z.string().min(1),
  productId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  video: optionalUrlSchema.default(''),
  createdAt: optionalDateStringSchema,
  updatedAt: optionalDateStringSchema,
});

export const updateReviewSchema = createReviewSchema.partial();
