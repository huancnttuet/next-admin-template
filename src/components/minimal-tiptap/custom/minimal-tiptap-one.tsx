import '@/components/minimal-tiptap/styles/index.css';

import type { Content, Editor } from '@tiptap/react';
import type { UseMinimalTiptapEditorProps } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
import { cn } from '@/lib/utils';
import { SectionTwo } from '@/components/minimal-tiptap/components/section/two';
import { SectionSix } from '@/components/minimal-tiptap/components/section/six';
import { LinkBubbleMenu } from '@/components/minimal-tiptap/components/bubble-menu/link-bubble-menu';
import { useMinimalTiptapEditor } from '@/components/minimal-tiptap/hooks/use-minimal-tiptap';
import { MeasuredContainer } from '../components/measured-container';
import { Separator } from '@/components/ui/separator';

export interface MinimalTiptapProps extends Omit<
  UseMinimalTiptapEditorProps,
  'onUpdate'
> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className='flex h-12 shrink-0 overflow-x-auto border-b border-border p-2'>
    <div className='flex w-max items-center gap-px'>
      <SectionTwo
        editor={editor}
        activeActions={['bold', 'italic', 'underline', 'strikethrough', 'code']}
        mainActionCount={5}
      />

      <Separator orientation='vertical' className='mx-2' />

      <SectionSix
        editor={editor}
        activeActions={['alignLeft', 'alignCenter', 'alignRight']}
        mainActionCount={3}
      />
    </div>
  </div>
);

export const MinimalTiptapOne = ({
  value,
  onChange,
  className,
  editorContentClassName,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
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
        `shadow-xs flex h-auto min-h-48 w-full flex-col rounded-md border
        border-input`,
        `focus-within:border-ring focus-within:ring-[3px]
        focus-within:ring-ring/50`,
        className,
      )}
    >
      <Toolbar editor={editor} />

      <EditorContent
        editor={editor}
        className={cn('minimal-tiptap-editor', editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  );
};

MinimalTiptapOne.displayName = 'MinimalTiptapOne';

export default MinimalTiptapOne;
