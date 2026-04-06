'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const SwitchField: React.FC<AutoFormFieldProps> = ({
  field,
  label,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const checked = Boolean(watch(id));

  return (
    <div className='flex items-center gap-3'>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(val) =>
          setValue(id, val, { shouldValidate: true, shouldDirty: true })
        }
      />
      <Label htmlFor={id}>
        {label}
        {field.required && <span className='text-destructive'> *</span>}
      </Label>
    </div>
  );
};
