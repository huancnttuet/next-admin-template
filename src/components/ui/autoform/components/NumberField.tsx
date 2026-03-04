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
    // Pass the raw string value; z.preprocess in the schema handles coercion
    // and converts empty / NaN to undefined before Zod validates.
    onChange?.(raw);
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
