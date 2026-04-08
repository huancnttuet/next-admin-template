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
import { Review, useDeleteReview } from '@/features/reviews';
import { toast } from 'sonner';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  row: Review;
};

export function DeleteReviewDialog({ row }: Props) {
  const t = useTranslations('reviews');
  const deleteMutation = useDeleteReview();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(row.id);
    toast.success(t('deleteSuccess'));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <Trash2 className='h-4 w-4 text-destructive' />
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('deleteTitle')}</DialogTitle>

          <div className='py-2'>
            {row.name}{' '}
            <Badge variant='outline' className='text-xs'>
              {row.productId}
            </Badge>
          </div>

          <DialogDescription>{t('deleteDescriptionSingle')}</DialogDescription>
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
