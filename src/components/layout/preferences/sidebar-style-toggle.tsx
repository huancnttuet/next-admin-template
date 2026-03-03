'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  usePreferencesStore,
  type SidebarVariant,
} from '@/stores/preferences-store';

interface SidebarStyleToggleProps {
  compact?: boolean;
}

export function SidebarStyleToggle({ compact }: SidebarStyleToggleProps) {
  const t = useTranslations('preferences');
  const sidebarVariant = usePreferencesStore((s) => s.sidebarVariant);
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('sidebarStyle')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={sidebarVariant}
        onValueChange={(v) => v && setSidebarVariant(v as SidebarVariant)}
      >
        <ToggleGroupItem
          value='inset'
          aria-label='Inset'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('inset')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='sidebar'
          aria-label='Sidebar'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('sidebar')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='floating'
          aria-label='Floating'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('floating')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
