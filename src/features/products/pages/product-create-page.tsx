'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AppRoutes } from '@/configs/routes';
import { getErrorMessage } from '@/lib/apis/api-error';
import { useCreateProduct } from '../products.query';
import type { CreateProductPayload } from '../products.type';
import { ProductFormPage } from '../components/product-form-page';

export function ProductCreatePage() {
  const router = useRouter();
  const t = useTranslations('products');
  const createMutation = useCreateProduct();

  const handleSubmit = async (payload: CreateProductPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast.success(t('createSuccess'));
      router.push(AppRoutes.Products);
    } catch (error) {
      toast.error(getErrorMessage(error, t('createError')));
      throw error;
    }
  };

  return (
    <ProductFormPage
      mode='create'
      isPending={createMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => router.push(AppRoutes.Products)}
    />
  );
}
