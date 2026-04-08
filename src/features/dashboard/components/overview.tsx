'use client';

import { useLocale } from 'next-intl';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MonthlyRevenue } from '@/features/dashboard';
import { formatCurrency } from '@/lib/format';

const defaultData = [
  {
    key: '2026-01',
    year: 2026,
    month: 1,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-02',
    year: 2026,
    month: 2,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-03',
    year: 2026,
    month: 3,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-04',
    year: 2026,
    month: 4,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-05',
    year: 2026,
    month: 5,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-06',
    year: 2026,
    month: 6,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-07',
    year: 2026,
    month: 7,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-08',
    year: 2026,
    month: 8,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-09',
    year: 2026,
    month: 9,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-10',
    year: 2026,
    month: 10,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-11',
    year: 2026,
    month: 11,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    key: '2026-12',
    year: 2026,
    month: 12,
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview({ data }: { data?: MonthlyRevenue[] }) {
  const locale = useLocale();
  const chartData = data && data.length > 0 ? data : defaultData;

  const formatMonthYear = (year: number, month: number) => {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      year: '2-digit',
    }).format(new Date(Date.UTC(year, month - 1, 1)));
  };

  const getMonthYearLabelByKey = (key: string) => {
    const target = chartData.find((item) => item.key === key);
    if (!target) return key;
    return formatMonthYear(target.year, target.month);
  };

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 0, left: 24 }}
      >
        <XAxis
          dataKey='key'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => getMonthYearLabelByKey(String(value))}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={90}
          tickMargin={8}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted) / 0.2)' }}
          formatter={(value) => [formatCurrency(Number(value))]}
          labelFormatter={(label) => getMonthYearLabelByKey(String(label))}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
