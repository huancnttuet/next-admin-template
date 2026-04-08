import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RecentOrder } from '@/features/dashboard';
import { formatCurrency } from '@/lib/format';

export function RecentSales({ sales = [] }: { sales?: RecentOrder[] }) {
  if (sales.length === 0) {
    return (
      <div
        className='flex items-center justify-center p-4 text-sm
          text-muted-foreground'
      >
        No recent sales found.
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {sales.map((sale) => (
        <div key={sale.id} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback>
              {sale.customer.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{sale.customer}</p>
            <p className='text-sm text-muted-foreground'>
              {sale.customerName}
            </p>
          </div>
          <div className='ml-auto font-medium'>
            +{formatCurrency(sale.total)}
          </div>
        </div>
      ))}
    </div>
  );
}
