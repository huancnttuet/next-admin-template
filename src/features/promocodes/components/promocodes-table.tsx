'use client';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedPromocodes } from '../promocodes.query';
import {
  DISCOUNT_TYPE_VALUES,
  type DiscountType,
  type Promocode,
} from '../promocodes.type';
import { usePromocodeColumns } from './columns';
import { PromocodeFormDialog } from './promocode-form-dialog';
import { PromocodesTableActionBar } from './promocodes-table-action-bar';
import { ImportPromocodesButton } from './import-promocodes-button';

export function PromocodesTable() {
  const columns = usePromocodeColumns();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [keyword] = useQueryState('name', parseAsString.withDefault(''));
  const [isActive] = useQueryState('isActive');
  const [discountType] = useQueryState(
    'discountType',
    parseAsString.withDefault(''),
  );

  const normalizedDiscountType = DISCOUNT_TYPE_VALUES.includes(
    discountType[0] as DiscountType,
  )
    ? (discountType[0] as DiscountType)
    : undefined;

  const { data, isLoading, isFetching } = usePagedPromocodes({
    Page: page,
    PageSize: perPage,
    Keyword: keyword || undefined,
    IsActive:
      isActive === null ? undefined : isActive?.[0] === 'true' ? true : false,
    DiscountType: normalizedDiscountType,
  });

  const { table } = useDataTable<Promocode>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'code', 'name'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <>
      <DataTable
        table={table}
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[980px]'
        actionBar={<PromocodesTableActionBar table={table} />}
        isFetching={isFetching}
        isLoading={isLoading}
      >
        <DataTableToolbar table={table}>
          <PromocodeFormDialog mode='create' />
          <ImportPromocodesButton />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
