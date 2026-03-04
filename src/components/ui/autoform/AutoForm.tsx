import React from 'react';
import {
  AutoForm as BaseAutoForm,
  AutoFormUIComponents,
} from '@autoform/react';
import { AutoFormProps } from './types';
import { Form } from './components/Form';
import { FieldWrapper } from './components/FieldWrapper';
import { ErrorMessage } from './components/ErrorMessage';
import { SubmitButton } from './components/SubmitButton';
import { StringField } from './components/StringField';
import { NumberField } from './components/NumberField';
import { BooleanField } from './components/BooleanField';
import { DateField } from './components/DateField';
import { SelectField } from './components/SelectField';
import { TextareaField } from './components/TextareaField';
import { SwitchField } from './components/SwitchField';
import { RadioGroupField } from './components/RadioGroupField';
import { MultiCheckboxField } from './components/MultiCheckboxField';
import { MultiSelectField } from './components/MultiSelectField';
import { ComboboxField } from './components/ComboboxField';
import { SliderField } from './components/SliderField';
import { FileUploadField } from './components/FileUploadField';
import { AsyncComboboxField } from './components/AsyncComboboxField';
import { ObjectWrapper } from './components/ObjectWrapper';
import { ArrayWrapper } from './components/ArrayWrapper';
import { ArrayElementWrapper } from './components/ArrayElementWrapper';

const ShadcnUIComponents: AutoFormUIComponents = {
  Form,
  FieldWrapper,
  ErrorMessage,
  SubmitButton,
  ObjectWrapper,
  ArrayWrapper,
  ArrayElementWrapper,
};

export const ShadcnAutoFormFieldComponents = {
  string: StringField,
  number: NumberField,
  boolean: BooleanField,
  date: DateField,
  select: SelectField,
  textarea: TextareaField,
  switch: SwitchField,
  radio: RadioGroupField,
  'multi-checkbox': MultiCheckboxField,
  'multi-select': MultiSelectField,
  combobox: ComboboxField,
  slider: SliderField,
  'file-upload': FileUploadField,
  'async-combobox': AsyncComboboxField,
} as const;
export type FieldTypes = keyof typeof ShadcnAutoFormFieldComponents;

export function AutoForm<T extends Record<string, any>>({
  uiComponents,
  formComponents,
  ...props
}: AutoFormProps<T>) {
  return (
    <BaseAutoForm
      {...props}
      uiComponents={{ ...ShadcnUIComponents, ...uiComponents }}
      formComponents={{ ...ShadcnAutoFormFieldComponents, ...formComponents }}
    />
  );
}
