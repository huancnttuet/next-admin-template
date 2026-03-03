'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { ThemeMode } from '@/stores/preferences-store';

interface ThemeModeToggleProps {
  compact?: boolean;
}

export function ThemeModeToggle({ compact }: ThemeModeToggleProps) {
  const t = useTranslations('preferences');
  const { theme, setTheme } = useTheme();

  const handleChange = (mode: ThemeMode | '') => {
    if (!mode) return;
    setTheme(mode);
  };

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('themeMode')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={theme ?? 'system'}
        onValueChange={handleChange}
      >
        <ToggleGroupItem
          value='light'
          aria-label='Light'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('light')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='dark'
          aria-label='Dark'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('dark')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='system'
          aria-label='System'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('system')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
