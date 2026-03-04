import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';

export const SelectField: React.FC<AutoFormFieldProps> = ({
  field,
  inputProps,
  error,
  id,
  value: fieldValue, // top-level value prop set by AutoForm (from RHF watch)
}) => {
  const { key, value: _value, onChange, ...props } = inputProps;

  // `fieldValue` is the RHF-controlled value (reflects defaultValues + updates).
  // Fall back to the Zod schema .default() for fields that have one.
  const selectValue = (fieldValue as string) ?? field.default ?? '';

  return (
    <Select
      {...props}
      value={selectValue}
      onValueChange={(val) => {
        const syntheticEvent = {
          target: {
            value: val,
            name: field.key,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }}
    >
      <SelectTrigger id={id} className={error ? 'border-destructive' : ''}>
        <SelectValue placeholder='Select an option' />
      </SelectTrigger>
      <SelectContent>
        {(field.options || []).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
