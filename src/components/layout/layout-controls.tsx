'use client';

import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  usePreferencesStore,
  PREFERENCE_DEFAULTS,
} from '@/stores/preferences-store';
import {
  ThemePresetSelect,
  FontSelect,
  LanguageToggle,
  ScaleToggle,
  RadiusToggle,
  ThemeModeToggle,
  PageLayoutToggle,
  NavbarStyleToggle,
  SidebarStyleToggle,
  SidebarCollapsibleToggle,
} from '@/components/layout/preferences';

export function LayoutControls() {
  const { setTheme } = useTheme();
  const tCommon = useTranslations('common');
  const resetPreferences = usePreferencesStore((s) => s.resetPreferences);

  const handleRestore = () => {
    resetPreferences();
    setTheme(PREFERENCE_DEFAULTS.themeMode);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' className='rounded-full'>
          <Settings className='size-[1.2rem]' />
          <span className='sr-only'>{tCommon('preferences')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80'>
        <div className='flex max-h-[calc(100dvh-6rem)] flex-col gap-2 overflow-auto pl-1 pr-2'>
          {/* Header */}
          <div className='space-y-1.5'>
            <h4 className='text-sm font-medium leading-none'>
              {tCommon('preferences')}
            </h4>
            <p className='text-xs text-muted-foreground'>
              {tCommon('preferencesDescription')}
            </p>
          </div>

          <div className='space-y-3'>
            <ThemePresetSelect compact />
            <FontSelect compact />
            <LanguageToggle compact />
            <ScaleToggle compact />
            <RadiusToggle compact />
            <ThemeModeToggle compact />
            <PageLayoutToggle compact />
            <NavbarStyleToggle compact />
            <SidebarStyleToggle compact />
            <SidebarCollapsibleToggle compact />

            {/* Restore Defaults */}
            <Button
              type='button'
              size='sm'
              variant='outline'
              className='w-full'
              onClick={handleRestore}
            >
              {tCommon('restoreDefaults')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
