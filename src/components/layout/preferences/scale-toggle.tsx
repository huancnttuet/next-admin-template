'use client';

import { Ban } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePreferencesStore, type ScaleKey } from '@/stores/preferences-store';

const SCALE_OPTIONS: { label: React.ReactNode; value: ScaleKey }[] = [
  { label: 'XS', value: 'xs' },
  { label: <Ban />, value: 'normal' },
  { label: 'LG', value: 'lg' },
];

interface ScaleToggleProps {
  compact?: boolean;
}

export function ScaleToggle({ compact }: ScaleToggleProps) {
  const t = useTranslations('preferences');
  const scale = usePreferencesStore((s) => s.scale);
  const setScale = usePreferencesStore((s) => s.setScale);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('scale')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={scale}
        onValueChange={(v) => v && setScale(v as ScaleKey)}
      >
        {SCALE_OPTIONS.map((opt) => (
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
