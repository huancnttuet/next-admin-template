'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  ActionBar,
  ActionBarSelection,
  ActionBarSeparator,
  ActionBarGroup,
  ActionBarItem,
  ActionBarClose,
} from '@/components/ui/action-bar';
import type { User } from '@/features/users';

interface UsersTableActionBarProps {
  table: Table<User>;
  onDeleteSelected: () => void;
  isDeleting?: boolean;
}

export function UsersTableActionBar({
  table,
  onDeleteSelected,
  isDeleting = false,
}: UsersTableActionBarProps) {
  const t = useTranslations('users');
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
        <ActionBarItem
          variant='destructive'
          size='sm'
          disabled={isDeleting}
          onSelect={() => {
            onDeleteSelected();
          }}
        >
          <Trash2 />
          {isDeleting ? t('deleting') : `${t('actionDelete')} (${rows.length})`}
        </ActionBarItem>
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
