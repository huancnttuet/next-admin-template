'use client'

import { useTranslations } from 'next-intl'
import { Separator } from '@/components/ui/separator'

export default function SettingsNotificationsPage() {
  const t = useTranslations('settings')

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('notifications')}</h3>
        <p className='text-sm text-muted-foreground'>{t('notificationsDescription')}</p>
      </div>
      <Separator />
      <div className='flex items-center justify-center rounded-lg border border-dashed py-16'>
        <p className='text-muted-foreground'>{t('notificationsComingSoon')}</p>
      </div>
    </div>
  )
}
