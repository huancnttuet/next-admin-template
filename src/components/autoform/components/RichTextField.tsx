'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useController } from 'react-hook-form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

interface RichTextCustomData {
  placeholder?: string;
  variant?: 'default' | 'minimal';
}

export const RichTextField: React.FC<AutoFormFieldProps> = ({ id, field }) => {
  const { field: formField } = useController({ name: id });
  const customData = (field.fieldConfig?.customData ??
    {}) as RichTextCustomData;

  return (
    <RichTextEditor
      value={typeof formField.value === 'string' ? formField.value : ''}
      onChange={formField.onChange}
      placeholder={customData.placeholder}
      variant={customData.variant ?? 'default'}
    />
  );
};
