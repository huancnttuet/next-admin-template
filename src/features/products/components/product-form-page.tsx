'use client';

import { useMemo, useState } from 'react';
import { ZodProvider } from '@autoform/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import { usePagedCategories } from '@/features/categories';
import {
  createProductFormSchema,
  type CreateProductFormInput,
} from '../products.schema';
import type { CreateProductPayload, Product } from '../products.type';

interface ProductFormPageProps {
  mode: 'create' | 'edit';
  product?: Product | null;
  isPending: boolean;
  onSubmit: (payload: CreateProductPayload) => void | Promise<void>;
  onCancel: () => void;
}

function normalizeUrls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );
}

export function ProductFormPage({
  mode,
  product,
  isPending,
  onSubmit,
  onCancel,
}: ProductFormPageProps) {
  const t = useTranslations('products');
  const [isUploading, setIsUploading] = useState(false);
  const { data: categoriesData } = usePagedCategories({
    Page: 1,
    PageSize: 500,
    IsActive: true,
  });
  const categoryOptions = useMemo(
    () => (categoriesData?.items ?? []).map((category) => category.name),
    [categoriesData?.items],
  );
  const schema = useMemo(
    () => new ZodProvider(createProductFormSchema(t, categoryOptions)),
    [categoryOptions, t],
  );
  const isBusy = isPending || isUploading;

  const title = mode === 'create' ? t('createTitle') : t('editTitle');
  const description =
    mode === 'create' ? t('createDescription') : t('editDescription');

  const submitText =
    mode === 'create'
      ? isBusy
        ? t('creating')
        : t('createNew')
      : isBusy
        ? t('saving')
        : t('save');

  const defaultValues = useMemo(
    () => ({
      name: product?.name ?? '',
      sku: product?.sku ?? '',
      description: product?.description ?? '',
      categories: product?.categories ?? [],
      price: product?.price ?? 0,
      originalPrice: product?.originalPrice ?? undefined,
      quantity: product?.quantity ?? 0,
      imageFiles: [] as string[],
      videoFiles: [] as string[],
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
    }),
    [product],
  );

  const handleSubmit = async (values: CreateProductFormInput) => {
    setIsUploading(true);

    try {
      const uploadedImages = normalizeUrls(values.imageFiles);
      const uploadedVideos = normalizeUrls(values.videoFiles);

      const existingImages = product?.images ?? [];
      const existingMainImage = product?.image ?? '';
      const existingVideoUrl = product?.videoUrl ?? '';

      const nextMainImage = uploadedImages[0] ?? existingMainImage;
      const nextGalleryImages =
        uploadedImages.length > 0
          ? [...existingImages, ...uploadedImages.slice(1)]
          : existingImages;
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
        images: nextGalleryImages,
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
    <div className='grid gap-6 lg:grid-cols-[1.15fr_0.85fr]'>
      <div className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>

        {product && (
          <div className='rounded-lg border bg-muted/20 p-4'>
            <h3 className='mb-3 text-sm font-medium'>{t('currentMedia')}</h3>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <p
                  className='text-xs font-medium uppercase
                    text-muted-foreground'
                >
                  {t('fieldImage')}
                </p>
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className='h-36 w-full rounded-md border object-cover'
                  />
                ) : (
                  <div
                    className='flex h-36 items-center justify-center rounded-md
                      border border-dashed text-sm text-muted-foreground'
                  >
                    {t('noMedia')}
                  </div>
                )}
              </div>
              <div className='space-y-2'>
                <p
                  className='text-xs font-medium uppercase
                    text-muted-foreground'
                >
                  {t('fieldVideo')}
                </p>
                {product.videoUrl ? (
                  <video
                    controls
                    className='h-36 w-full rounded-md border object-cover'
                    src={product.videoUrl}
                  />
                ) : (
                  <div
                    className='flex h-36 items-center justify-center rounded-md
                      border border-dashed text-sm text-muted-foreground'
                  >
                    {t('noMedia')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AutoForm
          key={product?.id ?? mode}
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        >
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isBusy}
            >
              {t('cancel')}
            </Button>
            <Button type='submit' disabled={isBusy}>
              {submitText}
            </Button>
          </div>
        </AutoForm>
      </div>
    </div>
  );
}
