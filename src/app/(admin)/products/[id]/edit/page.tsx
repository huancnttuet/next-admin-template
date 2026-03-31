import { Main } from '@/components/layout';
import { ProductEditPage } from '@/features/products/pages/product-edit-page';

interface ProductEditRouteProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: ProductEditRouteProps) {
  const { id } = await params;

  return (
    <Main>
      <ProductEditPage id={id} />
    </Main>
  );
}
