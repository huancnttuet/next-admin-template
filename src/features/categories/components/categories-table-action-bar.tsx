'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ActionBar,
  ActionBarSelection,
  ActionBarSeparator,
  ActionBarGroup,
  ActionBarClose,
} from '@/components/ui/action-bar';
import { DeleteCategoriesDialog } from './delete-categories-dialog';
import { Category } from '../categories.type';

interface Props {
  table: Table<Category>;
}

export function CategoriesTableActionBar({ table }: Props) {
  const t = useTranslations('categories');
  const rows = table.getFilteredSelectedRowModel().rows;

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        table.toggleAllRowsSelected(false);
      }
    },
    [table],
  );

  return (
    <ActionBar open={rows.length > 0} onOpenChange={onOpenChange}>
      <ActionBarSelection>
        {rows.length} {t('selected')}
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <DeleteCategoriesDialog rows={rows.map((row) => row.original)} />
      </ActionBarGroup>
      <ActionBarSeparator />
      <ActionBarClose asChild>
        <button type='button' aria-label={t('clearSelection')}>
          <X />
        </button>
      </ActionBarClose>
    </ActionBar>
  );
}
