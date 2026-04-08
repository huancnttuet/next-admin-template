import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { useLocale, useTranslations } from 'next-intl';
import {
  getDiscountTypeOptions,
  type DiscountType,
  type Promocode,
} from '../promocodes.type';
import { PromocodeFormDialog } from './promocode-form-dialog';
import { DeletePromocodeDialog } from './delete-promocode-dialog';
import { formatDate } from '@/lib/format';

export const usePromocodeColumns = (): ColumnDef<Promocode>[] => {
  const locale = useLocale();
  const t = useTranslations('promocodes');
  const discountTypeOptions = getDiscountTypeOptions(t);

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
      id: 'code',
      accessorKey: 'code',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCode')} />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-xs font-semibold'>
          {row.getValue('code')}
        </span>
      ),
      meta: {
        label: t('colCode'),
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
      id: 'discountType',
      accessorKey: 'discountType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colDiscountType')} />
      ),
      cell: ({ row }) => {
        const discountType = row.getValue('discountType') as DiscountType;
        return (
          <Badge variant='outline'>
            {discountType === 'percent'
              ? t('discountTypePercent')
              : t('discountTypeFixed')}
          </Badge>
        );
      },
      meta: {
        label: t('colDiscountType'),
        variant: 'select' as const,
        options: discountTypeOptions,
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'discountValue',
      accessorKey: 'discountValue',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colDiscountValue')} />
      ),
      cell: ({ row }) => {
        const discountValue = Number(row.getValue('discountValue'));
        const discountType = row.original.discountType;

        return (
          <span>
            {discountType === 'percent'
              ? `${discountValue}%`
              : discountValue.toLocaleString('vi-VN')}
          </span>
        );
      },
      meta: {
        label: t('colDiscountValue'),
      },
      enableSorting: false,
    },
    {
      id: 'minSpend',
      accessorKey: 'minSpend',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colMinSpend')} />
      ),
      cell: ({ row }) => {
        const minSpend = Number(row.getValue('minSpend'));
        return <span>{minSpend.toLocaleString('vi-VN')}</span>;
      },
      meta: {
        label: t('colMinSpend'),
      },
      enableSorting: false,
    },
    {
      id: 'maxAmount',
      accessorKey: 'maxAmount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colMaxAmount')} />
      ),
      cell: ({ row }) => {
        const maxAmount = Number(row.getValue('maxAmount'));
        return <span>{maxAmount.toLocaleString('vi-VN')}</span>;
      },
      meta: {
        label: t('colMaxAmount'),
      },
      enableSorting: false,
    },
    {
      id: 'period',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colPeriod')} />
      ),
      cell: ({ row }) => (
        <span className='text-xs text-muted-foreground'>
          {formatDate(row.original.startDate, locale)} -{' '}
          {formatDate(row.original.endDate, locale)}
        </span>
      ),
      meta: {
        label: t('colPeriod'),
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
      id: 'actions',
      header: () => (
        <span className='text-muted-foreground'>{t('colActions')}</span>
      ),
      cell: ({ row }) => {
        const promocode = row.original;
        return (
          <div className='flex gap-1'>
            <PromocodeFormDialog mode='edit' promocode={promocode} />
            <DeletePromocodeDialog row={promocode} />
          </div>
        );
      },
      size: 120,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
