'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MultiSelectField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const current: string[] = (watch(id) as string[]) ?? [];
  const rawOptions: string[] =
    field.fieldConfig?.customData?.options ??
    field.options?.map(([v]) => v) ??
    [];
  const options = rawOptions.map((v) => ({
    value: v,
    label: v.charAt(0).toUpperCase() + v.slice(1),
  }));

  const toggle = (optValue: string) => {
    const next = current.includes(optValue)
      ? current.filter((v) => v !== optValue)
      : [...current, optValue];
    setValue(id, next, { shouldValidate: true, shouldDirty: true });
  };

  const remove = (optValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(
      id,
      current.filter((v) => v !== optValue),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const selectedLabels = options.filter(({ value: v }) => current.includes(v));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'h-auto min-h-9 w-full justify-between px-3 py-1.5 font-normal',
            error && 'border-destructive',
          )}
        >
          <div className='flex flex-wrap gap-1'>
            {selectedLabels.length === 0 ? (
              <span className='text-muted-foreground'>Select options…</span>
            ) : (
              selectedLabels.map(({ value: v, label: l }) => (
                <Badge key={v} variant='secondary' className='gap-1 pr-1'>
                  {l}
                  <span
                    role='button'
                    tabIndex={0}
                    onClick={(e) => remove(v, e)}
                    onKeyDown={(e) => e.key === 'Enter' && remove(v, e as any)}
                    className='cursor-pointer rounded-sm opacity-70 hover:opacity-100'
                  >
                    <X className='size-3' />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-2'
        align='start'
      >
        <div className='space-y-1'>
          {options.map(({ value: optValue, label: optLabel }) => {
            const cbId = `${id}-ms-${optValue}`;
            return (
              <label
                key={optValue}
                htmlFor={cbId}
                className='flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
              >
                <Checkbox
                  id={cbId}
                  checked={current.includes(optValue)}
                  onCheckedChange={() => toggle(optValue)}
                />
                <span className='w-full font-normal'>{optLabel}</span>
              </label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
