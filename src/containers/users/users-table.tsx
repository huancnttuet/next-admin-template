'use client';

import { useMemo } from 'react';
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from 'nuqs';
import { useTranslations } from 'next-intl';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedUsers, useSyncUsers } from '@/services/users';
import type { User } from '@/services/users';
import { ARRAY_SEPARATOR } from '@/configs/data-table';
import { getErrorMessage } from '@/lib/apis/api-error';
import { getUserColumns } from './columns';
import { UsersTableActionBar } from './users-table-action-bar';

export function UsersTable() {
  const t = useTranslations('users');
  const columns = useMemo(() => getUserColumns(t), [t]);

  // Read URL state using the same parsers as useDataTable
  // text columns → parseAsString, select/multiSelect columns (has options) → parseAsArrayOf
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [fullNameFilter] = useQueryState(
    'fullName',
    parseAsString.withDefault(''),
  );
  const [isVerifyFilter] = useQueryState(
    'isVerify',
    parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withDefault([]),
  );
  const [isLockFilter] = useQueryState(
    'isLock',
    parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withDefault([]),
  );

  // Map filter values for the API
  // select filter stores array e.g. ['true'] or ['false'] or []
  const isVerify =
    isVerifyFilter[0] === 'true'
      ? true
      : isVerifyFilter[0] === 'false'
        ? false
        : undefined;
  const isLock =
    isLockFilter[0] === 'true'
      ? true
      : isLockFilter[0] === 'false'
        ? false
        : undefined;

  const { data, isLoading, isFetching } = usePagedUsers({
    Page: page,
    PageSize: perPage,
    Keyword: fullNameFilter || undefined,
    IsVerify: isVerify,
    IsLock: isLock,
  });

  const syncMutation = useSyncUsers();

  const { table } = useDataTable<User>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'fullName'] },
    },
    getRowId: (row) => row.id,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={7}
        rowCount={10}
        filterCount={2}
        withPagination
        withViewOptions
      />
    );
  }

  return (
    <DataTable
      table={table}
      actionBar={<UsersTableActionBar table={table} />}
      tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[600px]'
      isFetching={isFetching}
    >
      <DataTableToolbar table={table}>
        <Button
          variant='outline'
          size='sm'
          className='h-8 font-normal'
          disabled={syncMutation.isPending}
          onClick={() =>
            syncMutation.mutate(undefined, {
              onSuccess: () => toast.success(t('syncSuccess')),
              onError: (err) =>
                toast.error(getErrorMessage(err, t('syncError'))),
            })
          }
        >
          <RefreshCw className={syncMutation.isPending ? 'animate-spin' : ''} />
          {syncMutation.isPending ? t('syncing') : t('sync')}
        </Button>
      </DataTableToolbar>
    </DataTable>
  );
}
