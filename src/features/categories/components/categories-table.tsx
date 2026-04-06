'use client';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedCategories } from '../categories.query';
import type { Category } from '../categories.type';
import { useCategoryColumns } from './columns';
import { CategoryFormDialog } from './category-form-dialog';
import { CategoriesTableActionBar } from './categories-table-action-bar';

export function CategoriesTable() {
  const columns = useCategoryColumns();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [keyword] = useQueryState('name', parseAsString.withDefault(''));
  const [isActive] = useQueryState('isActive', parseAsString);

  const { data, isLoading, isFetching } = usePagedCategories({
    Page: page,
    PageSize: perPage,
    Keyword: keyword || undefined,
    IsActive:
      isActive === null ? undefined : isActive === 'true' ? true : false,
  });

  const { table } = useDataTable<Category>({
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
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[860px]'
        actionBar={<CategoriesTableActionBar table={table} />}
        isFetching={isFetching}
        isLoading={isLoading}
      >
        <DataTableToolbar table={table}>
          <CategoryFormDialog mode='create' />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
