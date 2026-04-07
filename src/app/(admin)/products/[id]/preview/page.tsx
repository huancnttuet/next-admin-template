import { Main } from '@/components/layout';
import { ProductPreviewPage } from '@/features/products/pages/product-preview-page';

interface ProductPreviewRouteProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewProductPage({
  params,
}: ProductPreviewRouteProps) {
  const { id } = await params;

  return (
    <Main>
      <ProductPreviewPage id={id} />
    </Main>
  );
}
