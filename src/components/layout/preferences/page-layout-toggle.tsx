'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  usePreferencesStore,
  type ContentLayout,
} from '@/stores/preferences-store';

interface PageLayoutToggleProps {
  compact?: boolean;
}

export function PageLayoutToggle({ compact }: PageLayoutToggleProps) {
  const t = useTranslations('preferences');
  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('pageLayout')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={contentLayout}
        onValueChange={(v) => v && setContentLayout(v as ContentLayout)}
      >
        <ToggleGroupItem
          value='centered'
          aria-label='Centered'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('centered')}
        </ToggleGroupItem>
        <ToggleGroupItem
          value='full-width'
          aria-label='Full Width'
          className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
        >
          {t('fullWidth')}
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
