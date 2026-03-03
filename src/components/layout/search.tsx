'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { searchItems } from '@/configs/search';

type SearchProps = {
  className?: string;
};

export function Search({ className = '' }: SearchProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const t = useTranslations('sidebar');
  const tCommon = useTranslations('common');

  // ⌘K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  // Group items by groupLabelKey, preserving insertion order
  const groups = React.useMemo(() => {
    const map = new Map<string, typeof searchItems>();
    for (const item of searchItems) {
      const key = item.groupLabelKey;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, []);

  return (
    <>
      <Button
        variant='outline'
        onClick={() => setOpen(true)}
        className={cn(
          'relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent sm:w-40 sm:pr-12 md:flex-none lg:w-52 xl:w-64',
          className,
        )}
      >
        <SearchIcon
          aria-hidden='true'
          className='absolute left-1.5 top-1/2 -translate-y-1/2'
          size={16}
        />
        <span className='ml-4'>{tCommon('search')}</span>
        <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={`${tCommon('search')}...`} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Array.from(groups.entries()).map(([groupKey, items], idx) => (
            <React.Fragment key={groupKey}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={t(groupKey as Parameters<typeof t>[0])}>
                {items.map((item) => (
                  <CommandItem
                    key={item.url + item.labelKey}
                    value={`${t(item.labelKey as Parameters<typeof t>[0])} ${item.keywords?.join(' ') ?? ''}`}
                    onSelect={() => handleSelect(item.url)}
                  >
                    <item.icon className='mr-2 size-4 shrink-0' />
                    {t(item.labelKey as Parameters<typeof t>[0])}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
