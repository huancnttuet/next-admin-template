'use client';

import { AutoFormFieldProps } from '@autoform/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronsUpDown, X } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from '@/hooks/use-debounce';
import type { PagedList } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TextEllipsis } from '@/components/ui/text-ellipsis';

export interface InfiniteComboboxOption {
  value: string;
  label: string;
}

export interface InfiniteComboboxQueryParams {
  Page: number;
  PageSize: number;
  Keyword?: string;
}

export interface InfiniteComboboxCustomData<TItem = InfiniteComboboxOption> {
  queryKey: unknown[];
  queryFn: (params: InfiniteComboboxQueryParams) => Promise<PagedList<TItem>>;
  dataMapper?: (item: TItem) => InfiniteComboboxOption;
  staticParams?: Record<string, unknown>;
  selectionMode?: 'single' | 'multiple';
  disabled?: boolean;
  onValueChange?: (value: string | string[]) => void;
  onItemSelect?: (item: TItem | TItem[] | null) => void;
  pageSize?: number;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loadingText?: string;
}

export const InfiniteComboboxField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const customData = React.useMemo<InfiniteComboboxCustomData<unknown>>(
    () =>
      (field.fieldConfig?.customData as InfiniteComboboxCustomData<unknown>) ??
      {},
    [field.fieldConfig?.customData],
  );
  const pageSize = customData.pageSize ?? 20;
  const placeholder = customData.placeholder ?? 'Select options...';
  const searchPlaceholder = customData.searchPlaceholder ?? 'Search...';
  const emptyText = customData.emptyText ?? 'No options found.';
  const loadingText = customData.loadingText ?? 'Loading...';
  const selectionMode = customData.selectionMode ?? 'multiple';
  const isMultiple = selectionMode === 'multiple';
  const isDisabled = Boolean(customData.disabled);

  const watchedValue = watch(id) as string[] | string | undefined;
  const current = React.useMemo(() => {
    if (isMultiple) {
      return Array.isArray(watchedValue) ? watchedValue : [];
    }

    if (typeof watchedValue === 'string' && watchedValue.length > 0) {
      return [watchedValue];
    }

    return [];
  }, [isMultiple, watchedValue]);

  const [labelCache, setLabelCache] = React.useState<Record<string, string>>(
    {},
  );

  const {
    data,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [
      ...(customData.queryKey ?? ['infinite-combobox', id]),
      debouncedKeyword,
      pageSize,
    ],
    enabled: open && typeof customData.queryFn === 'function',
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      customData.queryFn({
        ...(customData.staticParams ?? {}),
        Page: pageParam,
        PageSize: pageSize,
        Keyword: debouncedKeyword || undefined,
      } as InfiniteComboboxQueryParams),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const setComboboxValue = React.useCallback(
    (nextValues: string[]) => {
      const nextValue = isMultiple ? nextValues : (nextValues[0] ?? '');

      setValue(id, nextValue, {
        shouldValidate: true,
        shouldDirty: true,
      });

      customData.onValueChange?.(nextValue);

      if (customData.onItemSelect) {
        const merged = data?.pages.flatMap((page) => page.items) ?? [];
        const mapItem =
          customData.dataMapper ??
          ((item: unknown) => item as InfiniteComboboxOption);

        if (isMultiple) {
          const selectedItems = merged.filter((item) =>
            nextValues.includes(mapItem(item).value),
          );
          customData.onItemSelect(
            selectedItems as typeof customData.onItemSelect extends (
              item: infer P,
            ) => void
              ? P
              : never,
          );
        } else {
          const singleValue = nextValues[0] ?? '';
          const selectedItem = merged.find(
            (item) => mapItem(item).value === singleValue,
          );
          if (selectedItem) {
            customData.onItemSelect(
              selectedItem as typeof customData.onItemSelect extends (
                item: infer P,
              ) => void
                ? P
                : never,
            );
          } else {
            customData.onItemSelect(null);
          }
        }
      }
    },
    [customData, id, isMultiple, setValue, data?.pages],
  );

  const options = React.useMemo(() => {
    const merged = data?.pages.flatMap((page) => page.items) ?? [];
    const mapItem =
      customData.dataMapper ??
      ((item: unknown) => item as InfiniteComboboxOption);
    const unique = new Map<string, InfiniteComboboxOption>();

    for (const item of merged) {
      const mapped = mapItem(item);
      if (!unique.has(mapped.value)) {
        unique.set(mapped.value, mapped);
      }
    }

    return Array.from(unique.values());
  }, [customData.dataMapper, data?.pages]);

  // Preserve labels for items that might disappear from current "options" during searching
  React.useEffect(() => {
    if (options.length === 0) return;
    setLabelCache((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const option of options) {
        if (next[option.value] !== option.label) {
          next[option.value] = option.label;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [options]);

  const selectedOptions = React.useMemo(
    () =>
      current.map((value) => {
        const match = options.find((option) => option.value === value);
        return {
          value,
          label: match?.label ?? labelCache[value] ?? value,
        };
      }),
    [current, options, labelCache],
  );

  const toggle = (value: string) => {
    if (!isMultiple) {
      setComboboxValue([value]);
      setOpen(false);
      return;
    }

    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setComboboxValue(next);
  };

  const remove = (value: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setComboboxValue(current.filter((item) => item !== value));
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasNextPage || isFetchingNextPage) return;

    const target = event.currentTarget;
    const threshold = 40;
    const distanceToBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;

    if (distanceToBottom <= threshold) {
      fetchNextPage();
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    // Chỉ ngăn Radix UI bắt event cuộn trang, để trình duyệt tự cuộn mượt mà
    event.stopPropagation();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setKeyword('');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={isDisabled}
          className={cn(
            `h-auto min-h-9 w-full justify-between overflow-hidden px-3 py-1.5
            font-normal`,
            error && 'border-destructive',
          )}
        >
          <div className='flex w-full flex-wrap gap-1'>
            {selectedOptions.length === 0 ? (
              <span className='text-muted-foreground'>{placeholder}</span>
            ) : !isMultiple ? (
              <TextEllipsis>{selectedOptions[0]?.label}</TextEllipsis>
            ) : (
              selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant='secondary'
                  className='gap-1 pr-1'
                >
                  {option.label}
                  <span
                    role='button'
                    tabIndex={0}
                    onClick={(event) => remove(option.value, event)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        remove(
                          option.value,
                          event as unknown as React.MouseEvent,
                        );
                      }
                    }}
                    className='cursor-pointer rounded-sm opacity-70
                      hover:opacity-100'
                  >
                    <X className='size-3' />
                  </span>
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown
            className={cn(
              'ml-2 size-4 shrink-0 opacity-50',
              (isLoading || isFetching) && 'opacity-30',
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        className='w-[var(--radix-popover-trigger-width)] p-2'
      >
        <div className='space-y-2'>
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={searchPlaceholder}
            disabled={isDisabled}
          />

          <div
            className='max-h-64 overflow-auto overscroll-contain'
            onScroll={handleScroll}
            onWheel={handleWheel}
          >
            {isLoading && (
              <div className='space-y-2 p-2'>
                <p className='text-xs text-muted-foreground'>{loadingText}</p>
                <Skeleton className='h-6 w-full rounded-sm' />
                <Skeleton className='h-6 w-5/6 rounded-sm' />
                <Skeleton className='h-6 w-4/6 rounded-sm' />
              </div>
            )}

            {!isLoading && isError && (
              <div className='py-6 text-center text-sm text-destructive'>
                Failed to load options.
              </div>
            )}

            {!isLoading && !isError && options.length === 0 && (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                {emptyText}
              </div>
            )}

            {!isLoading && !isError && options.length > 0 && (
              <div className='space-y-1'>
                {options.map((option) => {
                  if (!isMultiple) {
                    return (
                      <button
                        key={option.value}
                        type='button'
                        className={cn(
                          `flex w-full items-center rounded-sm px-2 py-1.5
                          text-left text-sm hover:bg-accent`,
                          current.includes(option.value) && 'bg-accent',
                        )}
                        disabled={isDisabled}
                        onClick={() => toggle(option.value)}
                      >
                        {option.label}
                      </button>
                    );
                  }

                  const cbId = `${id}-ic-${option.value}`;
                  return (
                    <label
                      key={option.value}
                      htmlFor={cbId}
                      className='flex cursor-pointer items-center gap-2
                        rounded-sm px-2 py-1.5 text-sm hover:bg-accent'
                    >
                      <Checkbox
                        id={cbId}
                        checked={current.includes(option.value)}
                        disabled={isDisabled}
                        onCheckedChange={() => toggle(option.value)}
                      />
                      <span className='w-full font-normal'>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {(isFetchingNextPage || (isFetching && !isLoading)) && (
              <div className='space-y-2 p-2'>
                <p className='text-xs text-muted-foreground'>{loadingText}</p>
                <Skeleton className='h-6 w-full rounded-sm' />
                <Skeleton className='h-6 w-5/6 rounded-sm' />
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
