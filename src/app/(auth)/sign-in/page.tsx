'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignInPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError(t('invalidCredentials'));
      return;
    }

    router.push('/');
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>{t('signIn')}</CardTitle>
        <CardDescription>{t('signInDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          {error && (
            <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
              {error}
            </div>
          )}
          <div className='space-y-2'>
            <Label htmlFor='email'>{t('email')}</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='admin@example.com'
              required
              disabled={isLoading}
            />
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label htmlFor='password'>{t('password')}</Label>
              <Link
                href='/forgot-password'
                className='text-sm text-muted-foreground underline-offset-4 hover:underline'
              >
                {t('forgotPasswordLink')}
              </Link>
            </div>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              required
              disabled={isLoading}
            />
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? t('signingIn') : t('signIn')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <div className='text-center text-sm text-muted-foreground'>
          {t('noAccount')}{' '}
          <Link
            href='/sign-up'
            className='font-medium text-primary underline-offset-4 hover:underline'
          >
            {t('signUp')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
