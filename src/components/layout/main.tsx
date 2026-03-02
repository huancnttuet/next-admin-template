'use client';

import { cn } from '@/lib/utils';
import { usePreferencesStore } from '@/stores/preferences-store';

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean;
};

export function Main({ fixed, className, ...props }: MainProps) {
  const contentLayout = usePreferencesStore((s) => s.contentLayout);

  return (
    <main
      className={cn(
        'flex-1 overflow-auto px-4 py-6',
        fixed && 'flex grow flex-col overflow-hidden',
        contentLayout === 'centered' && 'mx-auto w-full max-w-screen-xl',
        className,
      )}
      {...props}
    />
  );
}
