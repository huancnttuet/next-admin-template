'use client';

import { ZodProvider } from '@autoform/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from '@/components/autoform';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FormMode } from '@/types/form';
import type {
  CreateOrderFormInput,
  EditOrderFormInput,
  Order,
} from '@/features/orders';
import {
  createOrderFormSchema,
  editOrderFormSchema,
  useCreateOrder,
  useUpdateOrder,
} from '@/features/orders';
import { Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderFormDialogProps {
  mode: FormMode;
  order?: Order | null;
}

const modeConfig = {
  create: {
    buttonTrigger: 'createNew',
    title: 'createTitle',
    description: 'createDescription',
    idleSubmitText: 'createNew',
    busySubmitText: 'creating',
    buildSchema: createOrderFormSchema,
  },
  edit: {
    buttonTrigger: 'actionEdit',
    title: 'editTitle',
    description: 'editDescription',
    idleSubmitText: 'save',
    busySubmitText: 'saving',
    buildSchema: editOrderFormSchema,
  },
};

export function OrderFormDialog({ mode, order }: OrderFormDialogProps) {
  const t = useTranslations('orders');
  const currentModeConfig = modeConfig[mode];
  const schema = new ZodProvider(currentModeConfig.buildSchema(t));
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const isBusy = createMutation.isPending || updateMutation.isPending;
  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    values: CreateOrderFormInput | EditOrderFormInput,
  ) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(values);
        toast.success(t('createSuccess'));
        setOpen(false);
        return;
      }

      if (mode === 'edit' && order) {
        const { orderId: _orderId, ...payload } = values;
        await updateMutation.mutateAsync({
          id: order.id,
          payload,
        });
        toast.success(t('editSuccess'));
        setOpen(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('createError'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
      <DialogTrigger asChild>
        <div>
          {mode === 'create' && (
            <Button size='sm'>
              <PlusCircle className='mr-2 size-4' />
              {t(currentModeConfig.buttonTrigger)}
            </Button>
          )}

          {mode === 'edit' && (
            <Button variant='ghost' size='icon'>
              <Pencil className='h-4 w-4' />
            </Button>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className='max-w-7xl'>
        <DialogHeader>
          <DialogTitle>{t(currentModeConfig.title)}</DialogTitle>
          <DialogDescription>
            {t(currentModeConfig.description)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[calc(80dvh)]'>
          <AutoForm
            key={order?.id ?? mode}
            schema={schema}
            formProps={{
              className: 'grid grid-cols-6 gap-4 px-3',
              id: 'order-form',
            }}
            defaultValues={{
              orderId: order?.orderId ?? '',
              customer: order?.customer ?? '',
              address: order?.address ?? '',
              note: order?.note ?? '',
              orderItems: order?.orderItems ?? [],
              discount: order?.discount ?? 0,
              shippingCost: order?.shippingCost ?? 0,
              total: order?.total ?? 0,
              status: order?.status ?? 'PENDING',
              isReviewed: order?.isReviewed ?? false,
            }}
            onSubmit={handleSubmit}
          >
            <div />
          </AutoForm>
        </ScrollArea>

        <div className='col-span-full flex justify-end gap-2 pt-2'>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isBusy}>
              {t('cancel')}
            </Button>
          </DialogClose>
          <Button type='submit' disabled={isBusy} form='order-form'>
            {isBusy
              ? t(currentModeConfig.busySubmitText)
              : t(currentModeConfig.idleSubmitText)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
