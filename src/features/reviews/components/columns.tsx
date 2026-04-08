import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { Review } from '../reviews.type';
import { ReviewFormDialog } from './review-form-dialog';
import { useLocale, useTranslations } from 'next-intl';
import { DeleteReviewDialog } from './delete-review-dialog';
import { formatDate } from '@/lib/format';

export const useReviewColumns = (): ColumnDef<Review>[] => {
  const t = useTranslations('reviews');
  const locale = useLocale();

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
          <div className='font-medium'>{row.original.name}</div>
          {row.original.title ? (
            <div className='text-xs text-muted-foreground'>
              {row.original.title}
            </div>
          ) : null}
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
      id: 'productId',
      accessorKey: 'productId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colProductId')} />
      ),
      cell: ({ row }) => (
        <Badge variant='outline' className='font-mono text-xs'>
          {row.original.productId}
        </Badge>
      ),
      meta: {
        label: t('colProductId'),
      },
      enableSorting: false,
    },
    {
      id: 'rating',
      accessorKey: 'rating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colRating')} />
      ),
      cell: ({ row }) => <span>{row.original.rating}/5</span>,
      meta: {
        label: t('colRating'),
      },
      enableSorting: false,
    },
    {
      id: 'content',
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colContent')} />
      ),
      cell: ({ row }) => (
        <span className='line-clamp-2 max-w-xs text-sm text-muted-foreground'>
          {row.original.content}
        </span>
      ),
      meta: {
        label: t('colContent'),
      },
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCreatedAt')} />
      ),
      cell: ({ row }) => (
        <span className='text-xs text-muted-foreground'>
          {formatDate(row.original.createdAt, locale)}
        </span>
      ),
      meta: {
        label: t('colCreatedAt'),
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='text-muted-foreground'>{t('colActions')}</span>
      ),
      cell: ({ row }) => {
        const review = row.original;
        return (
          <div className='flex gap-1'>
            <ReviewFormDialog mode='edit' review={review} />
            <DeleteReviewDialog row={review} />
          </div>
        );
      },
      size: 120,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
