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
import type { CreateRolePayload, Role } from '@/services/roles';

interface UserOption {
  id: string;
  label: string;
  email: string;
}

interface RoleFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
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

  const handleToggleUser = (userId: string, checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      userIds: checked
        ? Array.from(new Set([...prev.userIds, userId]))
        : prev.userIds.filter((id) => id !== userId),
    }));
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
    setForm((prev) => ({
      ...prev,
      permissions: checked
        ? Array.from(new Set([...prev.permissions, permission]))
        : prev.permissions.filter((item) => item !== permission),
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>{t('fieldName')}</Label>
            <Input
              id='name'
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, code: e.target.value }))
              }
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
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
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
              {submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
