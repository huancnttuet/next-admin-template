'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function OtpPage() {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const code = otp.join('');
    console.log('OTP:', code);
    // TODO: Implement OTP verification
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>{t('otpVerification')}</CardTitle>
        <CardDescription>{t('otpDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className='space-y-6'>
          <div className='flex justify-center gap-2'>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='h-12 w-12 text-center text-lg'
                disabled={isLoading}
              />
            ))}
          </div>
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || otp.some((d) => !d)}
          >
            {isLoading ? t('verifying') : t('verify')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className='flex-col gap-2'>
        <button
          type='button'
          className='text-sm text-muted-foreground underline-offset-4 hover:underline'
        >
          {t('resendCode')} {t('resend')}
        </button>
        <Link
          href='/sign-in'
          className='text-sm text-muted-foreground underline-offset-4 hover:underline'
        >
          {t('backToSignIn')}
        </Link>
      </CardFooter>
    </Card>
  );
}
