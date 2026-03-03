'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePreferencesStore, type FontKey } from '@/stores/preferences-store';

const FONT_OPTIONS: { label: string; value: FontKey }[] = [
  { label: 'Inter', value: 'inter' },
  { label: 'Manrope', value: 'manrope' },
  { label: 'Nunito', value: 'nunito' },
  { label: 'Plus Jakarta Sans', value: 'plus-jakarta-sans' },
  { label: 'Space Grotesk', value: 'space-grotesk' },
  { label: 'DM Sans', value: 'dm-sans' },
  { label: 'System', value: 'system' },
];

interface FontSelectProps {
  compact?: boolean;
}

export function FontSelect({ compact }: FontSelectProps) {
  const t = useTranslations('preferences');
  const font = usePreferencesStore((s) => s.font);
  const setFont = usePreferencesStore((s) => s.setFont);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('fonts')}
      </Label>
      <Select value={font} onValueChange={(v) => setFont(v as FontKey)}>
        <SelectTrigger
          className={cn('w-full', compact ? 'h-8 text-xs' : 'text-sm')}
        >
          <SelectValue placeholder='Select font' />
        </SelectTrigger>
        <SelectContent>
          {FONT_OPTIONS.map((f) => (
            <SelectItem
              key={f.value}
              className={compact ? 'text-xs' : 'text-sm'}
              value={f.value}
            >
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
