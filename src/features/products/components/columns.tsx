'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Pencil, ScanEye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Product } from '@/features/products';
import { getPagedCategories } from '@/features/categories';
import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/configs/routes';
import { useTranslations } from 'next-intl';
import { DeleteProductDialog } from './delete-product-dialog';

export const useProductColumns = (): ColumnDef<Product>[] => {
  const t = useTranslations('products');
  const router = useRouter();

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('selectRow')}
        />
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'index',
      header: () => <span className='text-muted-foreground'>#</span>,
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return (
          <span className='text-muted-foreground'>
            {pageIndex * pageSize + row.index + 1}
          </span>
        );
      },
      size: 52,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colName')} />
      ),
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.getValue('name')}</div>
          <div className='text-xs text-muted-foreground'>
            {row.original.sku}
          </div>
        </div>
      ),
      meta: {
        label: t('colName'),
        placeholder: t('search'),
        variant: 'text' as const,
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'categories',
      accessorKey: 'categories',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCategories')} />
      ),
      cell: ({ row }) => {
        const categories = (row.getValue('categories') as string[]) ?? [];
        return categories.length > 0 ? (
          <div className='flex flex-wrap gap-1'>
            {categories.slice(0, 3).map((category) => (
              <Badge key={category} variant='secondary'>
                {category}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant='outline'>+{categories.length - 3}</Badge>
            )}
          </div>
        ) : (
          <span className='text-muted-foreground'>—</span>
        );
      },
      meta: {
        label: t('colCategories'),
        variant: 'infiniteCombobox' as const,
        options: [],
        infiniteCombobox: {
          queryKey: ['categories'],
          queryFn: getPagedCategories,
          staticParams: { IsActive: true },
          mapOption: (item) => ({
            label: (item as { name: string }).name,
            value: (item as { name: string }).name,
          }),
          searchPlaceholder: t('fieldCategoriesSearchPlaceholder'),
          emptyText: t('fieldCategoriesEmpty'),
          clearText: t('clearSelection'),
          selectedText: t('selected'),
        },
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colPrice')} />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>
          {Number(row.getValue('price')).toLocaleString('vi-VN')} ₫
        </span>
      ),
      meta: {
        label: t('colPrice'),
      },
      enableSorting: false,
    },
    {
      id: 'quantity',
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colQuantity')} />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('quantity')}
        </span>
      ),
      meta: {
        label: t('colQuantity'),
      },
      enableSorting: false,
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colStatus')} />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? t('active') : t('inactive')}
          </Badge>
        );
      },
      meta: {
        label: t('colStatus'),
        variant: 'select' as const,
        options: [
          { label: t('active'), value: 'true' },
          { label: t('inactive'), value: 'false' },
        ],
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'isFeatured',
      accessorKey: 'isFeatured',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colFeatured')} />
      ),
      cell: ({ row }) => {
        const isFeatured = row.getValue('isFeatured') as boolean;
        return (
          <Badge variant={isFeatured ? 'outline' : 'secondary'}>
            {isFeatured ? t('featured') : t('normal')}
          </Badge>
        );
      },
      meta: {
        label: t('colFeatured'),
        variant: 'select' as const,
        options: [
          { label: t('featured'), value: 'true' },
          { label: t('normal'), value: 'false' },
        ],
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='text-muted-foreground'>{t('colActions')}</span>
      ),
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className='flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push(AppRoutes.ProductPreview(product.id))}
              aria-label={t('actionPreview')}
            >
              <ScanEye className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push(AppRoutes.ProductEdit(product.id))}
            >
              <Pencil className='h-4 w-4' />
            </Button>

            <DeleteProductDialog row={product} />
          </div>
        );
      },
      size: 120,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
