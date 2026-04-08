import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

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

function withReviewBaseSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'),
          customData: { className: 'col-span-3' },
          inputProps: { placeholder: t('fieldNamePlaceholder') },
        }),
      ),
    productId: z
      .string({ required_error: t('fieldProductIdRequired') })
      .min(1, { message: t('fieldProductIdRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldProductId'),
          customData: { className: 'col-span-3' },
          inputProps: { placeholder: t('fieldProductIdPlaceholder') },
        }),
      ),
    title: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldTitle'),
          customData: { className: 'col-span-3' },
          inputProps: { placeholder: t('fieldTitlePlaceholder') },
        }),
      ),
    rating: z.coerce
      .number({ required_error: t('fieldRatingRequired') })
      .min(1, { message: t('fieldRatingMin') })
      .max(5, { message: t('fieldRatingMax') })
      .superRefine(
        fieldConfig({
          label: t('fieldRating'),
          customData: { className: 'col-span-3' },
          inputProps: { min: 1, max: 5, step: 1 },
        }),
      ),
    content: z
      .string({ required_error: t('fieldContentRequired') })
      .min(1, { message: t('fieldContentRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldContent'),
          fieldType: 'textarea',
          customData: { className: 'col-span-6' },
          inputProps: { placeholder: t('fieldContentPlaceholder') },
        }),
      ),
    avatar: z
      .string()
      .url({ message: t('fieldAvatarInvalid') })
      .optional()
      .or(z.literal(''))
      .superRefine(
        fieldConfig({
          label: t('fieldAvatar'),
          customData: { className: 'col-span-3' },
          inputProps: { placeholder: t('fieldAvatarPlaceholder') },
        }),
      ),
    video: z
      .string()
      .url({ message: t('fieldVideoInvalid') })
      .optional()
      .or(z.literal(''))
      .superRefine(
        fieldConfig({
          label: t('fieldVideo'),
          customData: { className: 'col-span-3' },
          inputProps: { placeholder: t('fieldVideoPlaceholder') },
        }),
      ),
    images: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldImages'),
          fieldType: 'textarea',
          customData: { className: 'col-span-6' },
          inputProps: { placeholder: t('fieldImagesPlaceholder') },
        }),
      ),
    createdAt: optionalDateStringSchema.superRefine(
      fieldConfig({
        label: t('fieldCreatedAt'),
        inputProps: { type: 'datetime-local' },
        customData: { className: 'col-span-3' },
      }),
    ),
    updatedAt: optionalDateStringSchema.superRefine(
      fieldConfig({
        label: t('fieldUpdatedAt'),
        inputProps: { type: 'datetime-local' },
        customData: { className: 'col-span-3' },
      }),
    ),
  });
}

export function createReviewFormSchema(t: (key: string) => string) {
  return withReviewBaseSchema(t);
}

export function editReviewFormSchema(t: (key: string) => string) {
  return withReviewBaseSchema(t);
}

export type CreateReviewFormInput = z.infer<
  ReturnType<typeof createReviewFormSchema>
>;

export type EditReviewFormInput = z.infer<
  ReturnType<typeof editReviewFormSchema>
>;
