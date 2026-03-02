'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/layout/search';
import { ThemeSwitch } from '@/components/layout/theme-switch';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';
import { LayoutControls } from '@/components/layout/layout-controls';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations('settings');

  const sidebarNavItems = [
    { title: t('profile'), href: '/settings' },
    { title: t('account'), href: '/settings/account' },
    { title: t('appearance'), href: '/settings/appearance' },
    { title: t('notifications'), href: '/settings/notifications' },
    { title: t('display'), href: '/settings/display' },
  ];

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
      <Main>
        <div className='space-y-6'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
            <p className='text-muted-foreground'>{t('description')}</p>
          </div>
          <Separator />
          <div className='flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0'>
            <aside className='-mx-4 lg:w-1/5'>
              <nav className='flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'>
                {sidebarNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground',
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </aside>
            <div className='flex-1 lg:max-w-2xl'>{children}</div>
          </div>
        </div>
      </Main>
    </>
  );
}
