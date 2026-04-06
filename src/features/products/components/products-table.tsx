'use client';

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import { ARRAY_SEPARATOR } from '@/configs/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedProducts, type Product } from '@/features/products';
import { AppRoutes } from '@/configs/routes';
import { useProductColumns } from './columns';
import { ProductsTableActionBar } from './products-table-action-bar';

export function ProductsTable() {
  const t = useTranslations('products');
  const router = useRouter();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [filterValues] = useQueryStates({
    name: parseAsString,
    isActive: parseAsArrayOf(parseAsString, ARRAY_SEPARATOR),
    categories: parseAsArrayOf(parseAsString, ARRAY_SEPARATOR),
    isFeatured: parseAsArrayOf(parseAsString, ARRAY_SEPARATOR),
  });

  const columns = useProductColumns();

  const statusFilter = filterValues.isActive?.[0];
  const isFeaturedFilter = filterValues.isFeatured?.[0];
  const categoryFilters = filterValues.categories;

  const { data, isLoading, isFetching } = usePagedProducts({
    Page: page,
    PageSize: perPage,
    Keyword: filterValues.name || undefined,
    IsActive:
      statusFilter === undefined
        ? undefined
        : statusFilter === 'true'
          ? true
          : false,
    Categories:
      Array.isArray(categoryFilters) && categoryFilters.length > 0
        ? categoryFilters.join(ARRAY_SEPARATOR)
        : undefined,
    IsFeatured:
      isFeaturedFilter === undefined
        ? undefined
        : isFeaturedFilter === 'true'
          ? true
          : false,
  });

  const { table } = useDataTable<Product>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'name'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <>
      <DataTable
        table={table}
        isLoading={isLoading}
        actionBar={<ProductsTableActionBar table={table} />}
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[960px]'
        isFetching={isFetching}
      >
        <DataTableToolbar table={table}>
          <Button
            size='sm'
            onClick={() => router.push(AppRoutes.ProductCreate)}
          >
            <PlusCircle className='mr-2 size-4' />
            {t('createNew')}
          </Button>
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
