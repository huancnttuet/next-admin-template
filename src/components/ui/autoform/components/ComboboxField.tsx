'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ComboboxField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const current = (watch(id) as string) ?? '';
  const options = field.options ?? [];
  const selectedLabel = options.find(([v]) => v === current)?.[1] ?? '';

  const select = (optValue: string) => {
    setValue(id, current === optValue ? '' : optValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setOpen(false);
  };

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
            'w-full justify-between font-normal',
            !current && 'text-muted-foreground',
            error && 'border-destructive',
          )}
        >
          {selectedLabel || 'Search & select…'}
          <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder='Search…' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(([optValue, optLabel]) => (
                <CommandItem key={optValue} value={optValue} onSelect={select}>
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      current === optValue ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {optLabel}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
