'use client';

import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useLocale } from 'next-intl';
import { AutoFormFieldProps } from '@autoform/react';
import { format, parse, isWeekend } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import * as chrono from 'chrono-node';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const DATE_STORAGE_FORMAT = 'yyyy-MM-dd'; // internal value stored in RHF
const DATE_DISPLAY_FORMAT = 'dd/MM/yyyy'; // shown to the user

/**
 * DateField — text input + calendar popover:
 *  - Type a date directly (dd/MM/yyyy or natural language, parsed by chrono-node)
 *  - Click the calendar icon to open the picker
 *  - dd/MM/yyyy display format, yyyy-MM-dd internal storage
 *  - Locale-aware month/weekday names (en / vi) via next-intl useLocale()
 *  - Year + month dropdown navigation (captionLayout="dropdown")
 *  - customData options: min, max, disableWeekends, disabledDates, defaultMonth, placeholder
 */
export const DateField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const locale = useLocale();

  const dateFnsLocale = locale === 'vi' ? vi : enUS;
  // chrono parser: use en.GB for dd/mm/yyyy parsing order
  const chronoParser = chrono.en.GB;

  // ── customData options ───────────────────────────────────────────────────────
  const customData = (field.fieldConfig?.customData ?? {}) as Record<
    string,
    unknown
  >;

  const minDate: Date | undefined = customData.min
    ? parse(customData.min as string, DATE_STORAGE_FORMAT, new Date())
    : undefined;
  const maxDate: Date | undefined = customData.max
    ? parse(customData.max as string, DATE_STORAGE_FORMAT, new Date())
    : undefined;
  const disabledDates: Date[] = (
    (customData.disabledDates as string[]) ?? []
  ).map((d) => parse(d, DATE_STORAGE_FORMAT, new Date()));
  const defaultMonth: Date | undefined = customData.defaultMonth
    ? parse(customData.defaultMonth as string, DATE_STORAGE_FORMAT, new Date())
    : undefined;
  const placeholder =
    (customData.placeholder as string) ?? DATE_DISPLAY_FORMAT.toLowerCase();

  // ── RHF value (stored as 'yyyy-MM-dd') ───────────────────────────────────────
  const rawValue = watch(id) as string | undefined;
  const selected: Date | undefined = rawValue
    ? parse(rawValue, DATE_STORAGE_FORMAT, new Date())
    : undefined;

  // ── Local state ──────────────────────────────────────────────────────────────
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState(
    selected
      ? format(selected, DATE_DISPLAY_FORMAT, { locale: dateFnsLocale })
      : '',
  );
  const [calendarMonth, setCalendarMonth] = useState<Date | undefined>(
    selected ?? defaultMonth,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Disabled matchers ────────────────────────────────────────────────────────
  type Matcher =
    | ((d: Date) => boolean)
    | { before: Date }
    | { after: Date }
    | Date;
  const disabledMatcher: Matcher[] = [...disabledDates];
  if (minDate) disabledMatcher.push({ before: minDate });
  if (maxDate) disabledMatcher.push({ after: maxDate });
  if (customData.disableWeekends)
    disabledMatcher.push((d: Date) => isWeekend(d));

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const commitDate = (date: Date | undefined) => {
    setValue(id, date ? format(date, DATE_STORAGE_FORMAT) : undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and separators
    const sanitized = e.target.value.replace(/[^0-9/\-]/g, '');
    e.target.value = sanitized;
    setInputText(sanitized);

    const parsed = chronoParser.parseDate(sanitized);
    if (parsed) {
      setCalendarMonth(parsed);
      commitDate(parsed);
    }
  };

  const handleCalendarSelect = (day: Date | undefined) => {
    commitDate(day);
    const display = day
      ? format(day, DATE_DISPLAY_FORMAT, { locale: dateFnsLocale })
      : '';
    setInputText(display);
    if (inputRef.current) inputRef.current.value = display;
    setCalendarMonth(day);
    setOpen(false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];
    if (allowed.includes(e.key)) return;
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
    if (!/^[0-9/\-]$/.test(e.key)) e.preventDefault();
  };

  return (
    <div className='relative flex items-center' ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <Input
          id={id}
          ref={inputRef}
          defaultValue={inputText}
          placeholder={placeholder}
          className={cn('pr-9', error && 'border-destructive')}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <PopoverTrigger asChild>
          <button
            type='button'
            className='absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md p-1 hover:bg-accent'
            tabIndex={-1}
          >
            <CalendarIcon className='size-4 text-muted-foreground' />
            <span className='sr-only'>Open calendar</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            if (containerRef.current?.contains(e.target as Node))
              e.preventDefault();
          }}
        >
          <Calendar
            mode='single'
            selected={selected}
            onSelect={handleCalendarSelect}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            defaultMonth={selected ?? defaultMonth}
            disabled={disabledMatcher.length ? disabledMatcher : undefined}
            captionLayout='dropdown'
            locale={dateFnsLocale}
            startMonth={minDate ?? new Date(1900, 0)}
            endMonth={maxDate ?? new Date(2100, 11)}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
