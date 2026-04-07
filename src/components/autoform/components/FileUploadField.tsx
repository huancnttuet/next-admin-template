'use client';

import { AutoFormFieldProps } from '@autoform/react';
import {
  FileIcon,
  Loader2,
  Trash2,
  UploadCloudIcon,
  VideoIcon,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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

type UploadedFileValue = string;

interface PendingUploadItem {
  id: string;
  name: string;
  previewUrl?: string;
  isVideo: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const FileUploadField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  console.log(`🚀${(new Date()).toString()} ~ FileUploadField ~ id:`, id)
  const { setValue, watch, getValues } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUploadItem[]>([]);

  const customData = (field.fieldConfig?.customData ??
    {}) as FileUploadCustomData;
  const accept = customData.accept ?? 'image/*,application/pdf';
  const maxSizeMB = customData.maxSizeMB ?? 5;
  const multiple = customData.multiple ?? false;
  const maxFiles = customData.maxFiles ?? 5;
  const isVideoField = accept.includes('video');

  const currentValues = (
    (watch(id) as UploadedFileValue[] | undefined) ?? []
  ).filter(Boolean);
  const currentCount = currentValues.length + pendingUploads.length;

  const currentFiles = currentValues.map((value) => ({
    value,
    isVideo: isVideoField,
    isImage: !isVideoField,
  }));

  const processFiles = async (incoming: FileList | File[]) => {
    setSizeError(null);
    const files = Array.from(incoming);
    const oversized = files.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (oversized) {
      setSizeError(`"${oversized.name}" exceeds the ${maxSizeMB} MB limit.`);
      return;
    }

    const existingValues = (
      (getValues(id) as UploadedFileValue[] | undefined) ?? []
    ).filter(Boolean);
    const availableSlots = multiple
      ? Math.max(maxFiles - existingValues.length - pendingUploads.length, 0)
      : existingValues.length === 0 && pendingUploads.length === 0
        ? 1
        : 0;

    if (availableSlots <= 0) {
      setSizeError(
        multiple
          ? `Maximum of ${maxFiles} files reached.`
          : 'Only one file can be selected.',
      );
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    const pendingItems: PendingUploadItem[] = filesToUpload.map(
      (file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        name: file.name,
        previewUrl: file.type.startsWith('image/')
          ? URL.createObjectURL(file)
          : undefined,
        isVideo: file.type.startsWith('video/'),
      }),
    );

    setPendingUploads((current) =>
      multiple ? [...current, ...pendingItems] : pendingItems.slice(0, 1),
    );

    try {
      const uploadedUrls: string[] = [];

      for (const pendingItem of pendingItems) {
        const file = filesToUpload.find(
          (candidate) => candidate.name === pendingItem.name,
        );
        if (!file) continue;

        const uploadedUrl = await uploadFileToCloudinary(file);
        uploadedUrls.push(uploadedUrl);

        setValue(
          id,
          multiple ? [...existingValues, ...uploadedUrls] : [uploadedUrl],
          { shouldValidate: true, shouldDirty: true },
        );

        setPendingUploads((current) =>
          current.filter((item) => item.id !== pendingItem.id),
        );
        if (pendingItem.previewUrl) URL.revokeObjectURL(pendingItem.previewUrl);
      }
    } finally {
      setPendingUploads((current) => {
        current.forEach((item) => {
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        return [];
      });
    }
  };

  const removeFile = (index: number) => {
    const updated = currentValues.filter((_, i) => i !== index);
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
    if (e.dataTransfer.files.length) void processFiles(e.dataTransfer.files);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) void processFiles(e.target.files);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const canAddMore = multiple ? currentCount < maxFiles : currentCount === 0;

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
            `flex cursor-pointer flex-col items-center justify-center gap-2
            rounded-lg border-2 border-dashed p-6 text-center transition-colors`,
            pendingUploads.length > 0
              ? 'cursor-wait border-primary/60 bg-primary/5'
              : isDragging
                ? 'border-primary bg-primary/5'
                : error
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border hover:border-primary/60 hover:bg-muted/40',
          )}
        >
          <UploadCloudIcon className='size-8 text-muted-foreground' />
          <div>
            <p className='text-sm font-medium'>
              {pendingUploads.length > 0
                ? 'Uploading...'
                : 'Drag drop or'}{' '}
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

      {/* Pending uploads */}
      {pendingUploads.length > 0 && (
        <ul className='space-y-2'>
          {pendingUploads.map((item) => (
            <li
              key={item.id}
              className='flex items-center gap-3 rounded-md border bg-muted/30
                p-2'
            >
              {item.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className='size-10 shrink-0 rounded object-cover'
                />
              ) : item.isVideo ? (
                <div
                  className='flex size-10 shrink-0 items-center justify-center
                    rounded bg-muted'
                >
                  <VideoIcon className='size-5 text-muted-foreground' />
                </div>
              ) : (
                <div
                  className='flex size-10 shrink-0 items-center justify-center
                    rounded bg-muted'
                >
                  <FileIcon className='size-5 text-muted-foreground' />
                </div>
              )}

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{item.name}</p>
                <p
                  className='flex items-center gap-1 text-xs
                    text-muted-foreground'
                >
                  <Loader2 className='size-3 animate-spin' /> Uploading...
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Preview list */}
      {currentFiles.length > 0 && (
        <ul className='space-y-2'>
          {currentFiles.map((fp, idx) => (
            <li
              key={`${fp.value}-${idx}`}
              className='flex items-center gap-3 rounded-md border bg-muted/30
                p-2'
            >
              {/* Thumbnail / icon */}
              {fp.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={fp.value}
                  alt={`Uploaded file ${idx + 1}`}
                  className='size-10 shrink-0 rounded object-cover'
                />
              ) : fp.isVideo ? (
                <div
                  className='flex size-10 shrink-0 items-center justify-center
                    rounded bg-muted'
                >
                  <VideoIcon className='size-5 text-muted-foreground' />
                </div>
              ) : (
                <div
                  className='flex size-10 shrink-0 items-center justify-center
                    rounded bg-muted'
                >
                  <FileIcon className='size-5 text-muted-foreground' />
                </div>
              )}

              {/* File name & size */}
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{fp.value}</p>
                <p className='text-xs text-muted-foreground'>
                  Uploaded to Cloudinary
                </p>
              </div>

              {/* Remove */}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7 shrink-0 text-muted-foreground
                  hover:text-destructive'
                onClick={() => removeFile(idx)}
                aria-label={`Remove uploaded file ${idx + 1}`}
                disabled={pendingUploads.length > 0}
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
