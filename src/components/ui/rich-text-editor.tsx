'use client';

import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import { cn } from '@/lib/utils';
import MinimalTiptapOne from '../minimal-tiptap/custom/minimal-tiptap-one';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'minimal';
  readOnly?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  variant = 'default',
  readOnly = false,
}: RichTextEditorProps) {
  if (variant === 'minimal') {
    return (
      <MinimalTiptapOne
        value={value}
        onChange={(content) =>
          onChange(typeof content === 'string' ? content : '')
        }
        placeholder={placeholder}
        className={cn('rounded-md', className)}
        editorClassName='min-h-[140px] px-3 py-2 text-sm'
        editable={!readOnly}
      />
    );
  }

  return (
    <MinimalTiptapEditor
      value={value || ''}
      onChange={(content) =>
        onChange(typeof content === 'string' ? content : '')
      }
      output='html'
      placeholder={placeholder}
      className={cn(
        'rounded-md',
        readOnly && 'opacity-90 focus-within:ring-0',
        className,
      )}
      editorClassName='min-h-[140px] px-3 py-2'
      editable={!readOnly}
    />
  );
}
