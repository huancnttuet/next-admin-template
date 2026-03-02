'use client';

import { useTranslations } from 'next-intl';
import { Separator } from '@/components/ui/separator';

export default function SettingsAccountPage() {
  const t = useTranslations('settings');

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('account')}</h3>
        <p className='text-sm text-muted-foreground'>
          {t('accountDescription')}
        </p>
      </div>
      <Separator />
      <div className='flex items-center justify-center rounded-lg border border-dashed py-16'>
        <p className='text-muted-foreground'>{t('accountComingSoon')}</p>
      </div>
    </div>
  );
}
