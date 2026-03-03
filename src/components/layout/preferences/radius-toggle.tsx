'use client';

import { Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  usePreferencesStore,
  type RadiusKey,
} from '@/stores/preferences-store';

const RADIUS_OPTIONS: { label: React.ReactNode; value: RadiusKey }[] = [
  { label: 'SM', value: 'sm' },
  { label: <Ban />, value: 'normal' },
  { label: 'MD', value: 'md' },
  { label: 'LG', value: 'lg' },
  { label: 'XL', value: 'xl' },
];

interface RadiusToggleProps {
  compact?: boolean;
}

export function RadiusToggle({ compact }: RadiusToggleProps) {
  const t = useTranslations('preferences');
  const radius = usePreferencesStore((s) => s.radius);
  const setRadius = usePreferencesStore((s) => s.setRadius);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('radius')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={radius}
        onValueChange={(v) => v && setRadius(v as RadiusKey)}
      >
        {RADIUS_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            aria-label={opt.value}
            className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
