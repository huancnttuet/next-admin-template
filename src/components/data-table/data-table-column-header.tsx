'use client';

import type { Column } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  const t = useTranslations('dataTable');

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{label}</div>;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className={cn(
          `-ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5
          hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring
          data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0
          [&_svg]:text-muted-foreground`,
          className,
        )}
        {...props}
      >
        {label}
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className=''>
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className='relative pl-2 pr-8 [&>span:first-child]:left-auto
                [&>span:first-child]:right-2 [&_svg]:text-muted-foreground'
              checked={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              <span className='ml-2 mt-1'>{t('asc')}</span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className='relative pl-2 pr-8 [&>span:first-child]:left-auto
                [&>span:first-child]:right-2 [&_svg]:text-muted-foreground'
              checked={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              <span className='ml-2 mt-1'>{t('desc')}</span>
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className='pl-2 [&_svg]:text-muted-foreground'
                onClick={() => column.clearSorting()}
              >
                <X size={24} />
                <span className='ml-2 mt-1'>{t('reset')}</span>
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className='relative pl-2 pr-8 [&>span:first-child]:left-auto
              [&>span:first-child]:right-2 [&_svg]:text-muted-foreground'
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff size={20} />
            <span className='ml-3 mt-1'> {t('hide')}</span>
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
