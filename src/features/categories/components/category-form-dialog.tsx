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
  Category,
  EditCategoryFormInput,
  CreateCategoryFormInput,
} from '@/features/categories';
import {
  useCreateCategory,
  createCategoryFormSchema,
  editCategoryFormSchema,
  useUpdateCategory,
} from '@/features/categories';
import { Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';

interface CategoryFormDialogProps {
  mode: FormMode;
  category?: Category | null;
}

const modeConfig = {
  create: {
    buttonTrigger: 'createNew',
    title: 'createTitle',
    description: 'createDescription',
    idleSubmitText: 'createNew',
    busySubmitText: 'creating',
    buildSchema: createCategoryFormSchema,
  },
  edit: {
    buttonTrigger: 'actionEdit',
    title: 'editTitle',
    description: 'editDescription',
    idleSubmitText: 'save',
    busySubmitText: 'saving',
    buildSchema: editCategoryFormSchema,
  },
};

export function CategoryFormDialog({
  mode,
  category,
}: CategoryFormDialogProps) {
  const t = useTranslations('categories');
  const currentModeConfig = modeConfig[mode];
  const schema = new ZodProvider(currentModeConfig.buildSchema(t));
  const title = currentModeConfig.title;
  const description = currentModeConfig.description;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isBusy = createMutation.isPending || updateMutation.isPending;
  const [open, setOpen] = useState(false);

  const handleSubmit = async (
    values: CreateCategoryFormInput | EditCategoryFormInput,
  ) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(values);
        toast.success(t('createSuccess'));
        setOpen(false);
        return;
      }

      if (mode === 'edit' && category) {
        await updateMutation.mutateAsync({
          id: category.id,
          payload: values,
        });
        toast.success(t('editSuccess'));
        setOpen(false);
        return;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('createError'));
    } finally {
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
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

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t(title)}</DialogTitle>
          <DialogDescription>{t(description)}</DialogDescription>
        </DialogHeader>

        <AutoForm
          key={category?.id ?? mode}
          schema={schema}
          defaultValues={{
            slug: category?.slug ?? '',
            name: category?.name ?? '',
            description: category?.description ?? '',
            isActive: category?.isActive ?? false,
          }}
          onSubmit={handleSubmit}
        >
          <div className='flex justify-end gap-2 pt-2'>
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
