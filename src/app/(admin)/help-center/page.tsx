'use client';

import { useTranslations } from 'next-intl';
import { Main } from '@/components/layout/main';

export default function HelpCenterPage() {
  const t = useTranslations('pages');

  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('helpCenter')}</h1>
      </div>
      <div className='flex items-center justify-center rounded-lg border border-dashed py-32'>
        <p className='text-muted-foreground'>{t('helpCenterComingSoon')}</p>
      </div>
    </Main>
  );
}
