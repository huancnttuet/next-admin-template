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
import { useDeleteProduct, Product } from '@/features/products';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  row: Product;
};

export function DeleteProductDialog({ row }: Props) {
  const t = useTranslations('products');
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(row.id);
    toast.success(t('deleteSuccess'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={deleteMutation.isPending}
          onClick={() => setOpen(true)}
        >
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('deleteTitle')}</DialogTitle>

          <div className='flex gap-4 py-2'>
            <p className=''>{row.name}</p>
            <Badge variant={'outline'}>{row.sku}</Badge>
          </div>

          <DialogDescription>{t('deleteDescriptionSingle')}</DialogDescription>
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
