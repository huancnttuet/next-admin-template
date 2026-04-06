'use client';

import { AutoFormFieldProps } from '@autoform/react';
import { ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ── Public types ──────────────────────────────────────────────────────────────

/** A single selectable node returned by the async fetcher. */
export interface TreeSelectNode {
  id: string;
  /** Displayed text for the item */
  label: string;
  /** Optional: group all nodes with the same groupKey under one parent */
  groupKey?: string;
  /** Optional: human-readable label for the group header */
  groupLabel?: string;
}

/**
 * customData options for the `'tree-select'` AutoForm field type.
 *
 * @example
 * customData: {
 *   queryKey: ['my-key'],
 *   queryFn: async () => items.map(i => ({ id: i.id, label: i.name, groupKey: i.category })),
 *   groupLabelFn: (key) => key.replace(/_/g, ' '),
 * }
 */
export interface TreeSelectCustomData {
  /** TanStack Query cache key */
  queryKey: unknown[];
  /** Async fetcher – must resolve to `TreeSelectNode[]` */
  queryFn: () => Promise<TreeSelectNode[]>;
  /**
   * Derive a group key from a node.
   * When omitted, `node.groupKey` is used; if that's also absent every node is in one flat list.
   */
  groupKeyFn?: (node: TreeSelectNode) => string;
  /**
   * Derive a human-readable group header label from a group key.
   * Defaults to capitalising words split by underscores.
   */
  groupLabelFn?: (groupKey: string) => string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Label for the "select all" button */
  selectAllLabel?: string;
  /** Label for the "deselect all" button */
  deselectAllLabel?: string;
}

// ── Internal types ────────────────────────────────────────────────────────────

interface TreeGroup {
  groupKey: string;
  groupLabel: string;
  items: TreeSelectNode[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultGroupLabelFn(key: string): string {
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildGroups(
  nodes: TreeSelectNode[],
  groupKeyFn?: (n: TreeSelectNode) => string,
  groupLabelFn?: (k: string) => string,
): TreeGroup[] {
  const labelFn = groupLabelFn ?? defaultGroupLabelFn;
  const map = new Map<string, TreeGroup>();

  for (const node of nodes) {
    const gKey = groupKeyFn ? groupKeyFn(node) : (node.groupKey ?? '__root__');
    const gLabel =
      node.groupLabel ?? (gKey === '__root__' ? '' : labelFn(gKey));

    if (!map.has(gKey)) {
      map.set(gKey, { groupKey: gKey, groupLabel: gLabel, items: [] });
    }
    map.get(gKey)!.items.push(node);
  }

  return Array.from(map.values());
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface GroupRowProps {
  group: TreeGroup;
  selected: string[];
  onToggleItem: (id: string) => void;
  onToggleGroup: (group: TreeGroup) => void;
}

function GroupRow({
  group,
  selected,
  onToggleItem,
  onToggleGroup,
}: GroupRowProps) {
  const [expanded, setExpanded] = useState(true);
  const groupIds = group.items.map((i) => i.id);
  const selectedCount = groupIds.filter((id) => selected.includes(id)).length;
  const allChecked = selectedCount === groupIds.length && groupIds.length > 0;
  const someChecked = selectedCount > 0 && !allChecked;

  // No group label → flat (ungrouped) list, skip the header row
  if (!group.groupLabel) {
    return (
      <div className='space-y-1'>
        {group.items.map((item) => (
          <ItemRow
            key={item.id}
            item={item}
            selected={selected}
            onToggle={onToggleItem}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className='flex items-center gap-2 py-1'>
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          className='flex shrink-0 items-center text-muted-foreground
            hover:text-foreground'
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          {expanded ? (
            <ChevronDown className='size-4' />
          ) : (
            <ChevronRight className='size-4' />
          )}
        </button>
        <Checkbox
          id={`grp-${group.groupKey}`}
          checked={allChecked ? true : someChecked ? 'indeterminate' : false}
          onCheckedChange={() => onToggleGroup(group)}
        />
        <label
          htmlFor={`grp-${group.groupKey}`}
          className='cursor-pointer text-sm font-medium'
        >
          {group.groupLabel}
        </label>
      </div>

      {expanded && (
        <div className='ml-8 space-y-1'>
          {group.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              selected={selected}
              onToggle={onToggleItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  selected,
  onToggle,
}: {
  item: TreeSelectNode;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className='flex items-center gap-2 py-0.5'>
      <Checkbox
        id={`ts-${item.id}`}
        checked={selected.includes(item.id)}
        onCheckedChange={() => onToggle(item.id)}
      />
      <label
        htmlFor={`ts-${item.id}`}
        className='flex-1 cursor-pointer text-sm'
      >
        {item.label}
      </label>
    </div>
  );
}

// ── Main field component ──────────────────────────────────────────────────────

export const TreeSelectField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const current: string[] = (watch(id) as string[]) ?? [];
  const [search, setSearch] = useState('');

  const cd = (field.fieldConfig?.customData ?? {}) as TreeSelectCustomData;
  const searchPlaceholder = cd.searchPlaceholder ?? 'Search...';
  const selectAllLabel = cd.selectAllLabel ?? 'Select all';
  const deselectAllLabel = cd.deselectAllLabel ?? 'Deselect all';

  const { data: nodes = [], isLoading } = useQuery<TreeSelectNode[]>({
    queryKey: cd.queryKey ?? ['tree-select', id],
    queryFn: cd.queryFn,
    staleTime: 1000 * 60 * 5,
  });

  const allGroups = useMemo(
    () => buildGroups(nodes, cd.groupKeyFn, cd.groupLabelFn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes],
  );

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return allGroups;
    const q = search.toLowerCase();
    return allGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [allGroups, search]);

  const allIds = nodes.map((n) => n.id);
  const allSelected = allIds.length > 0 && current.length === allIds.length;

  const setIds = (ids: string[]) =>
    setValue(id, ids, { shouldValidate: true, shouldDirty: true });

  const toggleItem = (nodeId: string) =>
    setIds(
      current.includes(nodeId)
        ? current.filter((v) => v !== nodeId)
        : [...current, nodeId],
    );

  const toggleGroup = (group: TreeGroup) => {
    const groupIds = group.items.map((i) => i.id);
    const allGroupSelected = groupIds.every((gid) => current.includes(gid));
    setIds(
      allGroupSelected
        ? current.filter((v) => !groupIds.includes(v))
        : [...new Set([...current, ...groupIds])],
    );
  };

  const toggleAll = () => setIds(allSelected ? [] : allIds);

  return (
    <div className='space-y-2'>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-2'>
        <div className='relative min-w-0 flex-1'>
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-8 pl-8 text-sm'
          />
          <svg
            className='absolute left-2.5 top-1/2 size-4 -translate-y-1/2
              text-muted-foreground'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
        </div>
        {!isLoading && (
          <span className='shrink-0 text-xs text-muted-foreground'>
            {current.length} / {allIds.length}
          </span>
        )}
        <button
          type='button'
          onClick={toggleAll}
          disabled={isLoading || allIds.length === 0}
          className='shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs
            font-medium text-secondary-foreground hover:bg-secondary/80
            disabled:opacity-50'
        >
          {allSelected ? deselectAllLabel : selectAllLabel}
        </button>
        {current.length > 0 && !allSelected && (
          <button
            type='button'
            onClick={() => setIds([])}
            className='shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs
              font-medium text-secondary-foreground hover:bg-secondary/80'
          >
            {deselectAllLabel}
          </button>
        )}
      </div>

      {/* Tree list */}
      <ScrollArea
        className={cn(
          'h-56 rounded-md border px-3 py-2',
          error ? 'border-destructive' : '',
        )}
      >
        {isLoading ? (
          <div
            className='flex items-center justify-center gap-2 py-8 text-sm
              text-muted-foreground'
          >
            <Loader2 className='size-4 animate-spin' />
            Loading…
          </div>
        ) : filteredGroups.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No results found.
          </p>
        ) : (
          <div className='space-y-1'>
            {filteredGroups.map((group) => (
              <GroupRow
                key={group.groupKey}
                group={group}
                selected={current}
                onToggleItem={toggleItem}
                onToggleGroup={toggleGroup}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
};
