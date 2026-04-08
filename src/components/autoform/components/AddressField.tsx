'use client';

import { AutoFormFieldProps } from '@autoform/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface AddressData {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  district?: string;
  ward?: string;
  detail?: string;
}

const parseAddress = (value: string | undefined | null): AddressData => {
  if (!value) return {};
  if (value.startsWith('{') && value.endsWith('}')) {
    // Try to parse as JSON first
    try {
      const content = value.slice(1, -1); // strip { and }
      // Split by standard props: name, phone, email, city, district, ward, detail
      // This regex creates chunks: [ "city", "Thành phố Hà Nội", "district", "Quận Đống Đa", ... ]
      const pairs = content
        .split(/,?\s*(name|phone|email|city|district|ward|detail)=/g)
        .filter(Boolean);

      const result: Record<string, string> = {};
      let currentKey: string | null = null;

      for (let i = 0; i < pairs.length; i++) {
        const token = pairs[i].trim();
        // Check if token is one of the known keys
        if (
          /^(name|phone|email|city|district|ward|detail)$/.test(token) &&
          !currentKey
        ) {
          currentKey = token;
        } else if (currentKey) {
          result[currentKey] = token;
          currentKey = null;
        }
      }

      // If parsing failed or was incomplete, fallback to JSON.parse
      if (Object.keys(result).length > 0) {
        return result as AddressData;
      }

      return JSON.parse(value);
    } catch {
      // Ignore
    }
  }
  return {};
};

const serializeAddress = (data: AddressData): string => {
  return `{city=${data.city || ''}, district=${data.district || ''}, ward=${data.ward || ''}, detail=${data.detail || ''}, email=${data.email || ''}, phone=${data.phone || ''}, name=${data.name || ''}}`;
};

export const AddressField: React.FC<AutoFormFieldProps> = ({
  error,
  id,
  inputProps,
}) => {
  const { watch, setValue } = useFormContext();
  const value = watch(id);
  const isDisabled = Boolean(inputProps?.disabled);

  // Derive address object from form value (it's string format underneath)
  const address = React.useMemo(() => {
    if (typeof value === 'string') {
      return parseAddress(value);
    }
    return {};
  }, [value]);

  const handleChange = (key: keyof AddressData, val: string) => {
    const next = { ...address, [key]: val };
    setValue(id, serializeAddress(next), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div
      className='grid grid-cols-1 gap-4 rounded-md border bg-muted/20 p-4
        md:grid-cols-3'
    >
      <div className='space-y-2'>
        <Label htmlFor={`${id}-name`} className='text-xs'>
          Họ và tên
        </Label>
        <Input
          id={`${id}-name`}
          value={address.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: Đặng văn thuật'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor={`${id}-phone`} className='text-xs'>
          Số điện thoại
        </Label>
        <Input
          id={`${id}-phone`}
          value={address.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: 0972990055'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor={`${id}-email`} className='text-xs'>
          Email
        </Label>
        <Input
          id={`${id}-email`}
          type='email'
          value={address.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: email@example.com'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor={`${id}-city`} className='text-xs'>
          Tỉnh / Thành phố
        </Label>
        <Input
          id={`${id}-city`}
          value={address.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: Thành phố Hà Nội'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor={`${id}-district`} className='text-xs'>
          Quận / Huyện
        </Label>
        <Input
          id={`${id}-district`}
          value={address.district || ''}
          onChange={(e) => handleChange('district', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: Quận Đống Đa'
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor={`${id}-ward`} className='text-xs'>
          Phường / Xã
        </Label>
        <Input
          id={`${id}-ward`}
          value={address.ward || ''}
          onChange={(e) => handleChange('ward', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: Phường Trung Liệt'
        />
      </div>

      <div className='col-span-1 space-y-2 md:col-span-3'>
        <Label htmlFor={`${id}-detail`} className='text-xs'>
          Địa chỉ chi tiết
        </Label>
        <Input
          id={`${id}-detail`}
          value={address.detail || ''}
          onChange={(e) => handleChange('detail', e.target.value)}
          disabled={isDisabled}
          placeholder='VD: Số 12a ngõ 171 Đặng tiến đông'
        />
      </div>

      {error && (
        <p className='col-span-1 text-xs text-destructive md:col-span-2'>
          {typeof error === 'string' ? error : String(error)}
        </p>
      )}
    </div>
  );
};
