'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const t = useTranslations('auth')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    // TODO: Implement forgot password logic
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1000)
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>{t('forgotPassword')}</CardTitle>
        <CardDescription>{t('forgotPasswordDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className='space-y-4 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-primary'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
            </div>
            <p className='text-sm text-muted-foreground'>{t('checkEmail')}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className='space-y-4'>
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
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? t('sending') : t('sendResetLink')}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <div className='w-full text-center text-sm text-muted-foreground'>
          {t('rememberPassword')}{' '}
          <Link
            href='/sign-in'
            className='font-medium text-primary underline-offset-4 hover:underline'
          >
            {t('signIn')}
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
