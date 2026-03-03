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
import { usePreferencesStore } from '@/stores/preferences-store';

const THEME_PRESETS = [
  { label: 'Default', value: 'default', color: 'bg-zinc-900 dark:bg-zinc-100' },
  { label: 'Blue', value: 'blue', color: 'bg-blue-600' },
  { label: 'Green', value: 'green', color: 'bg-green-600' },
  { label: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { label: 'Tangerine', value: 'tangerine', color: 'bg-orange-400' },
  { label: 'Soft Pop', value: 'soft-pop', color: 'bg-violet-500' },
  { label: 'Brutalist', value: 'brutalist', color: 'bg-red-500' },
  { label: 'Underground', value: 'underground', color: 'bg-amber-500' },
  { label: 'Sunset Glow', value: 'sunset-glow', color: 'bg-rose-500' },
  { label: 'Rose Garden', value: 'rose-garden', color: 'bg-pink-500' },
  { label: 'Lake View', value: 'lake-view', color: 'bg-cyan-600' },
  {
    label: 'Forest Whispers',
    value: 'forest-whispers',
    color: 'bg-emerald-700',
  },
  { label: 'Ocean Breeze', value: 'ocean-breeze', color: 'bg-sky-500' },
  { label: 'Lavender Dream', value: 'lavender-dream', color: 'bg-purple-500' },
] as const;

interface ThemePresetSelectProps {
  compact?: boolean;
}

export function ThemePresetSelect({ compact }: ThemePresetSelectProps) {
  const t = useTranslations('preferences');
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('themePreset')}
      </Label>
      <Select value={themePreset} onValueChange={setThemePreset}>
        <SelectTrigger
          className={cn('w-full', compact ? 'h-8 text-xs' : 'text-sm')}
        >
          <SelectValue placeholder='Preset' />
        </SelectTrigger>
        <SelectContent>
          {THEME_PRESETS.map((preset) => (
            <SelectItem
              key={preset.value}
              className={compact ? 'text-xs' : 'text-sm'}
              value={preset.value}
            >
              <span className='flex items-center gap-2'>
                <span className={cn('size-2.5 rounded-full', preset.color)} />
                {preset.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
