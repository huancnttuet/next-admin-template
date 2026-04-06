'use client';

import { AutoFormFieldProps } from '@autoform/react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AsyncComboboxOption {
  value: string;
  label: string;
}

/**
 * customData options:
 *  - queryKey   : unknown[]          — TanStack Query key (required)
 *  - queryFn    : () => Promise<AsyncComboboxOption[]> — fetch function (required)
 *  - placeholder: string             — trigger button placeholder text
 *  - searchPlaceholder: string       — CommandInput placeholder text
 *  - emptyText  : string             — text shown when no results match
 */
export interface AsyncComboboxCustomData {
  queryKey: unknown[];
  queryFn: () => Promise<AsyncComboboxOption[]>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AsyncComboboxField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const customData = (field.fieldConfig?.customData ??
    {}) as AsyncComboboxCustomData;
  const placeholder = customData.placeholder ?? 'Select…';
  const searchPlaceholder = customData.searchPlaceholder ?? 'Search…';
  const emptyText = customData.emptyText ?? 'No results found.';

  // Fetch options via TanStack Query — only when popover is open (lazy)
  const {
    data: options = [],
    isFetching,
    isError,
  } = useQuery<AsyncComboboxOption[]>({
    queryKey: customData.queryKey ?? ['async-combobox', id],
    queryFn: customData.queryFn,
    enabled: open, // fetch on first open, then from cache
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  const current = (watch(id) as string) ?? '';
  const selectedLabel = options.find((o) => o.value === current)?.label ?? '';

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
          {selectedLabel || placeholder}
          {isFetching ? (
            <Loader2 className='ml-2 size-4 shrink-0 animate-spin opacity-60' />
          ) : (
            <ChevronsUpDown className='ml-2 size-4 shrink-0 opacity-50' />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            {isFetching && (
              <div className='flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading…
              </div>
            )}
            {!isFetching && isError && (
              <div className='py-6 text-center text-sm text-destructive'>
                Failed to load options.
              </div>
            )}
            {!isFetching && !isError && (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={select}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          current === opt.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
