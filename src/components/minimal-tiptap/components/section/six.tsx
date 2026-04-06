import * as React from 'react';
import type { Editor } from '@tiptap/react';
import '@tiptap/extension-text-align';
import type { FormatAction } from '../../types';
import type { toggleVariants } from '@/components/ui/toggle';
import type { VariantProps } from 'class-variance-authority';
import {
  CaretDownIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@radix-ui/react-icons';
import { ToolbarSection } from '../toolbar-section';

type AlignAction = 'alignLeft' | 'alignCenter' | 'alignRight';

interface AlignItem extends FormatAction {
  value: AlignAction;
}

const formatActions: AlignItem[] = [
  {
    value: 'alignLeft',
    label: 'Align left',
    icon: <TextAlignLeftIcon className='size-5' />,
    isActive: (editor) => editor.isActive({ textAlign: 'left' }),
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('left').run(),
    shortcuts: ['mod', 'shift', 'l'],
  },
  {
    value: 'alignCenter',
    label: 'Align center',
    icon: <TextAlignCenterIcon className='size-5' />,
    isActive: (editor) => editor.isActive({ textAlign: 'center' }),
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('center').run(),
    shortcuts: ['mod', 'shift', 'e'],
  },
  {
    value: 'alignRight',
    label: 'Align right',
    icon: <TextAlignRightIcon className='size-5' />,
    isActive: (editor) => editor.isActive({ textAlign: 'right' }),
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
    canExecute: (editor) =>
      editor.can().chain().focus().setTextAlign('right').run(),
    shortcuts: ['mod', 'shift', 'r'],
  },
];

interface SectionSixProps extends VariantProps<typeof toggleVariants> {
  editor: Editor;
  activeActions?: AlignAction[];
  mainActionCount?: number;
}

export const SectionSix: React.FC<SectionSixProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  mainActionCount = 0,
  size,
  variant,
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={
        <>
          <TextAlignLeftIcon className='size-5' />
          <CaretDownIcon className='size-5' />
        </>
      }
      dropdownTooltip='Text alignment'
      size={size}
      variant={variant}
    />
  );
};

SectionSix.displayName = 'SectionSix';

export default SectionSix;
