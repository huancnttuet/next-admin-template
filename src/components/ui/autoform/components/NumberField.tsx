import { Input } from '@/components/ui/input';
import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';

export const NumberField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, onChange, ...props } = inputProps;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Coerce to number so Zod receives the correct type.
    // Pass NaN for empty string — RHF will treat it as an invalid value.
    onChange?.(raw === '' ? undefined : Number(raw));
  };

  return (
    <Input
      id={id}
      type='number'
      className={error ? 'border-destructive' : ''}
      {...props}
      onChange={handleChange}
    />
  );
};
