'use client';

import { AutoFormFieldProps } from '@autoform/react';
import {
  ChevronLeft,
  ChevronRight,
  FileIcon,
  Loader2,
  Play,
  Trash2,
  UploadCloudIcon,
  VideoIcon,
  X,
  ZoomIn,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

// ── VideoThumbnail ────────────────────────────────────────────────────────────

/** Transforms a Cloudinary video URL into a thumbnail image URL. */
function getCloudinaryThumbnail(url: string): string | null {
  // Matches: https://res.cloudinary.com/{cloud}/{resource_type}/upload/(...){ext}
  const match = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+\/)[^/]+(\/upload\/)(.*?)(\.[^.]+)$/,
  );
  if (!match) return null;
  // Replace resource_type segment with 'video', inject so_1 transform, swap extension to .jpg
  return `${match[1]}video${match[2]}so_1,w_160,h_160,c_fill/${match[3]}.jpg`;
}

const VideoThumbnail: React.FC<{ src: string }> = ({ src }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(() =>
    getCloudinaryThumbnail(src),
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas capture fallback — only used when Cloudinary transform is not available
  useEffect(() => {
    if (thumbnail) return; // already resolved via Cloudinary
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const capture = () => {
      canvas.width = video.videoWidth || 160;
      canvas.height = video.videoHeight || 90;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL('image/jpeg', 0.7));
    };

    const onSeeked = () => capture();
    const onLoaded = () => { video.currentTime = 1; };

    video.addEventListener('loadeddata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    video.src = src;
    video.load();

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [src, thumbnail]);

  if (thumbnail) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnail}
        alt='Video thumbnail'
        className='size-full object-cover'
      />
    );
  }

  return (
    <>
      {/* Hidden video + canvas used only as canvas-capture fallback */}
      <video ref={videoRef} className='sr-only' crossOrigin='anonymous' preload='metadata' />
      <canvas ref={canvasRef} className='sr-only' />
      <VideoIcon className='size-5 text-muted-foreground' />
    </>
  );
};

// ── MediaLightbox ─────────────────────────────────────────────────────────────

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaLightboxProps {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

const MediaLightbox: React.FC<MediaLightboxProps> = ({ items, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);

  const goNext = useCallback(
    () => setCurrent((i) => (i + 1) % items.length),
    [items.length],
  );
  const goPrev = useCallback(
    () => setCurrent((i) => (i - 1 + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goNext, goPrev]);

  const item = items[current];

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-label='Media preview'
    >
      {/* Close */}
      <button
        type='button'
        onClick={onClose}
        className='absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25'
        aria-label='Close preview'
      >
        <X className='size-5' />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className='absolute left-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25'
          aria-label='Previous media'
        >
          <ChevronLeft className='size-5' />
        </button>
      )}

      {/* Media */}
      <div className='flex max-h-[90vh] max-w-[90vw] items-center justify-center' onClick={(e) => e.stopPropagation()}>
        {item.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.url}
            src={item.url}
            alt={`Preview ${current + 1}`}
            className='max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl'
          />
        ) : (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            className='max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl'
          />
        )}
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          type='button'
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className='absolute right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25'
          aria-label='Next media'
        >
          <ChevronRight className='size-5' />
        </button>
      )}

      {/* Counter */}
      {items.length > 1 && (
        <p className='absolute bottom-4 text-sm text-white/70'>
          {current + 1} / {items.length}
        </p>
      )}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────

export const FileUploadField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
}) => {
  const { setValue, watch, getValues } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUploadItem[]>([]);
  const [mediaLightboxIndex, setMediaLightboxIndex] = useState<number | null>(null);

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
    type: (isVideoField ? 'video' : 'image') as 'image' | 'video',
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
              {fp.type === 'image' ? (
                <button
                  type='button'
                  className='group relative size-10 shrink-0 overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  onClick={() => setMediaLightboxIndex(idx)}
                  aria-label={`Preview image ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fp.value}
                    alt={`Uploaded file ${idx + 1}`}
                    className='size-10 rounded object-cover transition group-hover:brightness-75'
                  />
                  <ZoomIn className='absolute inset-0 m-auto size-4 text-white opacity-0 transition group-hover:opacity-100' />
                </button>
              ) : fp.type === 'video' ? (
                <button
                  type='button'
                  className='group relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                  onClick={() => setMediaLightboxIndex(idx)}
                  aria-label={`Preview video ${idx + 1}`}
                >
                  <VideoThumbnail src={fp.value} />
                  {/* Dark overlay so Play icon is visible on any thumbnail color */}
                  <div className='absolute inset-0 bg-black/0 transition group-hover:bg-black/45' />
                  <Play className='absolute inset-0 m-auto size-5 fill-white text-white opacity-0 drop-shadow transition group-hover:opacity-100' />
                </button>
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

      {/* MediaLightbox */}
      {mediaLightboxIndex !== null && (() => {
        const mediaItems = currentFiles.map((f) => ({ url: f.value, type: f.type }));
        return (
          <MediaLightbox
            items={mediaItems}
            initialIndex={mediaLightboxIndex}
            onClose={() => setMediaLightboxIndex(null)}
          />
        );
      })()}
    </div>
  );
};
