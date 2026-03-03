'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import { type Locale } from '@/i18n/config';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const LANGUAGE_OPTIONS: { label: string; value: Locale }[] = [
  { label: 'English', value: 'en' },
  { label: 'Tiếng Việt', value: 'vi' },
];

interface LanguageToggleProps {
  compact?: boolean;
}

export function LanguageToggle({ compact }: LanguageToggleProps) {
  const t = useTranslations('preferences');
  const locale = useLocale();
  const router = useRouter();

  const handleChange = (newLocale: string) => {
    if (!newLocale || newLocale === locale) return;
    Cookies.set('locale', newLocale, { path: '/', expires: 365 });
    router.refresh();
  };

  return (
    <div className='space-y-1'>
      <Label className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
        {t('language')}
      </Label>
      <ToggleGroup
        type='single'
        variant='outline'
        size='sm'
        className='w-full'
        value={locale}
        onValueChange={handleChange}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            aria-label={opt.label}
            className={cn('flex-1', compact ? 'text-xs' : 'text-sm')}
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
