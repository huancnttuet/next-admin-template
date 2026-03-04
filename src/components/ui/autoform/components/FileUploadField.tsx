'use client';

import { AutoFormFieldProps } from '@autoform/react';
import { FileIcon, ImageIcon, Trash2, UploadCloudIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FilePreview {
  file: File;
  objectUrl: string;
  isImage: boolean;
}

/**
 * customData options:
 *  - accept     : string   — MIME types / extensions, e.g. "image/*,application/pdf"
 *  - maxSizeMB  : number   — max file size in MB (default: 5)
 *  - multiple   : boolean  — allow multiple files (default: false)
 *  - maxFiles   : number   — max number of files when multiple=true (default: 5)
 */
interface FileUploadCustomData {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  maxFiles?: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const FileUploadField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const customData = (field.fieldConfig?.customData ??
    {}) as FileUploadCustomData;
  const accept = customData.accept ?? 'image/*,application/pdf';
  const maxSizeMB = customData.maxSizeMB ?? 5;
  const multiple = customData.multiple ?? false;
  const maxFiles = customData.maxFiles ?? 5;

  // RHF stores File[] so the parent form can read them on submit
  const currentFiles: FilePreview[] =
    (watch(id) as FilePreview[] | undefined) ?? [];

  const processFiles = (incoming: FileList | File[]) => {
    setSizeError(null);
    const files = Array.from(incoming);
    const oversized = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setSizeError(`"${oversized.name}" exceeds the ${maxSizeMB} MB limit.`);
      return;
    }

    const previews: FilePreview[] = files.map((f) => ({
      file: f,
      objectUrl: URL.createObjectURL(f),
      isImage: f.type.startsWith('image/'),
    }));

    const current = (watch(id) as FilePreview[] | undefined) ?? [];
    const next = multiple
      ? [...current, ...previews].slice(0, maxFiles)
      : previews.slice(0, 1);

    setValue(id, next, { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = (index: number) => {
    const updated = currentFiles.filter((_, i) => i !== index);
    URL.revokeObjectURL(currentFiles[index].objectUrl);
    setValue(id, updated, { shouldValidate: true, shouldDirty: true });
    setSizeError(null);
  };

  // Drag & drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processFiles(e.target.files);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const canAddMore = multiple
    ? currentFiles.length < maxFiles
    : currentFiles.length === 0;

  return (
    <div className='space-y-3'>
      {/* Drop zone — hidden when single-file mode and a file is already selected */}
      {canAddMore && (
        <div
          role='button'
          tabIndex={0}
          aria-label='Upload file'
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : error
                ? 'border-destructive bg-destructive/5'
                : 'border-border hover:border-primary/60 hover:bg-muted/40',
          )}
        >
          <UploadCloudIcon className='size-8 text-muted-foreground' />
          <div>
            <p className='text-sm font-medium'>
              Drag &amp; drop or{' '}
              <span className='text-primary underline-offset-2 hover:underline'>
                browse
              </span>
            </p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
              {accept
                .replace('application/pdf', 'PDF')
                .replace('image/*', 'Images')}{' '}
              — max {maxSizeMB} MB
              {multiple && ` · up to ${maxFiles} files`}
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        id={id}
        type='file'
        accept={accept}
        multiple={multiple}
        className='sr-only'
        onChange={onInputChange}
        aria-hidden='true'
      />

      {/* Size error */}
      {sizeError && <p className='text-xs text-destructive'>{sizeError}</p>}

      {/* Preview list */}
      {currentFiles.length > 0 && (
        <ul className='space-y-2'>
          {currentFiles.map((fp, idx) => (
            <li
              key={fp.objectUrl}
              className='flex items-center gap-3 rounded-md border bg-muted/30 p-2'
            >
              {/* Thumbnail / icon */}
              {fp.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fp.objectUrl}
                  alt={fp.file.name}
                  className='size-10 shrink-0 rounded object-cover'
                />
              ) : (
                <div className='flex size-10 shrink-0 items-center justify-center rounded bg-muted'>
                  {fp.file.type === 'application/pdf' ? (
                    <FileIcon className='size-5 text-red-500' />
                  ) : (
                    <ImageIcon className='size-5 text-muted-foreground' />
                  )}
                </div>
              )}

              {/* File name & size */}
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{fp.file.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {(fp.file.size / 1024).toFixed(0)} KB
                </p>
              </div>

              {/* Remove */}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7 shrink-0 text-muted-foreground hover:text-destructive'
                onClick={() => removeFile(idx)}
                aria-label={`Remove ${fp.file.name}`}
              >
                <Trash2 className='size-4' />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* "Add more" button in multiple mode when drop zone is hidden */}
      {multiple && currentFiles.length >= maxFiles && (
        <p className='text-xs text-muted-foreground'>
          Maximum of {maxFiles} files reached.
        </p>
      )}
    </div>
  );
};
