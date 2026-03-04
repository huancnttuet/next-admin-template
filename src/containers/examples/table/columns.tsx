'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { MoreHorizontal, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
  Course,
  CourseCategory,
  CourseStatus,
} from './table-example.types';

type Translator = ReturnType<typeof useTranslations<'tableExample'>>;

// ─── Status badge helper ────────────────────────────────────────────────────

function getStatusVariant(
  status: CourseStatus,
): 'default' | 'secondary' | 'outline' {
  if (status === 'published') return 'default';
  if (status === 'draft') return 'secondary';
  return 'outline';
}

// ─── Rating stars ─────────────────────────────────────────────────────────

function RatingCell({ rating }: { rating: number }) {
  if (rating === 0) return <span className='text-muted-foreground'>—</span>;
  return (
    <span className='flex items-center gap-1'>
      <Star className='h-3.5 w-3.5 fill-yellow-400 text-yellow-400' />
      <span className='tabular-nums'>{rating.toFixed(1)}</span>
    </span>
  );
}

// ─── Column factory ────────────────────────────────────────────────────────

export function getCourseColumns(
  t: Translator,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnDef<Course>[] {
  return [
    // Checkbox
    {
      id: 'select',
      size: 40,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Row index
    {
      id: 'index',
      size: 48,
      header: '#',
      cell: ({ row }) => (
        <span className='tabular-nums text-muted-foreground'>
          {row.index + 1}
        </span>
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // Title — text filter
    {
      id: 'title',
      size: 220,
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colTitle')} />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='max-w-[220px] truncate font-medium'>
              {row.getValue('title')}
            </div>
          </TooltipTrigger>
          <TooltipContent>{row.getValue('title')}</TooltipContent>
        </Tooltip>
      ),
      meta: {
        label: t('colTitle'),
        placeholder: t('searchTitle'),
        variant: 'text' as const,
      },
      enableColumnFilter: true,
    },

    // Category — multiSelect filter
    {
      id: 'category',
      size: 130,
      accessorKey: 'category',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCategory')} />
      ),
      cell: ({ row }) => {
        const category = row.getValue<CourseCategory>('category');
        return (
          <Badge variant='secondary' className='capitalize'>
            {t(`category_${category}`)}
          </Badge>
        );
      },
      meta: {
        label: t('colCategory'),
        variant: 'multiSelect' as const,
        options: (
          [
            'programming',
            'design',
            'business',
            'marketing',
            'science',
          ] as CourseCategory[]
        ).map((c) => ({ label: t(`category_${c}`), value: c })),
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      },
    },

    // Instructor — text filter
    {
      id: 'instructor',
      size: 160,
      accessorKey: 'instructor',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colInstructor')} />
      ),
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='max-w-[160px] truncate'>
              {row.getValue('instructor')}
            </div>
          </TooltipTrigger>
          <TooltipContent>{row.getValue('instructor')}</TooltipContent>
        </Tooltip>
      ),
      meta: {
        label: t('colInstructor'),
        placeholder: t('searchInstructor'),
        variant: 'text' as const,
      },
      enableColumnFilter: true,
    },

    // Status — select filter
    {
      id: 'status',
      size: 130,
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colStatus')} />
      ),
      cell: ({ row }) => {
        const status = row.getValue<CourseStatus>('status');
        return (
          <Badge variant={getStatusVariant(status)} className='capitalize'>
            {t(`status_${status}`)}
          </Badge>
        );
      },
      meta: {
        label: t('colStatus'),
        variant: 'multiSelect' as const,
        options: (['published', 'draft', 'archived'] as CourseStatus[]).map(
          (s) => ({ label: t(`status_${s}`), value: s }),
        ),
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      },
    },

    // Enrollments — range (slider) filter
    {
      id: 'enrollments',
      size: 110,
      accessorKey: 'enrollments',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colEnrollments')} />
      ),
      cell: ({ row }) => (
        <span className='tabular-nums'>
          {row.getValue<number>('enrollments').toLocaleString()}
        </span>
      ),
      meta: {
        label: t('colEnrollments'),
        variant: 'range' as const,
        range: [0, 2100],
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: [number, number]) => {
        const num = row.getValue<number>(id);
        const [min, max] = value;
        return num >= min && num <= max;
      },
    },

    // Rating — range (slider) filter
    {
      id: 'rating',
      size: 160,
      accessorKey: 'rating',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colRating')} />
      ),
      cell: ({ row }) => <RatingCell rating={row.getValue('rating')} />,
      meta: {
        label: t('colRating'),
        variant: 'range' as const,
        range: [0, 5],
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: [number, number]) => {
        const num = row.getValue<number>(id);
        const [min, max] = value;
        return num >= min && num <= max;
      },
    },

    // Free — boolean / select filter
    {
      id: 'isFree',
      size: 100,
      accessorKey: 'isFree',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colFree')} />
      ),
      cell: ({ row }) => {
        const free = row.getValue<boolean>('isFree');
        return (
          <Badge variant={free ? 'default' : 'outline'}>
            {free ? t('labelFree') : t('labelPaid')}
          </Badge>
        );
      },
      meta: {
        label: t('colFree'),
        variant: 'select' as const,
        options: [
          { label: t('labelFree'), value: 'true' },
          { label: t('labelPaid'), value: 'false' },
        ],
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: string[]) => {
        return value.includes(String(row.getValue(id)));
      },
    },

    // Created At — date filter
    {
      id: 'createdAt',
      size: 120,
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label={t('colCreatedAt')} />
      ),
      cell: ({ row }) => (
        <span className='tabular-nums text-muted-foreground'>
          {row.getValue('createdAt')}
        </span>
      ),
      meta: {
        label: t('colCreatedAt'),
        variant: 'date' as const,
      },
      enableColumnFilter: true,
      filterFn: (row, id, value: string) => {
        return row.getValue(id) === value;
      },
    },

    // Actions
    {
      id: 'actions',
      size: 80,
      header: t('colActions'),
      cell: ({ row }) => {
        const course = row.original;
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreHorizontal className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => onEdit(course.id)}>
                {t('actionEdit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-destructive focus:text-destructive'
                onClick={() => onDelete(course.id)}
              >
                {t('actionDelete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
