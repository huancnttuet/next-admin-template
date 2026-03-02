'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center'>
      <div className='space-y-2'>
        <h1 className='text-7xl font-bold'>403</h1>
        <h2 className='text-2xl font-semibold'>{t('forbidden')}</h2>
        <p className='text-muted-foreground'>{t('forbiddenDescription')}</p>
      </div>
      <Button asChild>
        <Link href='/'>{tCommon('goToDashboard')}</Link>
      </Button>
    </div>
  );
}
