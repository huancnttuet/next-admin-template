import '@/components/minimal-tiptap/styles/index.css';

import type { Content } from '@tiptap/react';
import type { UseMinimalTiptapEditorProps } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { useMinimalTiptapEditor } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap';
import { MeasuredContainer } from '../components/measured-container';

export interface MinimalTiptapProps extends Omit<
  UseMinimalTiptapEditorProps,
  'onUpdate'
> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

export const MinimalTiptapView = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    autofocus: false,
    editable: false,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <MeasuredContainer
      as='div'
      name='editor'
      className={cn(
        'shadow-xs flex h-auto min-h-48 w-full flex-col',
        `focus-within:border-ring focus-within:ring-[3px]
        focus-within:ring-ring/50`,
        className,
      )}
    >
      <EditorContent
        editor={editor}
        className={cn('minimal-tiptap-editor', editorContentClassName)}
      />
    </MeasuredContainer>
  );
};

MinimalTiptapView.displayName = 'MinimalTiptapView';
export default MinimalTiptapView;
