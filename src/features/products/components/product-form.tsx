'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from '@/components/autoform';
import { Button } from '@/components/ui/button';
import {
  useCreateProductFormSchema,
  type CreateProductFormInput,
} from '@/features/products';
import type { CreateProductPayload, Product } from '@/features/products';
import { FormMode } from '@/types/form';

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

  const schema = useCreateProductFormSchema();
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
          ? [...existingDetailImages, ...uploadedDetailImages]
          : existingDetailImages;
      const nextVideoUrl = uploadedVideos[0] ?? existingVideoUrl;

      await onSubmit({
        name: values.name.trim(),
        sku: values.sku.trim(),
        description: values.description?.trim() ?? '',
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
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t(currentModeConfig.title)}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t(currentModeConfig.description)}
          </p>
        </div>

        <AutoForm
          key={product?.id ?? mode}
          schema={schema}
          defaultValues={{
            ...product,
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
