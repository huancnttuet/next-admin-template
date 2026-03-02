'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePreferencesStore } from '@/stores/preferences-store';

type HeaderProps = React.HTMLAttributes<HTMLElement>;

export function Header({ className, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0);
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const isSticky = navbarStyle === 'sticky';

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear',
        isSticky && 'sticky top-0 z-50',
        offset > 10 && isSticky
          ? 'bg-background/80 shadow backdrop-blur-md'
          : 'shadow-none',
        className,
      )}
      {...props}
    >
      <div className='flex w-full items-center gap-3 px-4 sm:gap-4'>
        <SidebarTrigger variant='outline' className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        {children}
      </div>
    </header>
  );
}
