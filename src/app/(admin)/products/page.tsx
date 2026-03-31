import { getTranslations } from 'next-intl/server';
import { Main } from '@/components/layout';
import { ProductsTable } from '@/features/products';

export default async function ProductsPage() {
  const t = await getTranslations('products');

  return (
    <Main>
      <div className='mb-4 flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='text-sm text-muted-foreground'>{t('description')}</p>
        </div>
      </div>
      <ProductsTable />
    </Main>
  );
}
