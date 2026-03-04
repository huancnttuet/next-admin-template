import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export const TextareaField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  return (
    <Textarea
      id={id}
      className={error ? 'border-destructive' : ''}
      rows={4}
      {...props}
    />
  );
};
