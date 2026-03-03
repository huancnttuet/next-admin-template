'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
import type { QuestionnaireGroup } from '@/services/questionnaire-groups';

export const getQuestionnaireGroupColumns = (
  t: (key: string) => string,
  onView?: (id: string) => void,
): ColumnDef<QuestionnaireGroup>[] => [
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
      <button
        type='button'
        className='font-medium hover:underline focus-visible:underline focus-visible:outline-none'
        onClick={() => onView?.(row.original.id)}
      >
        {row.getValue('name')}
      </button>
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
    id: 'code',
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} label={t('colCode')} />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>{row.getValue('code')}</span>
    ),
    meta: {
      label: t('colCode'),
    },
    enableSorting: false,
  },
  {
    id: 'questionnaireCount',
    accessorKey: 'questionnaireCount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        label={t('colQuestionnaireCount')}
      />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground'>
        {row.getValue('questionnaireCount')}
      </span>
    ),
    meta: {
      label: t('colQuestionnaireCount'),
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: () => (
      <span className='text-muted-foreground'>{t('colActions')}</span>
    ),
    cell: ({ row }) => {
      const group = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <MoreHorizontal className='h-4 w-4' />
              <span className='sr-only'>{t('colActions')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onView?.(group.id)}>
              <Eye className='mr-2 h-4 w-4' />
              {t('actionView')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log('edit', group.id)}>
              <Pencil className='mr-2 h-4 w-4' />
              {t('actionEdit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={() => console.log('delete', group.id)}
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
