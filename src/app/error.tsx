'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='rounded-full bg-destructive/10 p-4'>
          <AlertTriangle className='size-10 text-destructive' />
        </div>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>{t('somethingWentWrong')}</h1>
          <p className='max-w-md text-muted-foreground'>
            {t('somethingWentWrongDescription')}
          </p>
        </div>
      </div>
      <div className='flex gap-3'>
        <Button variant='outline' onClick={reset}>
          {t('tryAgain')}
        </Button>
        <Button asChild>
          <Link href='/'>{t('goToDashboard')}</Link>
        </Button>
      </div>
    </div>
  );
}
