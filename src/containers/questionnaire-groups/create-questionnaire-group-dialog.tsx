'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateQuestionnaireGroup } from '@/services/questionnaire-groups';
import type { CreateQuestionnaireGroupRequest } from '@/services/questionnaire-groups';
import { getErrorMessage, getFieldErrors } from '@/lib/apis/api-error';

export function CreateQuestionnaireGroupDialog() {
  const t = useTranslations('questionnaireGroups');
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateQuestionnaireGroupRequest>();
  const mutation = useCreateQuestionnaireGroup();

  const onSubmit = (data: CreateQuestionnaireGroupRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('createSuccess'));
        reset();
        setOpen(false);
      },
      onError: (error) => {
        // Map backend validation errors to form fields
        const fieldErrors = getFieldErrors(error);
        let hasFieldErrors = false;

        for (const [field, message] of Object.entries(fieldErrors)) {
          if (field in data) {
            setError(field as keyof CreateQuestionnaireGroupRequest, {
              message,
            });
            hasFieldErrors = true;
          }
        }

        // Show toast for non-field errors or as a general fallback
        if (!hasFieldErrors) {
          toast.error(getErrorMessage(error, t('createError')));
        }
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <PlusCircle className='mr-2 size-4' />
          {t('createNew')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t('createTitle')}</DialogTitle>
            <DialogDescription>{t('createDescription')}</DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Label htmlFor='name' className='mb-2 block'>
              {t('fieldName')}
            </Label>
            <Input
              id='name'
              placeholder={t('fieldNamePlaceholder')}
              {...register('name', { required: true })}
              aria-invalid={!!errors.name}
            />
            {errors.name?.message && (
              <p className='mt-1.5 text-sm text-destructive'>
                {errors.name.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? t('creating') : t('createNew')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
