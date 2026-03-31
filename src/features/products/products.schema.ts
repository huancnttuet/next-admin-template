import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

export function createProductFormSchema(
  t: (key: string) => string,
  categoryOptions: string[] = [],
) {
  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'),
          inputProps: { placeholder: t('fieldNamePlaceholder') },
        }),
      ),
    sku: z
      .string({ required_error: t('fieldSkuRequired') })
      .min(1, { message: t('fieldSkuRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldSku'),
          inputProps: { placeholder: t('fieldSkuPlaceholder') },
        }),
      ),
    description: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDescription'),
          fieldType: 'textarea',
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
        }),
      ),
    categories: z
      .array(z.string().min(1))
      .min(1, { message: t('fieldCategoriesRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCategories'),
          fieldType: 'multi-select',
          customData: {
            options: categoryOptions,
            placeholder: t('fieldCategoriesPlaceholder'),
          },
        }),
      ),
    price: z
      .preprocess(
        (value) => {
          if (value === '' || value === undefined || value === null)
            return undefined;
          const parsed = Number(value);
          return Number.isNaN(parsed) ? undefined : parsed;
        },
        z.number({ required_error: t('fieldPriceRequired') }).min(0, {
          message: t('fieldPriceMin'),
        }),
      )
      .superRefine(
        fieldConfig({
          label: t('fieldPrice'),
          inputProps: {
            type: 'number',
            min: 0,
            step: 1,
            placeholder: t('fieldPricePlaceholder'),
          },
        }),
      ),
    originalPrice: z
      .preprocess((value) => {
        if (value === '' || value === undefined || value === null)
          return undefined;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }, z.number().nonnegative().optional())
      .superRefine(
        fieldConfig({
          label: t('fieldOriginalPrice'),
          inputProps: {
            type: 'number',
            min: 0,
            step: 1,
            placeholder: t('fieldOriginalPricePlaceholder'),
          },
        }),
      ),
    quantity: z
      .preprocess((value) => {
        if (value === '' || value === undefined || value === null)
          return undefined;
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }, z.number().int().nonnegative().default(0))
      .superRefine(
        fieldConfig({
          label: t('fieldQuantity'),
          inputProps: {
            type: 'number',
            min: 0,
            step: 1,
            placeholder: t('fieldQuantityPlaceholder'),
          },
        }),
      ),
    imageFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldImagesUpload'),
          description: t('fieldImagesUploadDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*',
            maxSizeMB: 10,
            multiple: true,
            maxFiles: 8,
          },
        }),
      ),
    videoFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldVideosUpload'),
          description: t('fieldVideosUploadDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'video/*',
            maxSizeMB: 100,
            multiple: false,
            maxFiles: 1,
          },
        }),
      ),
    isActive: z
      .boolean()
      .default(true)
      .superRefine(fieldConfig({ label: t('fieldActive') })),
    isFeatured: z
      .boolean()
      .default(false)
      .superRefine(fieldConfig({ label: t('fieldFeatured') })),
  });
}

export type CreateProductFormInput = z.infer<
  ReturnType<typeof createProductFormSchema>
>;
