'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className='flex min-h-[calc(100dvh)] flex-col items-center justify-center gap-6 bg-background p-6 text-center'>
      <div className='space-y-2'>
        <h1 className='text-7xl font-bold'>404</h1>
        <h2 className='text-2xl font-semibold'>{t('pageNotFound')}</h2>
        <p className='max-w-md text-muted-foreground'>
          {t('pageNotFoundDescription')}
        </p>
      </div>
      <div className='flex gap-3'>
        <Button variant='outline' asChild>
          <Link href='/'>{t('goBack')}</Link>
        </Button>
        <Button asChild>
          <Link href='/'>{t('goToDashboard')}</Link>
        </Button>
      </div>
    </div>
  );
}
