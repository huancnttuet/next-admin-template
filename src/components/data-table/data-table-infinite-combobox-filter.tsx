'use client';

import * as React from 'react';
import { type Column } from '@tanstack/react-table';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Check, PlusCircle, XCircle } from 'lucide-react';
import type { PagedList } from '@/types/api';
import { useDebounce } from '@/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface InfiniteFilterQueryParams {
  Page: number;
  PageSize: number;
  Keyword?: string;
}

interface InfiniteFilterOption {
  label: string;
  value: string;
}

interface DataTableInfiniteComboboxFilterProps<
  TData,
  TValue,
  TItem,
  TStaticParams extends Record<string, unknown> = Record<string, never>,
> {
  column?: Column<TData, TValue>;
  title: string;
  queryKey: unknown[];
  queryFn: (
    params: InfiniteFilterQueryParams & Partial<TStaticParams>,
  ) => Promise<PagedList<TItem>>;
  mapOption: (item: TItem) => InfiniteFilterOption;
  staticParams?: TStaticParams;
  multiple?: boolean;
  pageSize?: number;
  debounceMs?: number;
  searchPlaceholder?: string;
  emptyText?: string;
  clearText?: string;
  selectedText?: string;
  popoverClassName?: string;
}

export function DataTableInfiniteComboboxFilter<
  TData,
  TValue,
  TItem,
  TStaticParams extends Record<string, unknown> = Record<string, never>,
>({
  column,
  title,
  queryKey,
  queryFn,
  mapOption,
  staticParams,
  multiple = true,
  pageSize = 20,
  debounceMs = 300,
  searchPlaceholder,
  emptyText = 'No results found.',
  clearText = 'Clear filters',
  selectedText = 'selected',
  popoverClassName = 'w-60 p-0',
}: DataTableInfiniteComboboxFilterProps<TData, TValue, TItem, TStaticParams>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, debounceMs);
  const columnFilterValue = column?.getFilterValue();

  const selectedValues = React.useMemo(
    () =>
      new Set(
        Array.isArray(columnFilterValue) ? (columnFilterValue as string[]) : [],
      ),
    [columnFilterValue],
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [...queryKey, debouncedSearch, pageSize],
    initialPageParam: 1,
    enabled: open,
    queryFn: ({ pageParam }) => {
      const params = {
        ...(staticParams ?? {}),
        Page: pageParam,
        PageSize: pageSize,
        Keyword: debouncedSearch || undefined,
      } as InfiniteFilterQueryParams & Partial<TStaticParams>;

      return queryFn(params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 5,
  });

  const options = React.useMemo(() => {
    const unique = new Map<string, InfiniteFilterOption>();

    for (const page of data?.pages ?? []) {
      for (const item of page.items) {
        const mapped = mapOption(item);
        if (!unique.has(mapped.value)) {
          unique.set(mapped.value, mapped);
        }
      }
    }

    return Array.from(unique.values());
  }, [data?.pages, mapOption]);

  const selectedOptions = React.useMemo(
    () =>
      Array.from(selectedValues).map((value) => {
        const option = options.find((item) => item.value === value);
        return {
          value,
          label: option?.label ?? value,
        };
      }),
    [options, selectedValues],
  );

  const onItemSelect = React.useCallback(
    (option: InfiniteFilterOption) => {
      if (!column) return;

      if (!multiple) {
        column.setFilterValue(
          selectedValues.has(option.value) ? undefined : [option.value],
        );
        setOpen(false);
        return;
      }

      const nextValues = new Set(selectedValues);
      if (nextValues.has(option.value)) {
        nextValues.delete(option.value);
      } else {
        nextValues.add(option.value);
      }

      const filterValues = Array.from(nextValues);
      column.setFilterValue(filterValues.length > 0 ? filterValues : undefined);
    },
    [column, multiple, selectedValues],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (!hasNextPage || isFetchingNextPage) return;

      const target = event.currentTarget;
      const remaining =
        target.scrollHeight - target.scrollTop - target.clientHeight;

      if (remaining <= 32) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='border-dashed font-normal'
        >
          {selectedValues.size > 0 ? (
            <div
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className='rounded-sm opacity-70 transition-opacity
                hover:opacity-100 focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring'
              onClick={onReset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator
                orientation='vertical'
                className='mx-0.5 data-[orientation=vertical]:h-4'
              />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {selectedValues.size}
              </Badge>
              <div className='hidden items-center gap-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal'
                  >
                    {selectedValues.size} {selectedText}
                  </Badge>
                ) : (
                  selectedOptions.map((option) => (
                    <Badge
                      variant='secondary'
                      key={option.value}
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={popoverClassName} align='start'>
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={searchPlaceholder ?? title}
          />
          <CommandList className='max-h-full'>
            {!isLoading && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup
              className='max-h-[300px] scroll-py-1 overflow-y-auto
                overflow-x-hidden'
              onScroll={onScroll}
            >
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => onItemSelect(option)}
                  >
                    <div
                      className={cn(
                        `flex size-4 items-center justify-center rounded-sm
                        border border-primary`,
                        isSelected
                          ? 'bg-primary'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <Check />
                    </div>
                    <span className='truncate'>{option.label}</span>
                  </CommandItem>
                );
              })}

              {(isLoading || isFetching || isFetchingNextPage) && (
                <div className='space-y-2 p-2'>
                  <Skeleton className='h-6 w-full rounded-sm' />
                  <Skeleton className='h-6 w-5/6 rounded-sm' />
                  <Skeleton className='h-6 w-4/6 rounded-sm' />
                </div>
              )}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onReset()}
                    className='justify-center text-center'
                  >
                    {clearText}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
