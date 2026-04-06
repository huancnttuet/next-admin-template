'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PERMISSION_OPTIONS } from '@/configs/rbac';
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
import { Textarea } from '@/components/ui/textarea';
import type { CreateRolePayload, Role } from '@/features/roles';
import { FormMode } from '@/types/form';

interface UserOption {
  id: string;
  label: string;
  email: string;
}

interface RoleFormDialogProps {
  open: boolean;
  mode: FormMode;
  role?: Role | null;
  userOptions: UserOption[];
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateRolePayload) => void;
}

interface FormState {
  name: string;
  code: string;
  description: string;
  userIds: string[];
  permissions: string[];
}

function getInitialState(role?: Role | null): FormState {
  return {
    name: role?.name ?? '',
    code: role?.code ?? '',
    description: role?.description ?? '',
    userIds: role?.userIds ?? [],
    permissions: role?.permissions ?? [],
  };
}

const modeConfig = {
  create: {
    title: 'createTitle',
    description: 'createDescription',
    idleSubmitText: 'createNew',
    busySubmitText: 'creating',
  },
  edit: {
    title: 'editTitle',
    description: 'editDescription',
    idleSubmitText: 'save',
    busySubmitText: 'saving',
  },
} as const;

export function RoleFormDialog({
  open,
  mode,
  role,
  userOptions,
  isPending,
  onOpenChange,
  onSubmit,
}: RoleFormDialogProps) {
  const t = useTranslations('roles');
  const [form, setForm] = useState<FormState>(getInitialState(role));
  const currentModeConfig = modeConfig[mode];

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setForm(getInitialState(role));
    }
    onOpenChange(nextOpen);
  };

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleListField = (
    field: 'userIds' | 'permissions',
    value: string,
    checked: boolean,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: checked
        ? Array.from(new Set([...prev[field], value]))
        : prev[field].filter((item) => item !== value),
    }));
  };

  const handleToggleUser = (userId: string, checked: boolean) => {
    toggleListField('userIds', userId, checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      userIds: form.userIds,
      permissions: form.permissions,
    });
  };

  const handleTogglePermission = (permission: string, checked: boolean) => {
    toggleListField('permissions', permission, checked);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t(currentModeConfig.title)}</DialogTitle>
          <DialogDescription>
            {t(currentModeConfig.description)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('fieldName')}</Label>
            <Input
              id='name'
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder={t('fieldNamePlaceholder')}
              required
              disabled={isPending}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='code'>{t('fieldCode')}</Label>
            <Input
              id='code'
              value={form.code}
              onChange={(event) => updateField('code', event.target.value)}
              placeholder={t('fieldCodePlaceholder')}
              required
              disabled={isPending}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>{t('fieldDescription')}</Label>
            <Textarea
              id='description'
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              placeholder={t('fieldDescriptionPlaceholder')}
              disabled={isPending}
            />
          </div>

          <div className='space-y-2'>
            <Label>{t('fieldUsers')}</Label>
            <div
              className='max-h-48 space-y-2 overflow-auto rounded-md border p-3'
            >
              {userOptions.length === 0 && (
                <p className='text-sm text-muted-foreground'>
                  {t('noUsersAvailable')}
                </p>
              )}
              {userOptions.map((user) => {
                const checked = form.userIds.includes(user.id);
                return (
                  <label
                    key={user.id}
                    className='flex items-start gap-2 text-sm'
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        handleToggleUser(user.id, value === true)
                      }
                      disabled={isPending}
                    />
                    <span>
                      <span className='block font-medium'>{user.label}</span>
                      <span className='text-xs text-muted-foreground'>
                        {user.email}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{t('fieldPermissions')}</Label>
            <div className='space-y-2 rounded-md border p-3'>
              {PERMISSION_OPTIONS.map((permission) => {
                const checked = form.permissions.includes(permission.value);

                return (
                  <label
                    key={permission.value}
                    className='flex items-start gap-2 text-sm'
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        handleTogglePermission(permission.value, value === true)
                      }
                      disabled={isPending}
                    />
                    <span className='text-sm'>{permission.label}</span>
                  </label>
                );
              })}
            </div>
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
              {isPending
                ? t(currentModeConfig.busySubmitText)
                : t(currentModeConfig.idleSubmitText)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
