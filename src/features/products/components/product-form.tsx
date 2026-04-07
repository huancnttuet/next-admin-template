'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from '@/components/autoform';
import { Button } from '@/components/ui/button';
import {
  useCreateProductFormSchema,
  useUpdateProductFormSchema,
  type CreateProductFormInput,
} from '@/features/products';
import type {
  CreateProductPayload,
  Product,
  SubProduct,
} from '@/features/products';
import { FormMode } from '@/types/form';
import Link from 'next/link';
import { AppRoutes } from '@/configs/routes';
import { ChevronLeft } from 'lucide-react';

interface Props {
  mode: FormMode;
  product?: Product;
  isPending: boolean;
  onSubmit: (payload: CreateProductPayload) => void | Promise<void>;
  onCancel: () => void;
}

const modeConfig = {
  create: {
    title: 'createTitle',
    description: 'createDescription',
    idleSubmitText: 'createNew',
    busySubmitText: 'creating',
  },
  edit: {
    title: 'editTitle',
    description: 'editDescription',
    idleSubmitText: 'save',
    busySubmitText: 'saving',
  },
} as const;

function normalizeUrls(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.length > 0 ? [value] : [];
  }

  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );
}

function normalizeSubProducts(value: CreateProductFormInput['subProducts']) {
  return (Array.isArray(value) ? value : [])
    .map(
      (subProduct): SubProduct => ({
        name: subProduct.name.trim(),
        price: subProduct.price,
        originalPrice: subProduct.originalPrice,
        image: (subProduct.image || '').trim(),
        quantity: Math.floor(subProduct.quantity),
      }),
    )
    .filter((subProduct) => subProduct.name.length > 0);
}

export function ProductForm({
  mode,
  product,
  isPending,
  onSubmit,
  onCancel,
}: Props) {
  const t = useTranslations('products');
  const [isUploading, setIsUploading] = useState(false);
  const currentModeConfig = modeConfig[mode];

  const createSchema = useCreateProductFormSchema();
  const updateSchema = useUpdateProductFormSchema();
  const schema = mode === 'create' ? createSchema : updateSchema;
  const isBusy = isPending || isUploading;

  const handleSubmit = async (values: CreateProductFormInput) => {
    setIsUploading(true);

    try {
      const uploadedMainImages = normalizeUrls(values.mainImageFiles);
      const uploadedDetailImages = normalizeUrls(values.detailImageFiles);
      const uploadedVideos = normalizeUrls(values.videoFiles);

      const existingDetailImages = product?.detailImages ?? [];
      const existingMainImage = product?.image ?? '';
      const existingVideoUrl = product?.videoUrl ?? '';

      const nextMainImage = uploadedMainImages[0] ?? existingMainImage;
      const nextDetailImages =
        uploadedDetailImages.length > 0
          ? [...uploadedDetailImages]
          : existingDetailImages;
      const nextVideoUrl = uploadedVideos[0] ?? existingVideoUrl;
      const normalizedSubProducts = normalizeSubProducts(values.subProducts);

      await onSubmit({
        name: values.name.trim(),
        sku: values.sku.trim(),
        description: values.description?.trim() ?? '',
        shortDescription: values.shortDescription?.trim() ?? '',
        pieces: values.pieces?.trim() ?? '',
        difficulty: values.difficulty?.trim() ?? '',
        dimensions: values.dimensions?.trim() ?? '',
        shopeeLink: values.shopeeLink?.trim() ?? '',
        tiktokLink: values.tiktokLink?.trim() ?? '',
        youtubeLink: values.youtubeLink?.trim() ?? '',
        categories: values.categories,
        price: values.price,
        originalPrice:
          typeof values.originalPrice === 'number'
            ? values.originalPrice
            : undefined,
        quantity: values.quantity,
        image: nextMainImage,
        detailImages: nextDetailImages,
        videoUrl: nextVideoUrl || undefined,
        subProducts: normalizedSubProducts,
        isActive: values.isActive,
        isFeatured: values.isFeatured,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='grid gap-6'>
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <Link href={AppRoutes.Products}>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t(currentModeConfig.title)}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t(currentModeConfig.description)}
            </p>
          </div>
        </div>

        <AutoForm
          key={product?.id ?? mode}
          schema={schema}
          defaultValues={{
            ...product,
            shopeeLink: product?.shopeeLink ?? '',
            tiktokLink: product?.tiktokLink ?? '',
            youtubeLink: product?.youtubeLink ?? '',
            mainImageFiles: [...(product?.image ? [product.image] : [])],
            detailImageFiles: [...(product?.detailImages ?? [])],
            videoFiles: [...(product?.videoUrl ? [product.videoUrl] : [])],
          }}
          onSubmit={handleSubmit}
          formProps={{
            className: 'grid gap-4 grid-cols-3',
          }}
        >
          <div className='col-span-full flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isBusy}
            >
              {t('cancel')}
            </Button>
            <Button type='submit' disabled={isBusy}>
              {isBusy
                ? t(currentModeConfig.busySubmitText)
                : t(currentModeConfig.idleSubmitText)}
            </Button>
          </div>
        </AutoForm>
      </div>
    </div>
  );
}
