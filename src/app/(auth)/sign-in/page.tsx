'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogIn } from 'lucide-react';
import { buildSSOAuthUrl } from '@/configs/sso';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  const searchParams = useSearchParams();
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState(false);
  const [error, setError] = useState('');

  // Show SSO error if redirected back with an error
  const authError = searchParams.get('error');

  function getAuthErrorMessage(code: string | null): string {
    if (!code) return '';
    switch (code) {
      case 'User.NotFound':
        return t('ssoUserNotFound');
      case 'CredentialsSignin':
        return t('ssoError');
      default:
        return t('ssoError');
    }
  }

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

  async function handleSSOLogin() {
    setIsSSOLoading(true);
    setError('');
    // Redirect directly to KAPI authorization page.
    // After authentication, KAPI redirects to /user/login?code=xxx
    // which then calls signIn('sso', { code }) to create the session.
    window.location.href = buildSSOAuthUrl();
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>{t('signIn')}</CardTitle>
        <CardDescription>{t('signInDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {(error || authError) && (
            <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
              {error || getAuthErrorMessage(authError)}
            </div>
          )}

          {/* SSO Login Button */}
          <Button
            type='button'
            variant='outline'
            className='w-full'
            disabled={isSSOLoading || isLoading}
            onClick={handleSSOLogin}
          >
            <LogIn className='mr-2 size-4' />
            {isSSOLoading ? t('ssoLoggingIn') : t('ssoLogin')}
          </Button>

          {/* Divider */}
          <div className='relative flex items-center gap-3'>
            <Separator className='flex-1' />
            <span className='text-xs uppercase text-muted-foreground'>
              {t('orContinueWith')}
            </span>
            <Separator className='flex-1' />
          </div>

          {/* Credentials Form */}
          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>{t('email')}</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='admin@example.com'
                required
                disabled={isLoading || isSSOLoading}
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
                disabled={isLoading || isSSOLoading}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading || isSSOLoading}
            >
              {isLoading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
        </div>
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
