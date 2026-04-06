import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Category } from '../categories.type';
import { CategoryFormDialog } from './category-form-dialog';
import { useTranslations } from 'next-intl';
import { DeleteCategoryDialog } from './delete-category-dialog';

export const useCategoryColumns = (): ColumnDef<Category>[] => {
  const t = useTranslations('categories');

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
      id: 'slug',
      accessorKey: 'slug',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colSlug')} />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-xs text-muted-foreground'>
          {row.getValue('slug')}
        </span>
      ),
      meta: {
        label: t('colSlug'),
        placeholder: t('search'),
        variant: 'text' as const,
      },
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colName')} />
      ),
      cell: ({ row }) => (
        <span className='font-medium'>{row.getValue('name')}</span>
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
      id: 'description',
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colDescription')} />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground'>
          {row.getValue('description')}
        </span>
      ),
      meta: { label: t('colDescription') },
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
      id: 'actions',
      header: () => (
        <span className='text-muted-foreground'>{t('colActions')}</span>
      ),
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className='flex gap-1'>
            <CategoryFormDialog mode='edit' category={category} />

            <DeleteCategoryDialog row={category} />
          </div>
        );
      },
      size: 60,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
