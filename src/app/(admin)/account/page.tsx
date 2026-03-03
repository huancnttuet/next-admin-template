'use client';

import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LanguageToggle } from '@/components/layout/preferences';
import { Main } from '@/components/layout';

export default function SettingsAccountPage() {
  const t = useTranslations('settings');
  const { data: session } = useSession();

  const userName = session?.user?.name || '—';
  const userEmail = session?.user?.email || '—';
  const userId = session?.user?.id || '—';
  const isSSO = session?.provider === 'sso';

  return (
    <Main className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('account')}</h3>
        <p className='text-sm text-muted-foreground'>
          {t('accountDescription')}
        </p>
      </div>
      <Separator />

      {/* User Info */}
      <div className='space-y-4'>
        <Label className='text-sm font-medium'>{t('userInfo')}</Label>
        <div className='flex items-start gap-4 rounded-lg border p-4'>
          <Avatar className='h-14 min-w-14'>
            <AvatarFallback className='text-lg'>
              {userName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='grid flex-1 gap-3'>
            <div className='grid grid-cols-[160px_1fr] items-center gap-2'>
              <span className='text-sm text-muted-foreground'>{t('name')}</span>
              <span className='text-sm font-medium'>{userName}</span>
            </div>
            <div className='grid grid-cols-[160px_1fr] items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {t('email')}
              </span>
              <span className='text-sm font-medium'>{userEmail}</span>
            </div>
            <div className='grid grid-cols-[160px_1fr] items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {t('userId')}
              </span>
              <span className='font-mono text-xs text-muted-foreground'>
                {userId}
              </span>
            </div>
            <div className='grid grid-cols-[160px_1fr] items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                {t('provider')}
              </span>
              <div>
                <Badge variant={isSSO ? 'default' : 'secondary'}>
                  {isSSO ? t('providerSSO') : t('providerCredentials')}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Language */}
      <div className='space-y-4'>
        <LanguageToggle />
      </div>
    </Main>
  );
}
