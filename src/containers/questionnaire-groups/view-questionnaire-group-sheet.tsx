'use client';

import { useTranslations } from 'next-intl';
import { Hash, Tag, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useQuestionnaireGroupDetail } from '@/services/questionnaire-groups';

interface ViewQuestionnaireGroupSheetProps {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewQuestionnaireGroupSheet({
  id,
  open,
  onOpenChange,
}: ViewQuestionnaireGroupSheetProps) {
  const t = useTranslations('questionnaireGroups');
  const { data, isLoading } = useQuestionnaireGroupDetail(id ?? '');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex flex-col gap-0 sm:max-w-md'>
        <SheetHeader className='pb-4'>
          <SheetTitle>
            {isLoading ? (
              <Skeleton className='h-6 w-40' />
            ) : (
              (data?.name ?? t('detailTitle'))
            )}
          </SheetTitle>
          <SheetDescription>{t('detailDescription')}</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className='flex flex-col gap-6 overflow-y-auto py-6'>
          {isLoading ? (
            <div className='flex flex-col gap-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='flex flex-col gap-1.5'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-5 w-full' />
                </div>
              ))}
            </div>
          ) : (
            <>
              <DetailRow
                icon={<Hash className='h-4 w-4 text-muted-foreground' />}
                label={t('colId')}
                value={
                  <span className='break-all font-mono text-xs'>
                    {data?.id}
                  </span>
                }
              />
              <DetailRow
                icon={<FileText className='h-4 w-4 text-muted-foreground' />}
                label={t('colName')}
                value={<span className='font-medium'>{data?.name}</span>}
              />
              <DetailRow
                icon={<Tag className='h-4 w-4 text-muted-foreground' />}
                label={t('colCode')}
                value={<span className='font-mono text-sm'>{data?.code}</span>}
              />
              <DetailRow
                label={t('colQuestionnaireCount')}
                value={
                  <span className='text-muted-foreground'>
                    {data?.questionnaireCount}
                  </span>
                }
              />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-1.5'>
      <div className='flex items-center gap-1.5 text-sm text-muted-foreground'>
        {icon}
        {label}
      </div>
      <div className='text-sm'>{value}</div>
    </div>
  );
}
