'use client';

import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import type * as React from 'react';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getColumnPinningStyle } from '@/lib/data-table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  tableContainerClassName?: string;
  isFetching?: boolean;
  isLoading?: boolean;
  rowCount?: number;
  hidePagination?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData>({
  table,
  actionBar,
  children,
  className,
  tableContainerClassName,
  isFetching,
  isLoading,
  rowCount = 10,
  hidePagination,
  onRowClick,
  ...props
}: DataTableProps<TData>) {
  const t = useTranslations('dataTable');

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2.5',
        isFetching ? 'pointer-events-none opacity-60 transition-opacity' : '',
        className,
      )}
      {...props}
    >
      {children}
      <div
        className={cn(
          `scrollbar-thin max-h-[calc(100dvh-20rem)] overflow-auto rounded-md
          border`,
          tableContainerClassName,
        )}
      >
        <Table wrapperClassName='overflow-visible' className='table-fixed'>
          <TableHeader
            className='sticky top-0 z-[9] bg-muted after:absolute
              after:inset-x-0 after:bottom-0 after:border-b after:content-[""]'
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({
                        column: header.column,
                        withBorder: true,
                      }),
                      zIndex: header.column.getIsPinned() ? 20 : undefined,
                      background: 'hsl(var(--muted))',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className='hover:bg-transparent'>
                  {table.getVisibleLeafColumns().map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className='h-6 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    onRowClick
                      ? 'cursor-pointer transition-colors hover:bg-muted/50'
                      : '',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({
                          column: cell.column,
                          withBorder: true,
                        }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className='h-24 text-center'
                >
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-2.5'>
        {!hidePagination && <DataTablePagination table={table} />}
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
