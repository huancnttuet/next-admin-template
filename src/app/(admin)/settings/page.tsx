'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  ThemePresetSelect,
  FontSelect,
  ScaleToggle,
  RadiusToggle,
  ThemeModeToggle,
  PageLayoutToggle,
  NavbarStyleToggle,
  SidebarStyleToggle,
  SidebarCollapsibleToggle,
  LanguageToggle,
} from '@/components/layout/preferences';
import {
  usePreferencesStore,
  PREFERENCE_DEFAULTS,
} from '@/stores/preferences-store';
import { Main } from '@/components/layout';

export default function SettingsAppearancePage() {
  const t = useTranslations('settings');
  const tCommon = useTranslations('common');
  const { setTheme } = useTheme();
  const resetPreferences = usePreferencesStore((s) => s.resetPreferences);

  const handleRestore = () => {
    resetPreferences();
    setTheme(PREFERENCE_DEFAULTS.themeMode);
  };

  return (
    <Main className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('appearance')}</h3>
        <p className='text-sm text-muted-foreground'>
          {t('appearanceDescription')}
        </p>
      </div>
      <Separator />
      <div className='grid gap-4 md:grid-cols-2 md:gap-8'>
        <ThemeModeToggle />
        <LanguageToggle />
        <ThemePresetSelect />
        <FontSelect />
        <ScaleToggle />
        <RadiusToggle />
      </div>

      <div>
        <h3 className='text-lg font-medium'>{t('display')}</h3>
        <p className='text-sm text-muted-foreground'>
          {t('displayDescription')}
        </p>
      </div>
      <Separator />
      <div className='grid gap-4 md:grid-cols-2 md:gap-8'>
        <PageLayoutToggle />
        <NavbarStyleToggle />
        <SidebarStyleToggle />
        <SidebarCollapsibleToggle />
      </div>

      <Separator />
      <Button type='button' size='sm' variant='outline' onClick={handleRestore}>
        {tCommon('restoreDefaults')}
      </Button>
    </Main>
  );
}
