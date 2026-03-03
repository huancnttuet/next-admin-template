'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateQuestionnaireGroup } from '@/services/questionnaire-groups';
import { createQuestionnaireGroupSchema } from '@/services/questionnaire-groups';
import type { CreateQuestionnaireGroupInput } from '@/services/questionnaire-groups';

export function CreateQuestionnaireGroupDialog() {
  const t = useTranslations('questionnaireGroups');
  const [open, setOpen] = useState(false);
  const mutation = useCreateQuestionnaireGroup();

  const schema = createQuestionnaireGroupSchema(t);
  const schemaProvider = new ZodProvider(schema);

  const handleSubmit = (data: CreateQuestionnaireGroupInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('createSuccess'));
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) mutation.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <PlusCircle className='mr-2 size-4' />
          {t('createNew')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('createTitle')}</DialogTitle>
          <DialogDescription>{t('createDescription')}</DialogDescription>
        </DialogHeader>
        <AutoForm
          schema={schemaProvider}
          onSubmit={handleSubmit}
          formProps={{ className: 'space-y-4' }}
        >
          <div className='flex justify-end'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? t('creating') : t('createNew')}
            </Button>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
