import React, { useEffect, useMemo } from 'react';
import { AutoFormFieldProps } from '@autoform/react';
import { Input } from '@/components/ui/input';
import { useFormContext, useWatch } from 'react-hook-form';

export const OrderTotalField: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
}) => {
  const { key, value, ...props } = inputProps;

  // Watch necessary fields for calculation
  const orderItems = useWatch({ name: 'orderItems' });
  const discount = useWatch({ name: 'discount' });
  const shippingCost = useWatch({ name: 'shippingCost' });

  const { setValue } = useFormContext();

  const calculatedTotal = useMemo(() => {
    const itemsArray = Array.isArray(orderItems) ? orderItems : [];
    const itemsTotal = itemsArray.reduce((acc, item) => {
      const qty = Number(item?.quantity) || 0;
      const price = Number(item?.price) || 0;
      return acc + qty * price;
    }, 0);

    const discountVal = Number(discount) || 0;
    const shippingVal = Number(shippingCost) || 0;

    return Math.max(0, itemsTotal + shippingVal - discountVal);
  }, [orderItems, discount, shippingCost]);

  useEffect(() => {
    // If the currently derived total doesn't match the set value, update it
    if (value !== calculatedTotal) {
      setValue(key as string, calculatedTotal, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [calculatedTotal, value, key, setValue]);

  return (
    <Input
      id={id}
      type='number'
      className={error ? 'border-destructive' : ''}
      {...props}
      value={calculatedTotal}
      readOnly
    />
  );
};
