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
import type { User } from '@/services/users';

export const getUserColumns = (
  t: (key: string) => string,
): ColumnDef<User>[] => [
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
    id: 'fullName',
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colFullName')} />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('fullName')}</span>
    ),
    meta: {
      label: t('colFullName'),
      placeholder: t('search'),
      variant: 'text' as const,
    },
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    id: 'userName',
    accessorKey: 'userName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colUserName')} />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.getValue('userName')}</span>
    ),
    meta: {
      label: t('colUserName'),
    },
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colEmail')} />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>{row.getValue('email')}</span>
    ),
    meta: {
      label: t('colEmail'),
    },
    enableSorting: false,
  },
  {
    id: 'isVerify',
    accessorKey: 'isVerify',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colVerified')} />
    ),
    cell: ({ row }) => {
      const isVerify = row.getValue('isVerify') as boolean;
      return (
        <Badge variant={isVerify ? 'default' : 'secondary'}>
          {isVerify ? t('verified') : t('unverified')}
        </Badge>
      );
    },
    meta: {
      label: t('colVerified'),
      variant: 'select' as const,
      options: [
        { label: t('verified'), value: 'true' },
        { label: t('unverified'), value: 'false' },
      ],
    },
    enableColumnFilter: true,
    enableSorting: false,
  },
  {
    id: 'isLock',
    accessorKey: 'isLock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colStatus')} />
    ),
    cell: ({ row }) => {
      const isLock = row.getValue('isLock') as boolean;
      return (
        <Badge variant={isLock ? 'destructive' : 'outline'}>
          {isLock ? t('locked') : t('active')}
        </Badge>
      );
    },
    meta: {
      label: t('colStatus'),
      variant: 'select' as const,
      options: [
        { label: t('active'), value: 'false' },
        { label: t('locked'), value: 'true' },
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
      const user = row.original;
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>{t('colActions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => console.log('edit', user.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              {t('actionEdit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => console.log('delete', user.id)}
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
