'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const RadioGroupField: React.FC<AutoFormFieldProps> = ({
  field,
  label,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const currentValue = (watch(id) as string) ?? '';

  const select = (optValue: string) =>
    setValue(id, optValue, { shouldValidate: true, shouldDirty: true });

  return (
    <div className='space-y-2'>
      <Label>
        {label}
        {field.required && <span className='text-destructive'> *</span>}
      </Label>
      <div className='flex flex-wrap gap-4' role='radiogroup'>
        {(field.options ?? []).map(([optValue, optLabel]) => {
          const radioId = `${id}-${optValue}`;
          const isChecked = currentValue === optValue;
          return (
            <div key={optValue} className='flex items-center gap-2'>
              <button
                type='button'
                role='radio'
                aria-checked={isChecked}
                id={radioId}
                onClick={() => select(optValue)}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    select(optValue);
                  }
                }}
                className={cn(
                  'size-4 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isChecked
                    ? 'border-primary bg-primary'
                    : 'border-input bg-background',
                  error && 'border-destructive',
                )}
              />
              <Label htmlFor={radioId} className='cursor-pointer font-normal'>
                {optLabel}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
