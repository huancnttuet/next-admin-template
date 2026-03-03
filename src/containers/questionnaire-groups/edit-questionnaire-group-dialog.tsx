'use client';

import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useQuestionnaireGroupDetail,
  useUpdateQuestionnaireGroup,
} from '@/services/questionnaire-groups';
import { editQuestionnaireGroupSchema } from '@/services/questionnaire-groups';
import type { EditQuestionnaireGroupInput } from '@/services/questionnaire-groups';

interface EditQuestionnaireGroupDialogProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditQuestionnaireGroupDialog({
  id,
  open,
  onOpenChange,
}: EditQuestionnaireGroupDialogProps) {
  const t = useTranslations('questionnaireGroups');
  const mutation = useUpdateQuestionnaireGroup();
  const { data: group } = useQuestionnaireGroupDetail(id ?? '');

  const schema = editQuestionnaireGroupSchema(t);
  const schemaProvider = new ZodProvider(schema);

  const handleSubmit = (data: EditQuestionnaireGroupInput) => {
    if (!id) return;
    mutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success(t('editSuccess'));
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) mutation.reset();
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>{t('editDescription')}</DialogDescription>
        </DialogHeader>
        {group && (
          <AutoForm
            schema={schemaProvider}
            onSubmit={handleSubmit}
            defaultValues={{ name: group.name }}
            formProps={{ className: 'space-y-4' }}
          >
            <Button
              type='submit'
              disabled={mutation.isPending}
              className='w-full'
            >
              {mutation.isPending ? t('saving') : t('save')}
            </Button>
          </AutoForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
