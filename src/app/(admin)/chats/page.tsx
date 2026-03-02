'use client'

import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/layout/search'
import { ThemeSwitch } from '@/components/layout/theme-switch'
import { ProfileDropdown } from '@/components/layout/profile-dropdown'
import { LayoutControls } from '@/components/layout/layout-controls'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function ChatsPage() {
  const t = useTranslations('pages')

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-2'>
          <LayoutControls />
          <LanguageSwitcher />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main fixed>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>{t('chats')}</h1>
        </div>
        <div className='flex items-center justify-center rounded-lg border border-dashed py-32'>
          <p className='text-muted-foreground'>{t('chatsComingSoon')}</p>
        </div>
      </Main>
    </>
  )
}
