'use client'

import { ThemeProvider } from 'next-themes'
import { QueryProvider } from './query-provider'
import { PreferencesApplier } from '@/components/layout/preferences-applier'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <PreferencesApplier />
        {children}
      </ThemeProvider>
    </QueryProvider>
  )
}
