'use client';

import { Download, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ORDER_QUERY_KEY } from '@/features/orders';

interface ImportFailure {
  row: number;
  code?:
    | 'empty_row_skipped'
    | 'validation_failed'
    | 'duplicate_order'
    | 'insert_failed'
    | 'imported_success';
  message: string;
  orderId?: string;
}

interface ImportDoneEvent {
  type: 'done';
  totalRows: number;
  importedCount: number;
  failedCount: number;
  failures: ImportFailure[];
  resultFileName: string;
  resultFileBase64: string;
}

interface ImportProgressEvent {
  type: 'progress';
  processed: number;
  total: number;
  importedCount: number;
  failedCount: number;
  percent: number;
}

export function ImportOrdersButton() {
  const t = useTranslations('orders');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const templateUrl = '/assets/templates/order-import-template.xlsx';
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [failures, setFailures] = useState<ImportFailure[]>([]);
  const [importSummary, setImportSummary] = useState<{
    importedCount: number;
    failedCount: number;
  } | null>(null);
  const [resultFile, setResultFile] = useState<{
    name: string;
    url: string;
  } | null>(null);

  const getLocalizedFailureMessage = (failure: ImportFailure) => {
    switch (failure.code) {
      case 'duplicate_order':
        return t('importErrorDuplicate');
      case 'validation_failed':
        return t('importErrorValidation', { detail: failure.message });
      case 'insert_failed':
        return t('importErrorInsert', { detail: failure.message });
      default:
        return failure.message || t('importError');
    }
  };

  const decodeBase64ToBlob = (base64: string): Blob => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  };

  const toResultFileUrl = (base64: string) => {
    const blob = decodeBase64ToBlob(base64);
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    return () => {
      if (resultFile?.url) {
        URL.revokeObjectURL(resultFile.url);
      }
    };
  }, [resultFile?.url]);

  const resetDialogState = () => {
    setIsDragging(false);
    setIsImporting(false);
    setProgressPercent(0);
    setProgressText('');
    setSelectedFileName('');
    setFailures([]);
    setImportSummary(null);
    if (resultFile?.url) {
      URL.revokeObjectURL(resultFile.url);
    }
    setResultFile(null);
  };

  const runStreamingImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/orders/import?stream=true', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      try {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message || t('importError'));
      } catch {
        throw new Error(t('importError'));
      }
    }

    if (!response.body) {
      throw new Error(t('importError'));
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let doneEvent: ImportDoneEvent | null = null;
    let buffer = '';

    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;

      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const event = JSON.parse(trimmed) as
          | ImportProgressEvent
          | ImportDoneEvent
          | { type: 'error'; message: string }
          | { type: 'start'; total: number };

        if (event.type === 'progress') {
          setProgressPercent(event.percent);
          setProgressText(
            t('importProcessingDetail', {
              percent: event.percent,
              processed: event.processed,
              total: event.total,
            }),
          );
        }

        if (event.type === 'done') {
          doneEvent = event;
        }

        if (event.type === 'error') {
          throw new Error(event.message || t('importError'));
        }
      }
    }

    if (!doneEvent) {
      throw new Error(t('importError'));
    }

    return doneEvent;
  };

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.xlsx')) {
      toast.error(t('importInvalidFile'));
      return;
    }

    setSelectedFileName(file.name);
    setIsImporting(true);
    setProgressPercent(0);
    setProgressText('');
    setFailures([]);
    setImportSummary(null);
    if (resultFile?.url) {
      URL.revokeObjectURL(resultFile.url);
    }
    setResultFile(null);

    try {
      const result = await runStreamingImport(file);

      setImportSummary({
        importedCount: result.importedCount,
        failedCount: result.failedCount,
      });
      setFailures(result.failures);

      const resultUrl = toResultFileUrl(result.resultFileBase64);
      setResultFile({
        name: result.resultFileName,
        url: resultUrl,
      });

      await queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });

      if (result.importedCount > 0) {
        toast.success(
          t('importSuccess', {
            count: result.importedCount,
          }),
        );
      }

      if (result.failedCount > 0) {
        const firstFailure = result.failures[0];
        toast.error(
          t('importPartialFailed', {
            count: result.failedCount,
            detail: firstFailure
              ? getLocalizedFailureMessage(firstFailure)
              : t('importError'),
          }),
        );
      }

      if (result.importedCount === 0 && result.failedCount === 0) {
        toast.error(t('importEmptyFile'));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('importError'));
    } finally {
      setIsImporting(false);
      setProgressPercent(0);
      setProgressText('');
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    await handleImportFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    await handleImportFile(file);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !isImporting) {
          resetDialogState();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 font-normal'>
          <Upload className='mr-2 size-4' />
          {t('importButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('importDialogTitle')}</DialogTitle>
          <DialogDescription>{t('importDialogDescription')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-3'>
          <div
            role='button'
            tabIndex={0}
            onClick={handleOpenPicker}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleOpenPicker();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isImporting) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              `rounded-md border-2 border-dashed p-6 text-center
              transition-colors`,
              isDragging ? 'border-primary bg-primary/5' : 'border-border',
              isImporting && 'cursor-not-allowed opacity-70',
            )}
          >
            <p className='text-sm font-medium'>{t('importDropzoneTitle')}</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              {selectedFileName || t('importDropzoneDescription')}
            </p>
          </div>

          {isImporting && (
            <div className='space-y-1 rounded-md border p-2 text-xs'>
              <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full bg-primary transition-all'
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {progressText && <p className='font-medium'>{progressText}</p>}
            </div>
          )}

          {importSummary && (
            <div className='space-y-2 rounded-md border p-2 text-xs'>
              <p className='font-medium'>{t('importSummaryTitle')}</p>
              <p>
                {t('importSummarySuccess', {
                  count: importSummary.importedCount,
                })}
              </p>
              <p>
                {t('importSummaryFailed', { count: importSummary.failedCount })}
              </p>

              {resultFile && (
                <a
                  href={resultFile.url}
                  download={resultFile.name}
                  className='inline-flex items-center text-primary underline'
                >
                  <Download className='mr-1 size-3.5' />
                  {t('importDownloadResult')}
                </a>
              )}

              {failures.length > 0 && (
                <ul
                  className='max-h-40 space-y-1 overflow-auto text-destructive'
                >
                  {failures.map((failure) => (
                    <li key={`${failure.row}-${failure.orderId ?? 'unknown'}`}>
                      {t('importErrorRow', {
                        row: failure.row,
                        message: getLocalizedFailureMessage(failure),
                      })}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className='flex w-full justify-between'>
            <Button
              asChild
              variant='secondary'
              size='sm'
              className='h-8 w-fit font-normal'
            >
              <a href={templateUrl} download='order-import-template.xlsx'>
                <Download className='mr-2 size-4' />
                {t('importTemplateButton')}
              </a>
            </Button>

            <Button
              type='button'
              variant='outline'
              disabled={isImporting}
              onClick={() => setOpen(false)}
            >
              {t('cancel')}
            </Button>
          </div>
        </DialogFooter>

        <input
          ref={fileInputRef}
          type='file'
          accept='.xlsx'
          className='hidden'
          onChange={handleFileChange}
        />
      </DialogContent>
    </Dialog>
  );
}
