import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';
import type { Category, GetCategoriesParams } from '@/features/categories';
import { getPagedCategories } from '@/features/categories';
import type { InfiniteComboboxCustomData } from '@/components/autoform/components/InfiniteComboboxField';
import type { PagedList } from '@/types/api';
import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';

export function createProductFormSchema(t: (key: string) => string) {
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
          fieldType: 'textarea',
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
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
