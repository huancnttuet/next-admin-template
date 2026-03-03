'use client';

import { useMemo, useState } from 'react';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { useDataTable } from '@/hooks/use-data-table';
import { usePagedQuestionnaireGroups } from '@/services/questionnaire-groups';
import type { QuestionnaireGroup } from '@/services/questionnaire-groups';
import { getQuestionnaireGroupColumns } from './columns';
import { CreateQuestionnaireGroupDialog } from './create-questionnaire-group-dialog';
import { QuestionnaireGroupsTableActionBar } from './questionnaire-groups-table-action-bar';
import { ViewQuestionnaireGroupSheet } from './view-questionnaire-group-sheet';

export function QuestionnaireGroupsTable() {
  const t = useTranslations('questionnaireGroups');
  const [viewId, setViewId] = useState<string | null>(null);
  const columns = useMemo(
    () => getQuestionnaireGroupColumns(t, (id) => setViewId(id)),
    [t],
  );

  // Read URL state managed by useDataTable
  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [perPage] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [nameFilter] = useQueryState('name', parseAsString.withDefault(''));

  const { data, isLoading, isFetching } = usePagedQuestionnaireGroups({
    Page: page,
    PageSize: perPage,
    Keyword: nameFilter || undefined,
  });

  const { table } = useDataTable<QuestionnaireGroup>({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { left: ['select', 'index', 'name'] },
    },
    getRowId: (row) => row.id,
  });

  if (isLoading) {
    return (
      <DataTableSkeleton
        columnCount={6}
        rowCount={10}
        filterCount={1}
        withPagination
        withViewOptions
      />
    );
  }

  return (
    <>
      <DataTable
        table={table}
        actionBar={<QuestionnaireGroupsTableActionBar table={table} />}
        tableContainerClassName='max-h-[calc(100dvh-20rem)]'
        isFetching={isFetching}
      >
        <DataTableToolbar table={table}>
          <CreateQuestionnaireGroupDialog />
        </DataTableToolbar>
      </DataTable>
      <ViewQuestionnaireGroupSheet
        id={viewId}
        open={viewId !== null}
        onOpenChange={(open) => {
          if (!open) setViewId(null);
        }}
      />
    </>
  );
}
