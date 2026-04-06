'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AppRoutes } from '@/configs/routes';
import { getErrorMessage } from '@/lib/apis/api-error';
import type { CreateProductPayload } from '@/features/products';
import {
  ProductForm,
  useProductById,
  useUpdateProduct,
} from '@/features/products';

interface ProductEditPageProps {
  id: string;
}

export function ProductEditPage({ id }: ProductEditPageProps) {
  const router = useRouter();
  const t = useTranslations('products');
  const { data: product, isLoading } = useProductById(id);
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (payload: CreateProductPayload) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      toast.success(t('editSuccess'));
      router.push(AppRoutes.Products);
    } catch (error) {
      toast.error(getErrorMessage(error, t('editError')));
      throw error;
    }
  };

  if (isLoading) {
    return <div className='text-sm text-muted-foreground'>Loading...</div>;
  }

  if (!product) {
    return (
      <div className='text-sm text-muted-foreground'>Product not found.</div>
    );
  }

  return (
    <ProductForm
      mode='edit'
      product={product}
      isPending={updateMutation.isPending}
      onSubmit={handleSubmit}
      onCancel={() => router.push(AppRoutes.Products)}
    />
  );
}
