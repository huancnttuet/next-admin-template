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
  useCreateCategory,
  useDeleteCategory,
  usePagedCategories,
  useUpdateCategory,
} from '../categories.query';
import type { Category, CreateCategoryPayload } from '../categories.type';
import { getCategoryColumns } from './columns';
import { CategoryFormDialog } from './category-form-dialog';

export function CategoriesTable() {
  const t = useTranslations('categories');
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  const columns = useMemo(
    () =>
      getCategoryColumns(
        t,
        (category) => setEditCategory(category),
        (category) => setDeleteCategory(category),
      ),
    [t],
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [keyword] = useQueryState('keyword', parseAsString.withDefault(''));

  const { data, isLoading, isFetching } = usePagedCategories({
    Page: page,
    PageSize: perPage,
    Keyword: keyword || undefined,
  });

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

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

  const handleCreateSubmit = async (payload: CreateCategoryPayload) => {
    await createMutation.mutateAsync(payload);
    toast.success(t('createSuccess'));
    setCreateOpen(false);
  };

  const handleEditSubmit = async (payload: CreateCategoryPayload) => {
    if (!editCategory) return;
    await updateMutation.mutateAsync({ id: editCategory.id, payload });
    toast.success(t('editSuccess'));
    setEditCategory(null);
  };

  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      await deleteMutation.mutateAsync(deleteCategory.id);
      toast.success(t('deleteSuccess'));
      setDeleteCategory(null);
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
        tableContainerClassName='max-h-[calc(100dvh-20rem)] min-w-[860px]'
        isFetching={isFetching}
      >
        <DataTableToolbar table={table}>
          <Button size='sm' onClick={() => setCreateOpen(true)}>
            <PlusCircle className='mr-2 size-4' />
            {t('createNew')}
          </Button>
        </DataTableToolbar>
      </DataTable>

      <CategoryFormDialog
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

      <CategoryFormDialog
        key={editCategory?.id ?? 'edit-closed'}
        open={editCategory !== null}
        mode='edit'
        category={editCategory}
        isPending={updateMutation.isPending}
        onOpenChange={(open) => {
          if (!open) {
            setEditCategory(null);
            updateMutation.reset();
          }
        }}
        onSubmit={handleEditSubmit}
      />

      <Dialog
        open={deleteCategory !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteCategory(null);
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
              onClick={() => setDeleteCategory(null)}
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
