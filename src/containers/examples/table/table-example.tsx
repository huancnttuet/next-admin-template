'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from 'nuqs';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ARRAY_SEPARATOR } from '@/configs/data-table';
import { getCourseColumns } from './columns';
import { TableExampleActionBar } from './table-example-action-bar';
import { MOCK_COURSES } from './table-example.data';
import type { Course } from './table-example.types';

// nuqs parsers for filters (mirrors what useDataTable generates internally)
const textParser = parseAsString.withDefault('');
const multiParser = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withDefault(
  [],
);

export function TableExample() {
  const t = useTranslations('tableExample');

  // ── Read URL filter state (mirrors useDataTable's internal filter parsing) ──
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const [{ title, instructor }] = useQueryStates({
    title: textParser,
    instructor: textParser,
  });

  const [{ category, status, isFree }] = useQueryStates({
    category: multiParser,
    status: multiParser,
    isFree: multiParser,
  });

  // ── Apply client-side filtering on the mock data ──────────────────────────
  const filteredData = useMemo<Course[]>(() => {
    return MOCK_COURSES.filter((course) => {
      if (title && !course.title.toLowerCase().includes(title.toLowerCase()))
        return false;
      if (
        instructor &&
        !course.instructor.toLowerCase().includes(instructor.toLowerCase())
      )
        return false;
      if (category.length > 0 && !category.includes(course.category))
        return false;
      if (status.length > 0 && !status.includes(course.status)) return false;
      if (isFree.length > 0 && !isFree.includes(String(course.isFree)))
        return false;
      return true;
    });
  }, [title, instructor, category, status, isFree]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / perPage));

  // ── Paginate in-memory ───────────────────────────────────────────────────
  const pagedData = useMemo<Course[]>(() => {
    const start = (page - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, page, perPage]);

  const columns = useMemo(
    () =>
      getCourseColumns(
        t,
        () => {},
        () => {},
      ),
    [t],
  );

  const { table } = useDataTable({
    data: pagedData,
    columns,
    pageCount: totalPages,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'title'] },
    },
    getRowId: (row) => row.id,
    history: 'push',
  });

  return (
    <div className='space-y-10 pb-16'>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='mt-1 text-muted-foreground'>{t('description')}</p>
      </div>

      <Separator />

      {/* ── Section 1: Full-featured table ────────────────────────────────── */}
      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold'>{t('sectionFullTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('sectionFullDescription')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className='text-base'>{t('fullVariantTitle')}</CardTitle>
            <CardDescription>{t('fullVariantDescription')}</CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            <DataTable
              table={table}
              actionBar={<TableExampleActionBar table={table} />}
              tableContainerClassName='max-h-[540px] mx-1'
              className='py-4'
            >
              <DataTableToolbar table={table} />
            </DataTable>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* ── Section 2: Filter variants ────────────────────────────────────── */}
      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold'>{t('sectionFiltersTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('sectionFiltersDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <FilterVariantCard
            title={t('filterTextTitle')}
            description={t('filterTextDescription')}
            badge='text'
          />
          <FilterVariantCard
            title={t('filterMultiSelectTitle')}
            description={t('filterMultiSelectDescription')}
            badge='multiSelect'
          />
          <FilterVariantCard
            title={t('filterRangeTitle')}
            description={t('filterRangeDescription')}
            badge='range'
          />
          <FilterVariantCard
            title={t('filterDateTitle')}
            description={t('filterDateDescription')}
            badge='date'
          />
          <FilterVariantCard
            title={t('filterSelectTitle')}
            description={t('filterSelectDescription')}
            badge='select'
          />
        </div>
      </section>

      <Separator />

      {/* ── Section 3: Column features ──────────────────────────────────── */}
      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold'>{t('sectionColumnsTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('sectionColumnsDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <ColumnFeatureCard
            title={t('colFeatureSortTitle')}
            description={t('colFeatureSortDescription')}
            badge={t('colFeatureSortBadge')}
          />
          <ColumnFeatureCard
            title={t('colFeatureHideTitle')}
            description={t('colFeatureHideDescription')}
            badge={t('colFeatureHideBadge')}
          />
          <ColumnFeatureCard
            title={t('colFeaturePinTitle')}
            description={t('colFeaturePinDescription')}
            badge={t('colFeaturePinBadge')}
          />
        </div>
      </section>

      <Separator />

      {/* ── Section 4: Column pinning ─────────────────────────────────────── */}
      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold'>{t('sectionPinTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('sectionPinDescription')}
          </p>
        </div>
        <PinnedColumnsExample />
      </section>

      <Separator />

      {/* ── Section 5: Row features ─────────────────────────────────────── */}
      <section className='space-y-6'>
        <div>
          <h2 className='text-xl font-semibold'>{t('sectionRowsTitle')}</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            {t('sectionRowsDescription')}
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <ColumnFeatureCard
            title={t('rowFeatureSelectTitle')}
            description={t('rowFeatureSelectDescription')}
            badge='checkbox'
          />
          <ColumnFeatureCard
            title={t('rowFeatureActionBarTitle')}
            description={t('rowFeatureActionBarDescription')}
            badge='ActionBar'
          />
          <ColumnFeatureCard
            title={t('rowFeaturePaginationTitle')}
            description={t('rowFeaturePaginationDescription')}
            badge='pagination'
          />
          <ColumnFeatureCard
            title={t('rowFeatureUrlTitle')}
            description={t('rowFeatureUrlDescription')}
            badge='nuqs'
          />
        </div>
      </section>

      <Separator />

      {/* ── Column variant reference ─────────────────────────────────────── */}
      <ColumnVariantReference />
    </div>
  );
}

// ── Pinned columns standalone example ───────────────────────────────────────

function PinnedColumnsExample() {
  const t = useTranslations('tableExample');
  const columns = useMemo(
    () =>
      getCourseColumns(
        t,
        () => {},
        () => {},
      ),
    [t],
  );

  const { table } = useDataTable({
    data: MOCK_COURSES.slice(0, 8),
    columns,
    pageCount: 1,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 8 },
      // Pin select + index + title to the LEFT, actions to the RIGHT
      columnPinning: {
        left: ['select', 'index', 'title'],
        right: ['actions'],
      },
    },
    getRowId: (row) => row.id,
    // Use different URL keys so this table doesn't clash with the main one
    queryKeys: {
      page: 'pin_page',
      perPage: 'pin_perPage',
      sort: 'pin_sort',
      filters: 'pin_filters',
      joinOperator: 'pin_joinOperator',
    },
  });

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      {/* Left-pin card */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between gap-2'>
            <CardTitle className='text-sm font-medium'>
              {t('pinLeftTitle')}
            </CardTitle>
            <div className='flex gap-1'>
              {['select', 'index', 'title'].map((c) => (
                <Badge
                  key={c}
                  variant='secondary'
                  className='font-mono text-xs'
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <CardDescription className='mt-1'>
            {t('pinLeftDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <DataTable table={table} tableContainerClassName='max-h-[340px]'>
            <DataTableToolbar table={table} />
          </DataTable>
        </CardContent>
      </Card>

      {/* Right-pin card */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between gap-2'>
            <CardTitle className='text-sm font-medium'>
              {t('pinRightTitle')}
            </CardTitle>
            <Badge variant='secondary' className='font-mono text-xs'>
              actions
            </Badge>
          </div>
          <CardDescription className='mt-1'>
            {t('pinRightDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <DataTable table={table} tableContainerClassName='max-h-[340px]'>
            <DataTableToolbar table={table} />
          </DataTable>
        </CardContent>
      </Card>

      {/* Config snippet */}
      <Card className='lg:col-span-2'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm font-medium'>
            {t('pinConfigTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='overflow-x-auto rounded-md bg-muted p-4 text-xs'>
            {`useDataTable({
  initialState: {
    columnPinning: {
      left:  ['select', 'index', 'title'],   // pinned left
      right: ['actions'],                     // pinned right
    },
  },
  // getColumnPinningStyle() in lib/data-table.ts applies:
  //   position: sticky, left/right offset, z-index, background, box-shadow
});`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Small helper cards ────────────────────────────────────────────────────────

function FilterVariantCard({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Badge variant='secondary' className='font-mono text-xs'>
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

function ColumnFeatureCard({
  title,
  description,
  badge,
}: {
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
          <Badge variant='outline' className='font-mono text-xs'>
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}

// ── Column / filter variant reference table ───────────────────────────────────

const COLUMN_VARIANTS: Array<{
  variant: string;
  column: string;
  filterUI: string;
  columnMeta: string;
  notes: string;
}> = [
  {
    variant: 'text',
    column: 'title, instructor',
    filterUI: '<Input>',
    columnMeta: "variant: 'text', placeholder",
    notes: 'Free-text search. Debounced. Synced to URL via nuqs.',
  },
  {
    variant: 'multiSelect',
    column: 'category, status',
    filterUI: '<DataTableFacetedFilter>',
    columnMeta: "variant: 'multiSelect', options: [{label, value}]",
    notes: 'Multi-select popover with faceted counts per option.',
  },
  {
    variant: 'select',
    column: 'isFree',
    filterUI: '<DataTableFacetedFilter>',
    columnMeta: "variant: 'select', options: [{label, value}]",
    notes: 'Single-select popover. Faceted counts shown.',
  },
  {
    variant: 'range',
    column: 'enrollments, rating',
    filterUI: '<DataTableSliderFilter>',
    columnMeta: "variant: 'range', range: [min, max]",
    notes: 'Dual-handle slider. Filters rows between [min, max].',
  },
  {
    variant: 'date',
    column: 'createdAt',
    filterUI: '<DataTableDateFilter>',
    columnMeta: "variant: 'date'",
    notes: 'Calendar popover. Exact date match.',
  },
  {
    variant: 'dateRange',
    column: '—',
    filterUI: '<DataTableDateFilter multiple>',
    columnMeta: "variant: 'dateRange'",
    notes: 'Calendar popover with a start and end date range.',
  },
  {
    variant: 'number',
    column: '—',
    filterUI: '<Input type="number">',
    columnMeta: "variant: 'number', unit?",
    notes: 'Numeric input with optional unit suffix (e.g. "px", "%").',
  },
];

function ColumnVariantReference() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>
          Column filter variant reference
        </CardTitle>
        <CardDescription>
          Set{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>variant</code>{' '}
          in the column{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>meta</code>{' '}
          object to control which filter UI the toolbar renders. Enable the
          filter with{' '}
          <code className='rounded bg-muted px-1 py-0.5 text-xs'>
            enableColumnFilter: true
          </code>{' '}
          on the column definition.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b text-left text-xs text-muted-foreground'>
                <th className='pb-2 pr-4 font-medium'>variant</th>
                <th className='pb-2 pr-4 font-medium'>Used on column</th>
                <th className='pb-2 pr-4 font-medium'>Filter UI</th>
                <th className='pb-2 pr-4 font-medium'>column meta shape</th>
                <th className='pb-2 font-medium'>Notes</th>
              </tr>
            </thead>
            <tbody>
              {COLUMN_VARIANTS.map(
                ({ variant, column, filterUI, columnMeta, notes }) => (
                  <tr key={variant} className='border-b last:border-0'>
                    <td className='py-2 pr-4'>
                      <Badge variant='secondary' className='font-mono text-xs'>
                        {variant}
                      </Badge>
                    </td>
                    <td className='py-2 pr-4 font-mono text-xs text-muted-foreground'>
                      {column}
                    </td>
                    <td className='py-2 pr-4 font-mono text-xs'>{filterUI}</td>
                    <td className='py-2 pr-4 font-mono text-xs text-muted-foreground'>
                      {columnMeta}
                    </td>
                    <td className='py-2 text-xs text-muted-foreground'>
                      {notes}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
