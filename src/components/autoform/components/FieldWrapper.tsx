import React from 'react';
import { Label } from '@/components/ui/label';
import { FieldWrapperProps } from '@autoform/react';
import { cn } from '@/lib/utils';

const DISABLED_LABELS = [
  'boolean',
  'object',
  'array',
  'switch',
  'radio',
  'multi-checkbox',
];

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  label,
  children,
  id,
  field,
  error,
}) => {
  const isDisabled = DISABLED_LABELS.includes(field.type);
  // customData.className allows schema authors to inject Tailwind classes
  // onto the wrapper div — e.g. "col-span-2" for grid layouts
  const wrapperClass = (
    field.fieldConfig?.customData as Record<string, unknown> | undefined
  )?.className as string | undefined;

  return (
    <div className={cn('space-y-2', wrapperClass)}>
      {!isDisabled && (
        <Label htmlFor={id}>
          {label}
          {field.required && <span className='text-destructive'> *</span>}
        </Label>
      )}
      {children}
      {field.fieldConfig?.description && (
        <p className='text-sm text-muted-foreground'>
          {field.fieldConfig.description}
        </p>
      )}
      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
};
