'use client';

import { useTranslations } from 'next-intl';
import { Main } from '@/components/layout/main';
import { Overview } from '@/features/dashboard/components/overview';
import { RecentSales } from '@/features/dashboard/components/recent-sales';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, CreditCard } from 'lucide-react';
import { useDashboardSummary } from '@/features/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/format';

function DashboardSkeleton() {
  const t = useTranslations('dashboard');
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
      </div>
      <div className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0
                  pb-2'
              >
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-4 w-4 rounded-full' />
              </CardHeader>
              <CardContent>
                <Skeleton className='mb-2 h-8 w-[100px]' />
                <Skeleton className='h-4 w-[150px]' />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>{t('overview')}</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <div className='flex h-[350px] items-center justify-center'>
                <Skeleton className='h-[350px] w-full' />
              </div>
            </CardContent>
          </Card>
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>{t('recentSales')}</CardTitle>
              <CardDescription>
                {t('recentSalesDescription', {
                  count: 0,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const { data: summary, isLoading } = useDashboardSummary();

  if (isLoading || !summary) {
    return <DashboardSkeleton />;
  }

  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
      </div>
      <div className='space-y-4'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0
                pb-2'
            >
              <CardTitle className='text-sm font-medium'>
                {t('totalRevenue')}
              </CardTitle>
              <DollarSign className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(summary.stats.totalRevenue)}
                {summary.stats.currentMonthRevenue > 0 && (
                  <span
                    className='ml-2 text-sm font-medium text-muted-foreground'
                  >
                    +{formatCurrency(summary.stats.currentMonthRevenue)}{' '}
                    {t('currentMonth')}
                  </span>
                )}
              </div>
              {summary.stats.revenueChange > 0 && (
                <p className='text-xs text-muted-foreground'>
                  {summary.stats.revenueChange}% {t('totalRevenueChange')}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0
                pb-2'
            >
              <CardTitle className='text-sm font-medium'>
                {t('subscriptions')}
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {summary.stats.totalCustomers}{' '}
                {summary.stats.currentMonthCustomers > 0 && (
                  <span
                    className='ml-2 text-sm font-medium text-muted-foreground'
                  >
                    +{summary.stats.currentMonthCustomers} {t('currentMonth')}
                  </span>
                )}
              </div>
              {summary.stats.customersChange > 0 && (
                <p className='text-xs text-muted-foreground'>
                  {summary.stats.customersChange}% {t('subscriptionsChange')}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0
                pb-2'
            >
              <CardTitle className='text-sm font-medium'>
                {t('sales')}
              </CardTitle>
              <CreditCard className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {summary.stats.totalOrders}
                {summary.stats.currentMonthOrders > 0 && (
                  <span
                    className='ml-2 text-sm font-medium text-muted-foreground'
                  >
                    +{summary.stats.currentMonthOrders} {t('currentMonth')}
                  </span>
                )}
              </div>
              {summary.stats.ordersChange > 0 && (
                <p className='text-xs text-muted-foreground'>
                  {summary.stats.ordersChange}% {t('salesChange')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>{t('overview')}</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview data={summary.overview} />
            </CardContent>
          </Card>
          <Card className='col-span-3'>
            <CardHeader>
              <CardTitle>{t('recentSales')}</CardTitle>
              <CardDescription>
                {t('recentSalesDescription', {
                  count: summary.stats.totalOrders,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales sales={summary.recentSales} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
