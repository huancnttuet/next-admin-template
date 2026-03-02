'use client';

import Link from 'next/link';
import { useState } from 'react';
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

export default function SignUpPage() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement sign-up logic
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>{t('createAccount')}</CardTitle>
        <CardDescription>{t('signUpDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>{t('firstName')}</Label>
              <Input
                id='firstName'
                name='firstName'
                placeholder='John'
                required
                disabled={isLoading}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>{t('lastName')}</Label>
              <Input
                id='lastName'
                name='lastName'
                placeholder='Doe'
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>{t('email')}</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='john@example.com'
              required
              disabled={isLoading}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='password'>{t('password')}</Label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              required
              disabled={isLoading}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>{t('confirmPassword')}</Label>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='••••••••'
              required
              disabled={isLoading}
            />
          </div>
          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? t('creatingAccount') : t('createAccount')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <div className='text-center text-sm text-muted-foreground'>
          {t('hasAccount')}{' '}
          <Link
            href='/sign-in'
            className='font-medium text-primary underline-offset-4 hover:underline'
          >
            {t('signIn')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
