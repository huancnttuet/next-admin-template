'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  usePreferencesStore,
  type SidebarCollapsible,
} from '@/stores/preferences-store';

interface SidebarCollapsibleToggleProps {
  compact?: boolean;
}

export function SidebarCollapsibleToggle({
  compact,
}: SidebarCollapsibleToggleProps) {
  const t = useTranslations('preferences');
  const sidebarCollapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const setSidebarCollapsible = usePreferencesStore(
    (s) => s.setSidebarCollapsible,
  );

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('sidebarCollapseMode')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={sidebarCollapsible}
        onValueChange={(v) =>
          v && setSidebarCollapsible(v as SidebarCollapsible)
        }
      >
        <ToggleGroupItem
          value='icon'
          aria-label='Icon'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('icon')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='offcanvas'
          aria-label='OffCanvas'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('offCanvas')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
