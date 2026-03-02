'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/layout/search';
import { ThemeSwitch } from '@/components/layout/theme-switch';
import { ProfileDropdown } from '@/components/layout/profile-dropdown';
import { LayoutControls } from '@/components/layout/layout-controls';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { Overview } from '@/containers/dashboard/components/overview';
import { RecentSales } from '@/containers/dashboard/components/recent-sales';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        </div>
        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>{t('overview')}</TabsTrigger>
            <TabsTrigger value='analytics'>{t('analytics')}</TabsTrigger>
            <TabsTrigger value='reports' disabled>
              {t('reports')}
            </TabsTrigger>
            <TabsTrigger value='notifications' disabled>
              {t('notifications')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {t('totalRevenue')}
                  </CardTitle>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>$45,231.89</div>
                  <p className='text-xs text-muted-foreground'>
                    {t('totalRevenueChange')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {t('subscriptions')}
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2350</div>
                  <p className='text-xs text-muted-foreground'>
                    {t('subscriptionsChange')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {t('sales')}
                  </CardTitle>
                  <CreditCard className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+12,234</div>
                  <p className='text-xs text-muted-foreground'>
                    {t('salesChange')}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {t('activeNow')}
                  </CardTitle>
                  <Activity className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+573</div>
                  <p className='text-xs text-muted-foreground'>
                    {t('activeNowChange')}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
              <Card className='col-span-4'>
                <CardHeader>
                  <CardTitle>{t('overview')}</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-3'>
                <CardHeader>
                  <CardTitle>{t('recentSales')}</CardTitle>
                  <CardDescription>
                    {t('recentSalesDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics'>
            <div className='flex items-center justify-center py-10 text-muted-foreground'>
              {t('analyticsComingSoon')}
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  );
}
