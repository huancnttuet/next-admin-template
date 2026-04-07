'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  ChevronLeft,
  Fingerprint,
  PackageCheck,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppRoutes } from '@/configs/routes';
import { useProductById } from '@/features/products';
import { cn } from '@/lib/utils';
import MinimalTiptapView from '@/components/minimal-tiptap/custom/minimal-tiptap-view';

interface ProductPreviewPageProps {
  id: string;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') {
    return '—';
  }

  return `${value.toLocaleString('vi-VN')} ₫`;
};

export function ProductPreviewPage({ id }: ProductPreviewPageProps) {
  const t = useTranslations('products');
  const commonT = useTranslations('common');
  const { data: product, isLoading } = useProductById(id);

  const media = useMemo(() => {
    if (!product) {
      return [];
    }

    return [product.image, ...product.detailImages].filter(Boolean);
  }, [product]);

  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    setSelectedImage('');
  }, [id]);

  if (isLoading) {
    return (
      <div className='text-sm text-muted-foreground'>{commonT('loading')}</div>
    );
  }

  if (!product) {
    return (
      <div className='text-sm text-muted-foreground'>
        {commonT('pageNotFound')}
      </div>
    );
  }

  const activeImage = selectedImage || media[0] || '';
  const discountPercent =
    typeof product.originalPrice === 'number' &&
    product.originalPrice > product.price &&
    product.originalPrice > 0
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className='space-y-8'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex gap-2'>
          <Link href={AppRoutes.Products}>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </Link>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('previewTitle')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('previewDescription')}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button asChild>
            <Link href={AppRoutes.ProductEdit(product.id)}>
              {t('actionEdit')}
            </Link>
          </Button>
        </div>
      </div>

      <div className='grid gap-8 xl:grid-cols-[1.05fr_1fr]'>
        <div className='space-y-4'>
          <div
            className='relative aspect-square overflow-hidden rounded-md border
              bg-muted'
          >
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes='(max-width: 1280px) 100vw, 50vw'
                className='object-cover'
                priority
              />
            ) : (
              <div
                className='flex h-full items-center justify-center text-sm
                  text-muted-foreground'
              >
                {t('noMedia')}
              </div>
            )}
          </div>

          {media.length > 1 && (
            <div className='flex gap-2 overflow-x-auto pb-1'>
              {media.map((image, index) => {
                const isSelected = image === activeImage;

                return (
                  <button
                    key={`${image}-${index}`}
                    type='button'
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      `relative h-20 w-20 shrink-0 overflow-hidden rounded-md
                      border`,
                      isSelected && 'ring-2 ring-primary',
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes='80px'
                      className='object-cover'
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className='space-y-5'>
          <div>
            <h2 className='text-3xl font-bold leading-tight'>{product.name}</h2>
            <div
              className='mt-2 flex flex-wrap items-center gap-x-5 gap-y-1
                text-lg'
            >
              <span className='text-muted-foreground'>
                {t('fieldSku')}:{' '}
                <span className='font-semibold text-foreground'>
                  {product.sku}
                </span>
              </span>
              <span className='text-muted-foreground'>
                {t('filterStatus')}:{' '}
                <span className='font-semibold text-foreground'>
                  {product.isActive ? 'Có sẵn' : 'Hết hàng'}
                </span>
              </span>
            </div>
          </div>

          <div
            className='border-l-4 border-red-400 bg-red-50 px-3 py-2 text-sm
              italic text-red-900'
          >
            {product.shortDescription || '—'}
          </div>

          <div className='flex flex-wrap items-end gap-3'>
            <span className='text-4xl font-extrabold'>
              {formatCurrency(product.price)}
            </span>
            {typeof product.originalPrice === 'number' &&
              product.originalPrice > 0 && (
                <span className='text-2xl text-muted-foreground line-through'>
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            {discountPercent > 0 && (
              <Badge
                className='rounded-md bg-red-500 px-3 py-1 text-base
                  font-semibold text-white hover:bg-red-500'
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>

          <div className='grid grid-cols-1 gap-4 text-base sm:grid-cols-3'>
            <div className='flex items-center gap-2'>
              <Box className='h-5 w-5 text-muted-foreground' />
              <span>{product.pieces || '... mảnh'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Star className='h-5 w-5 text-muted-foreground' />
              <span>{product.difficulty || '2/5'}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Ruler className='h-5 w-5 text-muted-foreground' />
              <span>{product.dimensions || '—'}</span>
            </div>
          </div>

          <Button
            className='h-12 w-full bg-slate-900 text-base text-white
              hover:bg-slate-800'
          >
            <ShoppingCart className='mr-2 h-4 w-4' />
            Thêm vào giỏ hàng
          </Button>

          <div className='flex items-center justify-center gap-3'>
            {product.shopeeLink && (
              <Button asChild variant='outline' size='sm'>
                <a href={product.shopeeLink} target='_blank' rel='noreferrer'>
                  Shopee
                </a>
              </Button>
            )}
            {product.tiktokLink && (
              <Button asChild variant='outline' size='sm'>
                <a href={product.tiktokLink} target='_blank' rel='noreferrer'>
                  TikTok
                </a>
              </Button>
            )}
            {product.youtubeLink && (
              <Button asChild variant='outline' size='sm'>
                <a href={product.youtubeLink} target='_blank' rel='noreferrer'>
                  YouTube
                </a>
              </Button>
            )}
          </div>

          <Card className='rounded-xl'>
            <CardContent
              className='grid gap-4 p-5 text-center sm:grid-cols-2
                lg:grid-cols-4'
            >
              <div className='space-y-1'>
                <Truck className='mx-auto h-6 w-6 text-muted-foreground' />
                <p className='text-sm'>Miễn ship đơn từ 1 triệu</p>
              </div>
              <div className='space-y-1'>
                <PackageCheck className='mx-auto h-6 w-6 text-muted-foreground' />
                <p className='text-sm'>100% hàng chính hãng</p>
              </div>
              <div className='space-y-1'>
                <ShieldCheck className='mx-auto h-6 w-6 text-muted-foreground' />
                <p className='text-sm'>Hỗ trợ 24/7 đến khi hoàn thiện</p>
              </div>
              <div className='space-y-1'>
                <Fingerprint className='mx-auto h-6 w-6 text-muted-foreground' />
                <p className='text-sm'>Kiểm tra hàng trước thanh toán</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        className='mx-auto grid max-w-3xl grid-cols-2 overflow-hidden rounded-md
          border bg-muted/40 text-sm font-medium text-muted-foreground
          md:grid-cols-4'
      >
        <button
          type='button'
          className='bg-background px-4 py-2 text-foreground'
        >
          Mô tả sản phẩm
        </button>
        <button type='button' className='px-4 py-2'>
          Chính sách đổi trả
        </button>
        <button type='button' className='px-4 py-2'>
          Điều khoản dịch vụ
        </button>
        <button type='button' className='px-4 py-2'>
          Câu hỏi thường gặp
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('fieldDescription')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MinimalTiptapView content={product.description || '—'} />
        </CardContent>
      </Card>
    </div>
  );
}
