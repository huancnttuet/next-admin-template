'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreateUserPayload, User } from '@/features/users';

interface UserFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  user?: User | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateUserPayload) => void;
}

interface FormState {
  fullName: string;
  userName: string;
  email: string;
  isVerify: boolean;
  isLock: boolean;
}

function getInitialState(user?: User | null): FormState {
  return {
    fullName: user?.fullName ?? '',
    userName: user?.userName ?? '',
    email: user?.email ?? '',
    isVerify: user?.isVerify ?? false,
    isLock: user?.isLock ?? false,
  };
}

export function UserFormDialog({
  open,
  mode,
  user,
  isPending,
  onOpenChange,
  onSubmit,
}: UserFormDialogProps) {
  const t = useTranslations('users');
  const [form, setForm] = useState<FormState>(getInitialState(user));

  const title = mode === 'create' ? t('createTitle') : t('editTitle');
  const description =
    mode === 'create' ? t('createDescription') : t('editDescription');

  const submitText =
    mode === 'create'
      ? isPending
        ? t('creating')
        : t('createNew')
      : isPending
        ? t('saving')
        : t('save');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      fullName: form.fullName.trim(),
      userName: form.userName.trim(),
      email: form.email.trim(),
      isVerify: form.isVerify,
      isLock: form.isLock,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='fullName'>{t('fieldFullName')}</Label>
            <Input
              id='fullName'
              value={form.fullName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder={t('fieldFullNamePlaceholder')}
              disabled={isPending}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='userName'>{t('fieldUserName')}</Label>
            <Input
              id='userName'
              value={form.userName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, userName: e.target.value }))
              }
              placeholder={t('fieldUserNamePlaceholder')}
              disabled={isPending}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>{t('fieldEmail')}</Label>
            <Input
              id='email'
              type='email'
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder={t('fieldEmailPlaceholder')}
              disabled={isPending}
              required
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <label className='flex items-center gap-2 text-sm'>
              <Checkbox
                checked={form.isVerify}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isVerify: checked === true }))
                }
                disabled={isPending}
              />
              {t('fieldVerified')}
            </label>

            <label className='flex items-center gap-2 text-sm'>
              <Checkbox
                checked={form.isLock}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, isLock: checked === true }))
                }
                disabled={isPending}
              />
              {t('fieldLocked')}
            </label>
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
            <Button type='submit' disabled={isPending}>
              {submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
