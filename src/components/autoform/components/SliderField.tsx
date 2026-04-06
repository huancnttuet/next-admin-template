'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Slider } from '@/components/ui/slider';

export const SliderField: React.FC<AutoFormFieldProps> = ({ error, id }) => {
  const { setValue, watch } = useFormContext();
  const current: number = (watch(id) as number) ?? 0;

  return (
    <div className='space-y-2'>
      <div className='flex justify-between text-xs text-muted-foreground'>
        <span>0</span>
        <span
          className={
            error
              ? 'font-medium text-destructive'
              : 'font-medium text-foreground'
          }
        >
          {current}
        </span>
        <span>100</span>
      </div>
      <Slider
        id={id}
        min={0}
        max={100}
        step={1}
        value={[current]}
        onValueChange={([val]) =>
          setValue(id, val, { shouldValidate: true, shouldDirty: true })
        }
        className={
          error ? '[&_[data-radix-slider-thumb]]:border-destructive' : ''
        }
      />
    </div>
  );
};
