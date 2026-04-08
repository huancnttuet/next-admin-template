import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { Product, useBulkDeleteProducts } from '@/features/products';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

type Props = {
  rows: Product[];
};

export function DeleteProductsDialog({ rows }: Props) {
  const t = useTranslations('products');
  const [open, setOpen] = useState(false);
  const deleteMutation = useBulkDeleteProducts();
  const deleteIds = rows.map((row) => row.id);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(deleteIds);
    toast.success(t('deleteSuccess'));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <Trash2 />
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
                  {index + 1}. {row.name}
                  <Badge variant='outline' className='text-xs'>
                    {row.sku}
                  </Badge>
                </li>
              ))}
            </ul>
          </ScrollArea>

          <DialogDescription>
            {t('deleteDescriptionBulk', { count: deleteIds.length })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={deleteMutation.isPending}
          >
            {t('cancel')}
          </Button>
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
