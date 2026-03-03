'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { PreferencesApplier } from '@/components/layout/preferences-applier';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <PreferencesApplier />
            {children}
            <Toaster richColors closeButton position='top-right' />
          </NuqsAdapter>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
