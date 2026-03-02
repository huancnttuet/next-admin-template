'use client';

import { SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SearchProps = {
  className?: string;
  placeholder?: string;
};

export function Search({
  className = '',
  placeholder = 'Search',
}: SearchProps) {
  return (
    <Button
      variant='outline'
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
      <span className='ml-4'>{placeholder}</span>
      <kbd className='pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
        <span className='text-xs'>⌘</span>K
      </kbd>
    </Button>
  );
}
