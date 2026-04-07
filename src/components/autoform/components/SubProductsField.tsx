'use client';

import { AutoFormFieldProps } from '@autoform/react';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileUploadField } from './FileUploadField';
import { NumberField } from './NumberField';
import { StringField } from './StringField';

interface SubProductFormValue {
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  quantity?: number;
}

interface SubProductsCustomData {
  addButtonText?: string;
}

function createEmptySubProduct(): SubProductFormValue {
  return {
    name: '',
    price: 0,
    originalPrice: undefined,
    image: '',
    quantity: 0,
  };
}

interface SubProductImageUploadProps {
  formId: string;
  index: number;
  image: string | undefined;
  isDisabled: boolean;
  watch: ReturnType<typeof useFormContext>['watch'];
  setValue: ReturnType<typeof useFormContext>['setValue'];
  onImageChange: (index: number, nextValue: string) => void;
}

function SubProductImageUpload({
  formId,
  index,
  image,
  isDisabled,
  watch,
  setValue,
  onImageChange,
}: SubProductImageUploadProps) {
  const uploadFieldId = `${formId}.${index}.__imageUpload`;
  const uploadedImageValues = watch(uploadFieldId) as string[] | undefined;
  const initializedFieldRef = React.useRef<string | null>(null);
  const onImageChangeRef = React.useRef(onImageChange);

  React.useEffect(() => {
    onImageChangeRef.current = onImageChange;
  }, [onImageChange]);

  React.useEffect(() => {
    if (initializedFieldRef.current === uploadFieldId) return;
    initializedFieldRef.current = uploadFieldId;

    const nextUploadValues =
      typeof image === 'string' && image.length > 0 ? [image] : [];

    setValue(uploadFieldId, nextUploadValues, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [image, setValue, uploadFieldId]);

  React.useEffect(() => {
    if (!Array.isArray(uploadedImageValues)) return;

    const latestUploadedImage =
      uploadedImageValues[uploadedImageValues.length - 1] ?? '';
    const normalizedImage = typeof image === 'string' ? image : '';

    if (latestUploadedImage === normalizedImage) return;

    onImageChangeRef.current(index, latestUploadedImage);
  }, [image, index, uploadedImageValues]);

  return (
    <div className='space-y-2'>
      <FileUploadField
        {...({
          id: uploadFieldId,
          label: '',
          value: typeof image === 'string' && image.length > 0 ? [image] : [],
          path: uploadFieldId,
          field: {
            fieldConfig: {
              customData: {
                accept: 'image/*',
                maxSizeMB: 10,
                multiple: false,
                maxFiles: 1,
              },
            },
          } as unknown as AutoFormFieldProps['field'],
          error: undefined,
          inputProps: { disabled: isDisabled },
        } as unknown as AutoFormFieldProps)}
      />
    </div>
  );
}

export const SubProductsField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
  inputProps,
}) => {
  const t = useTranslations('products');
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const isDisabled = Boolean(inputProps?.disabled);

  const customData =
    (field.fieldConfig?.customData as SubProductsCustomData) ?? {};

  const watchedValue = watch(id) as SubProductFormValue[] | undefined;
  const current = React.useMemo(
    () => (Array.isArray(watchedValue) ? watchedValue : []),
    [watchedValue],
  );

  const getFieldError = (
    index: number,
    key: keyof SubProductFormValue,
  ): string | undefined => {
    const fieldErrors = (errors as Record<string, unknown>)[id] as
      | Array<Record<string, { message?: string }>>
      | undefined;
    return fieldErrors?.[index]?.[key]?.message;
  };

  const addSubProduct = () => {
    setValue(id, [...current, createEmptySubProduct()], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeSubProduct = (index: number) => {
    setValue(
      id,
      current.filter((_, itemIndex) => itemIndex !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const updateField = (
    index: number,
    key: keyof SubProductFormValue,
    nextValue: string,
  ) => {
    const next = current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;

      if (key === 'price' || key === 'quantity') {
        const parsed = Number(nextValue);
        return {
          ...item,
          [key]: Number.isFinite(parsed) ? parsed : 0,
        };
      }

      if (key === 'originalPrice') {
        if (nextValue.trim().length === 0) {
          return {
            ...item,
            originalPrice: undefined,
          };
        }

        const parsed = Number(nextValue);
        return {
          ...item,
          originalPrice: Number.isFinite(parsed) ? parsed : 0,
        };
      }

      return {
        ...item,
        [key]: nextValue,
      };
    });

    setValue(id, next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const renderStringField = (options: {
    fieldId: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    hasError: boolean;
  }) => {
    const props = {
      id: options.fieldId,
      label: '',
      value: options.value,
      path: options.fieldId,
      field: { fieldConfig: {} } as unknown as AutoFormFieldProps['field'],
      error: options.hasError ? 'error' : undefined,
      inputProps: {
        value: options.value,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          options.onChange(event.target.value),
        placeholder: options.placeholder,
        disabled: isDisabled,
      },
    } as unknown as AutoFormFieldProps;

    return <StringField {...props} />;
  };

  const renderNumberField = (options: {
    fieldId: string;
    value: number | undefined;
    onChange: (value: string) => void;
    placeholder: string;
    hasError: boolean;
  }) => {
    const props = {
      id: options.fieldId,
      label: '',
      value: options.value ?? 0,
      path: options.fieldId,
      field: { fieldConfig: {} } as unknown as AutoFormFieldProps['field'],
      error: options.hasError ? 'error' : undefined,
      inputProps: {
        value: options.value ?? 0,
        onChange: options.onChange,
        min: 0,
        step: 1,
        placeholder: options.placeholder,
        disabled: isDisabled,
      },
    } as unknown as AutoFormFieldProps;

    return <NumberField {...props} />;
  };

  return (
    <div className='space-y-3'>
      {error && (
        <p className='text-xs text-destructive'>
          {typeof error === 'string' ? error : String(error)}
        </p>
      )}

      <div className='mb-1 flex items-center justify-between'>
        <div>
          <p className='text-xs text-muted-foreground'>
            {t('subProductsDescription')}
          </p>
        </div>
      </div>

      {current.length === 0 ? (
        <div
          className='rounded-md border border-dashed p-3 text-sm
            text-muted-foreground'
        >
          {t('subProductsEmpty')}
        </div>
      ) : (
        <div className='space-y-3'>
          {current.map((subProduct, index) => (
            <div key={index} className='rounded-md border p-3'>
              <div className='mb-3 flex items-center justify-between'>
                <p className='text-sm font-medium'>
                  {t('subProductItemTitle', { index: index + 1 })}
                </p>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => removeSubProduct(index)}
                  disabled={isDisabled}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>

              <div className='grid gap-3 md:grid-cols-4'>
                <div className='space-y-1'>
                  <Label>{t('fieldSubProductName')}</Label>
                  {renderStringField({
                    fieldId: `${id}.${index}.name`,
                    value: subProduct.name ?? '',
                    onChange: (value) => updateField(index, 'name', value),
                    placeholder: t('fieldSubProductNamePlaceholder'),
                    hasError: Boolean(getFieldError(index, 'name')),
                  })}
                  {getFieldError(index, 'name') && (
                    <p className='text-xs text-destructive'>
                      {getFieldError(index, 'name')}
                    </p>
                  )}
                </div>

                <div className='space-y-1'>
                  <Label>{t('fieldSubProductPrice')}</Label>
                  {renderNumberField({
                    fieldId: `${id}.${index}.price`,
                    value:
                      typeof subProduct.price === 'number'
                        ? subProduct.price
                        : 0,
                    onChange: (value) => updateField(index, 'price', value),
                    placeholder: t('fieldSubProductPricePlaceholder'),
                    hasError: Boolean(getFieldError(index, 'price')),
                  })}
                  {getFieldError(index, 'price') && (
                    <p className='text-xs text-destructive'>
                      {getFieldError(index, 'price')}
                    </p>
                  )}
                </div>
                <div className='space-y-1'>
                  <Label>{t('fieldSubProductOriginalPrice')}</Label>
                  {renderNumberField({
                    fieldId: `${id}.${index}.originalPrice`,
                    value:
                      typeof subProduct.originalPrice === 'number'
                        ? subProduct.originalPrice
                        : undefined,
                    onChange: (value) =>
                      updateField(index, 'originalPrice', value),
                    placeholder: t('fieldSubProductOriginalPricePlaceholder'),
                    hasError: Boolean(getFieldError(index, 'originalPrice')),
                  })}
                  {getFieldError(index, 'originalPrice') && (
                    <p className='text-xs text-destructive'>
                      {getFieldError(index, 'originalPrice')}
                    </p>
                  )}
                </div>
                <div className='space-y-1'>
                  <Label>{t('fieldSubProductQuantity')}</Label>
                  {renderNumberField({
                    fieldId: `${id}.${index}.quantity`,
                    value:
                      typeof subProduct.quantity === 'number'
                        ? subProduct.quantity
                        : 0,
                    onChange: (value) => updateField(index, 'quantity', value),
                    placeholder: t('fieldSubProductQuantityPlaceholder'),
                    hasError: Boolean(getFieldError(index, 'quantity')),
                  })}
                  {getFieldError(index, 'quantity') && (
                    <p className='text-xs text-destructive'>
                      {getFieldError(index, 'quantity')}
                    </p>
                  )}
                </div>
              </div>

              <div className='space-y-1 pt-2'>
                <Label>{t('fieldSubProductImage')}</Label>
                <SubProductImageUpload
                  formId={id}
                  index={index}
                  image={subProduct.image}
                  isDisabled={isDisabled}
                  watch={watch}
                  setValue={setValue}
                  onImageChange={(rowIndex, value) =>
                    updateField(rowIndex, 'image', value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='py-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addSubProduct}
          disabled={isDisabled}
        >
          <Plus className='mr-1 h-4 w-4' />
          {customData.addButtonText ?? t('addSubProduct')}
        </Button>
      </div>
    </div>
  );
};
