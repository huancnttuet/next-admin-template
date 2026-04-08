'use client';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedOrders } from '../orders.query';
import type { Order } from '../orders.type';
import { useOrderColumns } from './columns';
import { OrderFormDialog } from './order-form-dialog';
import { OrdersTableActionBar } from './orders-table-action-bar';
import { ImportOrdersButton } from './import-orders-button';

export function OrdersTable() {
  const columns = useOrderColumns();

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [keyword] = useQueryState('name', parseAsString.withDefault(''));
  const [status] = useQueryState('status', parseAsString);

  const { data, isLoading, isFetching } = usePagedOrders({
    Page: page,
    PageSize: perPage,
    Keyword: keyword || undefined,
    Status: status ? (status[0] as Order['status']) : undefined,
  });

  const { table } = useDataTable<Order>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'orderId'] },
    },
    getRowId: (row) => row.id,
  });

  return (
    <>
      <DataTable
        table={table}
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[1100px]'
        actionBar={<OrdersTableActionBar table={table} />}
        isFetching={isFetching}
        isLoading={isLoading}
      >
        <DataTableToolbar table={table}>
          <OrderFormDialog mode='create' />
          <ImportOrdersButton />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
