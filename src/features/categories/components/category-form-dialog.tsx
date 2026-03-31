'use client';

import { useMemo, useState } from 'react';
import { ZodProvider } from '@autoform/zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import {
  createCategoryFormSchema,
  type CreateCategoryFormInput,
} from '../categories.schema';
import type { Category, CreateCategoryPayload } from '../categories.type';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CategoryFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  category?: Category | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateCategoryPayload) => void | Promise<void>;
}

export function CategoryFormDialog({
  open,
  mode,
  category,
  isPending,
  onOpenChange,
  onSubmit,
}: CategoryFormDialogProps) {
  const t = useTranslations('categories');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = useMemo(
    () => new ZodProvider(createCategoryFormSchema(t, mode === 'edit')),
    [mode, t],
  );
  const isBusy = isPending || isSubmitting;

  const title = mode === 'create' ? t('createTitle') : t('editTitle');
  const description =
    mode === 'create' ? t('createDescription') : t('editDescription');

  const submitText =
    mode === 'create'
      ? isBusy
        ? t('creating')
        : t('createNew')
      : isBusy
        ? t('saving')
        : t('save');

  const defaultValues = useMemo(
    () => ({
      slug: category?.slug ?? '',
      name: category?.name ?? '',
      description: category?.description ?? '',
      isActive: category?.isActive ?? true,
    }),
    [category],
  );

  const handleSubmit = async (values: CreateCategoryFormInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        slug: values.slug.trim().toLowerCase(),
        name: values.name.trim(),
        description: values.description?.trim() ?? '',
        isActive: values.isActive,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('createError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AutoForm
          key={category?.id ?? mode}
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
        >
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              {t('cancel')}
            </Button>
            <Button type='submit' disabled={isBusy}>
              {submitText}
            </Button>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
