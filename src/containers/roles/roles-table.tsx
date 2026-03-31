'use client';

import { useMemo, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDataTable } from '@/hooks/use-data-table';
import { getErrorMessage } from '@/lib/apis/api-error';
import {
  useCreateRole,
  useDeleteRole,
  usePagedRoles,
  useUpdateRole,
  type CreateRolePayload,
  type Role,
} from '@/services/roles';
import { usePagedUsers } from '@/services/users';
import { getRoleColumns } from './columns';
import { RoleFormDialog } from './role-form-dialog';

export function RolesTable() {
  const t = useTranslations('roles');
  const [createOpen, setCreateOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const columns = useMemo(
    () =>
      getRoleColumns(
        t,
        (role) => setEditRole(role),
        (role) => setDeleteRole(role),
      ),
    [t],
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [nameFilter] = useQueryState('name', parseAsString.withDefault(''));

  const { data, isLoading, isFetching } = usePagedRoles({
    Page: page,
    PageSize: perPage,
    Keyword: nameFilter || undefined,
  });

  const { data: usersData } = usePagedUsers({ Page: 1, PageSize: 200 });

  const userOptions = useMemo(
    () =>
      (usersData?.items ?? []).map((user) => ({
        id: user.id,
        label: user.fullName,
        email: user.email,
      })),
    [usersData?.items],
  );

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const { table } = useDataTable<Role>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'name'] },
    },
    getRowId: (row) => row.id,
  });

  const handleCreateSubmit = (payload: CreateRolePayload) => {
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

  const handleEditSubmit = (payload: CreateRolePayload) => {
    if (!editRole) return;
    updateMutation.mutate(
      { id: editRole.id, payload },
      {
        onSuccess: () => {
          toast.success(t('editSuccess'));
          setEditRole(null);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, t('editError')));
        },
      },
    );
  };

  const handleDelete = async () => {
    if (!deleteRole) return;

    try {
      await deleteMutation.mutateAsync(deleteRole.id);
      toast.success(t('deleteSuccess'));
      setDeleteRole(null);
    } catch (error) {
      toast.error(getErrorMessage(error, t('deleteError')));
    }
  };

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={6}
        rowCount={10}
        filterCount={1}
        withPagination
        withViewOptions
      />
    );
  }

  return (
    <>
      <DataTable
        table={table}
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[600px]'
        isFetching={isFetching}
      >
        <DataTableToolbar table={table}>
          <Button size='sm' onClick={() => setCreateOpen(true)}>
            <PlusCircle className='mr-2 size-4' />
            {t('createNew')}
          </Button>
        </DataTableToolbar>
      </DataTable>

      <RoleFormDialog
        key={createOpen ? 'create-open' : 'create-closed'}
        open={createOpen}
        mode='create'
        userOptions={userOptions}
        isPending={createMutation.isPending}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) createMutation.reset();
        }}
        onSubmit={handleCreateSubmit}
      />

      <RoleFormDialog
        key={editRole?.id ?? 'edit-closed'}
        open={editRole !== null}
        mode='edit'
        role={editRole}
        userOptions={userOptions}
        isPending={updateMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditRole(null);
            updateMutation.reset();
          }
        }}
        onSubmit={handleEditSubmit}
      />

      <Dialog
        open={deleteRole !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteRole(null);
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('deleteDescriptionSingle')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDeleteRole(null)}
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
