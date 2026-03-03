'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  usePreferencesStore,
  type NavbarStyle,
} from '@/stores/preferences-store';

interface NavbarStyleToggleProps {
  compact?: boolean;
}

export function NavbarStyleToggle({ compact }: NavbarStyleToggleProps) {
  const t = useTranslations('preferences');
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('navbarBehavior')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={navbarStyle}
        onValueChange={(v) => v && setNavbarStyle(v as NavbarStyle)}
      >
        <ToggleGroupItem
          value='sticky'
          aria-label='Sticky'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('sticky')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='scroll'
          aria-label='Scroll'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('scroll')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
