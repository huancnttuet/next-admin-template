'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Product } from '@/features/products';

export const getProductColumns = (
  t: (key: string) => string,
  onEdit: (product: Product) => void,
  onDelete: (product: Product) => void,
): ColumnDef<Product>[] => [
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
        <div className='text-xs text-muted-foreground'>{row.original.sku}</div>
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
    },
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
      <span className='text-muted-foreground'>{row.getValue('quantity')}</span>
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>{t('colActions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Pencil className='mr-2 h-4 w-4' />
              {t('actionEdit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => onDelete(product)}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {t('actionDelete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 60,
    enableSorting: false,
    enableHiding: false,
  },
];
