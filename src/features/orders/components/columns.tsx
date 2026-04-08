import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { useLocale, useTranslations } from 'next-intl';
import {
  getOrderStatusOptions,
  type Order,
  type OrderStatus,
} from '../orders.type';
import { OrderFormDialog } from './order-form-dialog';
import { DeleteOrderDialog } from './delete-order-dialog';
import { formatCurrency, formatDate } from '@/lib/format';

function getStatusLabel(t: (key: string) => string, status: OrderStatus) {
  if (status === 'PENDING') return t('statusPending');
  if (status === 'CONFIRMED') return t('statusConfirmed');
  if (status === 'DELIVERING') return t('statusDelivering');
  if (status === 'DELIVERED') return t('statusDelivered');
  return t('statusCancelled');
}

function getCustomerName(row: Order) {
  if (row.customer.trim().length > 0) return row.customer;
  const match = row.address.match(/name=([^,}\]]+)/i);
  return match?.[1]?.trim() || '—';
}

export const useOrderColumns = (): ColumnDef<Order>[] => {
  const locale = useLocale();
  const t = useTranslations('orders');
  const statusOptions = getOrderStatusOptions(t);

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
      id: 'orderId',
      accessorKey: 'orderId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colOrderId')} />
      ),
      cell: ({ row }) => (
        <span className='font-mono text-xs font-semibold'>
          {row.getValue('orderId')}
        </span>
      ),
      meta: {
        label: t('colOrderId'),
        placeholder: t('search'),
        variant: 'text' as const,
      },
      enableColumnFilter: false,
      enableSorting: false,
      size: 150,
    },
    {
      id: 'customer',
      accessorKey: 'customer',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCustomer')} />
      ),
      cell: ({ row }) => <span>{getCustomerName(row.original)}</span>,
      meta: {
        label: t('colCustomer'),
        placeholder: t('search'),
        variant: 'text' as const,
      },
      enableColumnFilter: true,
      enableSorting: false,
      size: 200,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colStatus')} />
      ),
      cell: ({ row }) => {
        const status = row.getValue('status') as OrderStatus;
        const variant =
          status === 'DELIVERED'
            ? 'default'
            : status === 'CANCELLED'
              ? 'destructive'
              : 'secondary';

        return <Badge variant={variant}>{getStatusLabel(t, status)}</Badge>;
      },
      meta: {
        label: t('colStatus'),
        variant: 'select' as const,
        options: statusOptions,
      },
      enableColumnFilter: true,
      enableSorting: false,
    },
    {
      id: 'total',
      accessorKey: 'total',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colTotal')} />
      ),
      cell: ({ row }) => {
        const total = Number(row.getValue('total'));
        return <span className='font-medium'>{formatCurrency(total, locale)}</span>;
      },
      meta: {
        label: t('colTotal'),
      },
      enableSorting: false,
    },
    {
      id: 'shippingCost',
      accessorKey: 'shippingCost',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colShippingCost')} />
      ),
      cell: ({ row }) => {
        const shippingCost = Number(row.getValue('shippingCost'));
        return <span>{formatCurrency(shippingCost)}</span>;
      },
      meta: {
        label: t('colShippingCost'),
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
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colUpdatedAt')} />
      ),
      cell: ({ row }) => (
        <span className='text-xs text-muted-foreground'>
          {formatDate(row.original.updatedAt, locale)}
        </span>
      ),
      meta: {
        label: t('colUpdatedAt'),
      },
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => (
        <span className='text-muted-foreground'>{t('colActions')}</span>
      ),
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className='flex gap-1'>
            <OrderFormDialog mode='edit' order={order} />
            <DeleteOrderDialog row={order} />
          </div>
        );
      },
      size: 120,
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
