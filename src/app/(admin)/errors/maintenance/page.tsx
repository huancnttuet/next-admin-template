'use client';

import { useTranslations } from 'next-intl';

export default function MaintenancePage() {
  const t = useTranslations('errors');

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center'>
      <div className='space-y-2'>
        <h1 className='text-7xl font-bold'>503</h1>
        <h2 className='text-2xl font-semibold'>{t('maintenance')}</h2>
        <p className='text-muted-foreground'>{t('maintenanceDescription')}</p>
      </div>
      <p className='text-sm text-muted-foreground'>{t('maintenanceNote')}</p>
    </div>
  );
}
