'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export const MultiCheckboxField: React.FC<AutoFormFieldProps> = ({
  field,
  label,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const current: string[] = (watch(id) as string[]) ?? [];
  const options: string[] =
    field.fieldConfig?.customData?.options ??
    field.options?.map(([v]) => v) ??
    [];

  const toggle = (optValue: string) => {
    const next = current.includes(optValue)
      ? current.filter((v) => v !== optValue)
      : [...current, optValue];
    setValue(id, next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className='space-y-2'>
      <Label>
        {label}
        {field.required && <span className='text-destructive'> *</span>}
      </Label>
      <div className='flex flex-wrap gap-4'>
        {options.map((optValue) => {
          const optLabel = optValue.charAt(0).toUpperCase() + optValue.slice(1);
          const cbId = `${id}-${optValue}`;
          return (
            <div key={optValue} className='flex items-center gap-2'>
              <Checkbox
                id={cbId}
                checked={current.includes(optValue)}
                onCheckedChange={() => toggle(optValue)}
                className={error ? 'border-destructive' : ''}
              />
              <Label htmlFor={cbId} className='cursor-pointer font-normal'>
                {optLabel}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
