'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  const t = useTranslations('errors');
  const tCommon = useTranslations('common');

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 p-6 text-center'>
      <div className='space-y-2'>
        <h1 className='text-7xl font-bold'>401</h1>
        <h2 className='text-2xl font-semibold'>{t('unauthorized')}</h2>
        <p className='text-muted-foreground'>{t('unauthorizedDescription')}</p>
      </div>
      <Button asChild>
        <Link href='/sign-in'>{tCommon('signIn')}</Link>
      </Button>
    </div>
  );
}
