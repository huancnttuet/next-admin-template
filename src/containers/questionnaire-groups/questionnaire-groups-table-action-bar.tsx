'use client';

import * as React from 'react';
import type { Table } from '@tanstack/react-table';
import { Trash2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  ActionBar,
  ActionBarSelection,
  ActionBarSeparator,
  ActionBarGroup,
  ActionBarItem,
  ActionBarClose,
} from '@/components/ui/action-bar';
import type { QuestionnaireGroup } from '@/services/questionnaire-groups';

interface QuestionnaireGroupsTableActionBarProps {
  table: Table<QuestionnaireGroup>;
}

export function QuestionnaireGroupsTableActionBar({
  table,
}: QuestionnaireGroupsTableActionBarProps) {
  const t = useTranslations('questionnaireGroups');
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
          onSelect={() => {
            toast.info(`${t('actionDelete')}: ${rows.length} ${t('selected')}`);
          }}
        >
          <Trash2 />
          {t('actionDelete')} ({rows.length})
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
