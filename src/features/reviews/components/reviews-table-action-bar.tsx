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
import { DeleteReviewsDialog } from './delete-reviews-dialog';
import { Review } from '../reviews.type';

interface Props {
  table: Table<Review>;
}

export function ReviewsTableActionBar({ table }: Props) {
  const t = useTranslations('reviews');
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
        <DeleteReviewsDialog rows={rows.map((row) => row.original)} />
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
