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
  CreateReviewFormInput,
  EditReviewFormInput,
  Review,
} from '@/features/reviews';
import {
  createReviewFormSchema,
  editReviewFormSchema,
  useCreateReview,
  useUpdateReview,
} from '@/features/reviews';
import { Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';

interface ReviewFormDialogProps {
  mode: FormMode;
  review?: Review | null;
}

const modeConfig = {
  create: {
    buttonTrigger: 'createNew',
    title: 'createTitle',
    description: 'createDescription',
    idleSubmitText: 'createNew',
    busySubmitText: 'creating',
    buildSchema: createReviewFormSchema,
  },
  edit: {
    buttonTrigger: 'actionEdit',
    title: 'editTitle',
    description: 'editDescription',
    idleSubmitText: 'save',
    busySubmitText: 'saving',
    buildSchema: editReviewFormSchema,
  },
};

function toDateTimeLocalValue(value?: string) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function parseImagesText(value?: string[]) {
  if (!value || value.length === 0) return '';
  return value.join(', ');
}

function normalizeImagesInput(value: string | undefined) {
  if (!value) return [];
  return value
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function ReviewFormDialog({ mode, review }: ReviewFormDialogProps) {
  const t = useTranslations('reviews');
  const currentModeConfig = modeConfig[mode];
  const schema = new ZodProvider(currentModeConfig.buildSchema(t));
  const createMutation = useCreateReview();
  const updateMutation = useUpdateReview();
  const isBusy = createMutation.isPending || updateMutation.isPending;
  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    values: CreateReviewFormInput | EditReviewFormInput,
  ) => {
    try {
      const payload = {
        ...values,
        images: normalizeImagesInput(values.images),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync(payload);
        toast.success(t('createSuccess'));
        setOpen(false);
        return;
      }

      if (mode === 'edit' && review) {
        await updateMutation.mutateAsync({
          id: review.id,
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

      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{t(currentModeConfig.title)}</DialogTitle>
          <DialogDescription>
            {t(currentModeConfig.description)}
          </DialogDescription>
        </DialogHeader>

        <AutoForm
          key={review?.id ?? mode}
          schema={schema}
          formProps={{
            className: 'grid grid-cols-6 gap-4',
          }}
          defaultValues={{
            name: review?.name ?? '',
            avatar: review?.avatar ?? '',
            title: review?.title ?? '',
            content: review?.content ?? '',
            productId: review?.productId ?? '',
            rating: review?.rating ?? 5,
            images: parseImagesText(review?.images),
            video: review?.video ?? '',
            createdAt: toDateTimeLocalValue(review?.createdAt),
            updatedAt: toDateTimeLocalValue(review?.updatedAt),
          }}
          onSubmit={handleSubmit}
        >
          <div className='col-span-full flex justify-end gap-2 pt-2'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isBusy}>
                {t('cancel')}
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isBusy}>
              {isBusy
                ? t(currentModeConfig.busySubmitText)
                : t(currentModeConfig.idleSubmitText)}
            </Button>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
