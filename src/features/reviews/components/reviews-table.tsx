'use client';

import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedReviews } from '../reviews.query';
import type { Review } from '../reviews.type';
import { useReviewColumns } from './columns';
import { ReviewFormDialog } from './review-form-dialog';
import { ReviewsTableActionBar } from './reviews-table-action-bar';
import { ImportReviewsButton } from './import-reviews-button';

export function ReviewsTable() {
  const columns = useReviewColumns();
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [keyword] = useQueryState('name', parseAsString.withDefault(''));

  const { data, isLoading, isFetching } = usePagedReviews({
    Page: page,
    PageSize: perPage,
    Keyword: keyword || undefined,
  });

  const { table } = useDataTable<Review>({
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
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[980px]'
        actionBar={<ReviewsTableActionBar table={table} />}
        isFetching={isFetching}
        isLoading={isLoading}
      >
        <DataTableToolbar table={table}>
          <ReviewFormDialog mode='create' />
          <ImportReviewsButton />
        </DataTableToolbar>
      </DataTable>
    </>
  );
}
