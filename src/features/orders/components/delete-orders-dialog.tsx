'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { Order, useBulkDeleteOrders } from '@/features/orders';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type Props = {
  rows: Order[];
};

export function DeleteOrdersDialog({ rows }: Props) {
  const t = useTranslations('orders');
  const deleteMutation = useBulkDeleteOrders();

  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(rows.map((row) => row.id));
    toast.success(t('deleteSuccess'));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <Trash2 className='h-4 w-4' />
          {`${t('actionDelete')} (${rows.length})`}
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('deleteTitle')}</DialogTitle>

          <ScrollArea className='max-h-48 py-2'>
            <ul className='space-y-1'>
              {rows.map((row, index) => (
                <li key={row.id} className='flex items-center gap-2'>
                  {index + 1}. <Badge variant='outline'>{row.orderId}</Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <DialogDescription>
            {t('deleteDescriptionBulk', { count: rows.length })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={deleteMutation.isPending}>
              {t('cancel')}
            </Button>
          </DialogClose>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? t('deleting') : t('actionDelete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
