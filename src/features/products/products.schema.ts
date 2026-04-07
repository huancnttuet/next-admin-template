import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';
import type { Category, GetCategoriesParams } from '@/features/categories';
import { getPagedCategories } from '@/features/categories';
import type { InfiniteComboboxCustomData } from '@/components/autoform/components/InfiniteComboboxField';
import type { PagedList } from '@/types/api';
import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';

function createSubProductSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ message: t('subProductNameRequired') })
      .superRefine(fieldConfig({ label: t('fieldSubProductName') })),
    price: z.coerce
      .number()
      .nonnegative({ message: t('subProductPriceInvalid') })
      .superRefine(fieldConfig({ label: t('fieldSubProductPrice') })),
    originalPrice: z.coerce
      .number()
      .nonnegative({ message: t('subProductOriginalPriceInvalid') })
      .optional()
      .superRefine(fieldConfig({ label: t('fieldSubProductOriginalPrice') })),
    image: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldSubProductImage'),
          description: t('fieldMainImageUploadDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*',
            maxSizeMB: 10,
            multiple: false,
            maxFiles: 1,
          },
        }),
      ),
    quantity: z.coerce
      .number()
      .int()
      .nonnegative({ message: t('subProductQuantityInvalid') })
      .default(0)
      .superRefine(fieldConfig({ label: t('fieldSubProductQuantity') })),
  });
}

export function createProductFormSchema(t: (key: string) => string) {
  const subProductSchema = createSubProductSchema(t);

  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          customData: {
            className: 'col-span-1',
          },
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

    categories: z
      .array(z.string().min(1))
      .min(1, { message: t('fieldCategoriesRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCategories'),
          fieldType: 'infinite-combobox',
          customData: {
            queryKey: ['categories', 'infinite-combobox'],
            queryFn: getPagedCategories,
            staticParams: {
              IsActive: true,
            },
            dataMapper: (category: Category) => ({
              value: category.name,
              label: category.name,
            }),
            pageSize: 10,
            placeholder: t('fieldCategoriesPlaceholder'),
            searchPlaceholder: t('fieldCategoriesSearchPlaceholder'),
            emptyText: t('fieldCategoriesEmpty'),
            loadingText: t('fieldCategoriesLoading'),
          } satisfies InfiniteComboboxCustomData<Category> & {
            queryFn: (
              params: GetCategoriesParams,
            ) => Promise<PagedList<Category>>;
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
    mainImageFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldMainImageUpload'),
          description: t('fieldMainImageUploadDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*',
            maxSizeMB: 10,
            multiple: false,
            maxFiles: 1,
          },
        }),
      ),
    detailImageFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldDetailImagesUpload'),
          description: t('fieldDetailImagesUploadDescription'),
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

    description: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDescription'),
          fieldType: 'rich-text',
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
        }),
      ),
    shortDescription: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          customData: {
            className: 'col-span-3',
          },
          label: t('fieldShortDescription'),
          inputProps: { placeholder: t('fieldShortDescriptionPlaceholder') },
        }),
      ),
    pieces: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldPieces'),
          inputProps: { placeholder: t('fieldPiecesPlaceholder') },
        }),
      ),
    difficulty: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDifficulty'),
          inputProps: { placeholder: t('fieldDifficultyPlaceholder') },
        }),
      ),
    dimensions: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDimensions'),
          inputProps: { placeholder: t('fieldDimensionsPlaceholder') },
        }),
      ),
    shopeeLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldShopeeLink'),
          inputProps: { placeholder: t('fieldShopeeLinkPlaceholder') },
        }),
      ),
    tiktokLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldTiktokLink'),
          inputProps: { placeholder: t('fieldTiktokLinkPlaceholder') },
        }),
      ),
    youtubeLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldYoutubeLink'),
          inputProps: { placeholder: t('fieldYoutubeLinkPlaceholder') },
        }),
      ),
    subProducts: z
      .array(subProductSchema)
      .default([])
      .superRefine(
        fieldConfig({
          label: t('subProductsTitle'),
          fieldType: 'sub-products',
          customData: {
            className: 'col-span-3',
          },
        }),
      ),
    isActive: z
      .boolean()
      .default(true)
      .superRefine(
        fieldConfig({ label: t('fieldActive'), fieldType: 'switch' }),
      ),
    isFeatured: z
      .boolean()
      .default(false)
      .superRefine(
        fieldConfig({ label: t('fieldFeatured'), fieldType: 'switch' }),
      ),
  });
}

export type CreateProductFormInput = z.infer<
  ReturnType<typeof createProductFormSchema>
>;

export const useCreateProductFormSchema = () => {
  const t = useTranslations('products');
  return new ZodProvider(createProductFormSchema(t));
};

export function updateProductFormSchema(t: (key: string) => string) {
  const subProductSchema = createSubProductSchema(t);

  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          customData: {
            className: 'col-span-1',
          },
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
          inputProps: { placeholder: t('fieldSkuPlaceholder'), disabled: true },
        }),
      ),

    categories: z
      .array(z.string().min(1))
      .min(1, { message: t('fieldCategoriesRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCategories'),
          fieldType: 'infinite-combobox',
          customData: {
            queryKey: ['categories', 'infinite-combobox'],
            queryFn: getPagedCategories,
            staticParams: {
              IsActive: true,
            },
            dataMapper: (category: Category) => ({
              value: category.name,
              label: category.name,
            }),
            pageSize: 10,
            placeholder: t('fieldCategoriesPlaceholder'),
            searchPlaceholder: t('fieldCategoriesSearchPlaceholder'),
            emptyText: t('fieldCategoriesEmpty'),
            loadingText: t('fieldCategoriesLoading'),
          } satisfies InfiniteComboboxCustomData<Category> & {
            queryFn: (
              params: GetCategoriesParams,
            ) => Promise<PagedList<Category>>;
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
    mainImageFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldMainImageUpload'),
          description: t('fieldMainImageUploadDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*',
            maxSizeMB: 10,
            multiple: false,
            maxFiles: 1,
          },
        }),
      ),
    detailImageFiles: z
      .array(z.string())
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldDetailImagesUpload'),
          description: t('fieldDetailImagesUploadDescription'),
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

    description: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDescription'),
          fieldType: 'rich-text',
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
        }),
      ),
    shortDescription: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          customData: {
            className: 'col-span-3',
          },
          label: t('fieldShortDescription'),
          inputProps: { placeholder: t('fieldShortDescriptionPlaceholder') },
        }),
      ),
    pieces: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldPieces'),
          inputProps: { placeholder: t('fieldPiecesPlaceholder') },
        }),
      ),
    difficulty: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDifficulty'),
          inputProps: { placeholder: t('fieldDifficultyPlaceholder') },
        }),
      ),
    dimensions: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDimensions'),
          inputProps: { placeholder: t('fieldDimensionsPlaceholder') },
        }),
      ),
    shopeeLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldShopeeLink'),
          inputProps: { placeholder: t('fieldShopeeLinkPlaceholder') },
        }),
      ),
    tiktokLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldTiktokLink'),
          inputProps: { placeholder: t('fieldTiktokLinkPlaceholder') },
        }),
      ),
    youtubeLink: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldYoutubeLink'),
          inputProps: { placeholder: t('fieldYoutubeLinkPlaceholder') },
        }),
      ),
    subProducts: z
      .array(subProductSchema)
      .default([])
      .superRefine(
        fieldConfig({
          label: t('subProductsTitle'),
          fieldType: 'sub-products',
          customData: {
            className: 'col-span-3',
          },
        }),
      ),
    isActive: z
      .boolean()
      .default(true)
      .superRefine(
        fieldConfig({ label: t('fieldActive'), fieldType: 'switch' }),
      ),
    isFeatured: z
      .boolean()
      .default(false)
      .superRefine(
        fieldConfig({ label: t('fieldFeatured'), fieldType: 'switch' }),
      ),
  });
}

export type UpdateProductFormInput = z.infer<
  ReturnType<typeof updateProductFormSchema>
>;

export const useUpdateProductFormSchema = () => {
  const t = useTranslations('products');
  return new ZodProvider(updateProductFormSchema(t));
};
