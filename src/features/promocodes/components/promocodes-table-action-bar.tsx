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
import type { Promocode } from '@/features/promocodes';
import { DeletePromocodesDialog } from '@/features/promocodes/components';

interface PromocodesTableActionBarProps {
  table: Table<Promocode>;
}

export function PromocodesTableActionBar({
  table,
}: PromocodesTableActionBarProps) {
  const t = useTranslations('promocodes');
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
        <DeletePromocodesDialog rows={rows.map((row) => row.original)} />
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
