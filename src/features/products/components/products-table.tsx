'use client';

import { useMemo, useState } from 'react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  useDeleteProduct,
  usePagedProducts,
  type Product,
} from '@/features/products';
import { AppRoutes } from '@/configs/routes';
import { getProductColumns } from './columns';
import { ProductsTableActionBar } from './products-table-action-bar';

export function ProductsTable() {
  const t = useTranslations('products');
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const router = useRouter();

  const columns = useMemo(
    () =>
      getProductColumns(
        t,
        (product) => router.push(AppRoutes.ProductEdit(product.id)),
        (product) => setDeleteIds([product.id]),
      ),
    [router, t],
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [nameFilter] = useQueryState('name', parseAsString.withDefault(''));

  const { data, isLoading, isFetching } = usePagedProducts({
    Page: page,
    PageSize: perPage,
    Keyword: nameFilter || undefined,
  });

  const deleteMutation = useDeleteProduct();

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

  const isDeleteDialogOpen = deleteIds.length > 0;

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
        columnCount={9}
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
        actionBar={
          <ProductsTableActionBar
            table={table}
            onDeleteSelected={handleOpenDeleteSelected}
            isDeleting={deleteMutation.isPending}
          />
        }
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
