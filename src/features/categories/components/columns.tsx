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
import type { Category } from '../categories.type';

export const getCategoryColumns = (
  t: (key: string) => string,
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
): ColumnDef<Category>[] => [
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
    enableColumnFilter: true,
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>{t('colActions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(category)}>
              <Pencil className='mr-2 h-4 w-4' />
              {t('actionEdit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => onDelete(category)}
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
