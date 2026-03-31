'use client';

import { useMemo, useState } from 'react';
import {
  useQueryState,
  parseAsInteger,
  parseAsString,
  parseAsArrayOf,
} from 'nuqs';
import { useTranslations } from 'next-intl';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDataTable } from '@/hooks/use-data-table';
import {
  useCreateUser,
  useDeleteUser,
  usePagedUsers,
  useSyncUsers,
  useUpdateUser,
} from '@/services/users';
import type { CreateUserPayload } from '@/services/users';
import type { User } from '@/services/users';
import { ARRAY_SEPARATOR } from '@/configs/data-table';
import { getErrorMessage } from '@/lib/apis/api-error';
import { getUserColumns } from './columns';
import { UserFormDialog } from './user-form-dialog';
import { UsersTableActionBar } from './users-table-action-bar';

export function UsersTable() {
  const t = useTranslations('users');
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const columns = useMemo(
    () =>
      getUserColumns(
        t,
        (user) => setEditUser(user),
        (user) => setDeleteIds([user.id]),
      ),
    [t],
  );

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
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

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

  const isDeleteDialogOpen = deleteIds.length > 0;

  const handleCreateSubmit = (payload: CreateUserPayload) => {
    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('createSuccess'));
        setCreateOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, t('createError')));
      },
    });
  };

  const handleEditSubmit = (payload: CreateUserPayload) => {
    if (!editUser) return;
    updateMutation.mutate(
      { id: editUser.id, payload },
      {
        onSuccess: () => {
          toast.success(t('editSuccess'));
          setEditUser(null);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, t('editError')));
        },
      },
    );
  };

  const handleOpenDeleteSelected = () => {
    const selectedIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);
    if (selectedIds.length === 0) return;
    setDeleteIds(selectedIds);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(deleteIds.map((id) => deleteMutation.mutateAsync(id)));
      toast.success(t('deleteSuccess'));
      setDeleteIds([]);
      table.toggleAllRowsSelected(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t('deleteError')));
    }
  };

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
    <>
      <DataTable
        table={table}
        actionBar={
          <UsersTableActionBar
            table={table}
            onDeleteSelected={handleOpenDeleteSelected}
            isDeleting={deleteMutation.isPending}
          />
        }
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[600px]'
        isFetching={isFetching}
      >
        <DataTableToolbar table={table}>
          <Button size='sm' onClick={() => setCreateOpen(true)}>
            <PlusCircle className='mr-2 size-4' />
            {t('createNew')}
          </Button>
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
            <RefreshCw
              className={syncMutation.isPending ? 'animate-spin' : ''}
            />
            {syncMutation.isPending ? t('syncing') : t('sync')}
          </Button>
        </DataTableToolbar>
      </DataTable>

      <UserFormDialog
        key={createOpen ? 'create-open' : 'create-closed'}
        open={createOpen}
        mode='create'
        isPending={createMutation.isPending}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) createMutation.reset();
        }}
        onSubmit={handleCreateSubmit}
      />

      <UserFormDialog
        key={editUser?.id ?? 'edit-closed'}
        open={editUser !== null}
        mode='edit'
        user={editUser}
        isPending={updateMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditUser(null);
            updateMutation.reset();
          }
        }}
        onSubmit={handleEditSubmit}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteIds([]);
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>
              {deleteIds.length > 1
                ? t('deleteDescriptionBulk', { count: deleteIds.length })
                : t('deleteDescriptionSingle')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteIds([])}
              disabled={deleteMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t('deleting') : t('actionDelete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
