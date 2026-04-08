import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';
import { getOrderStatusOptions, ORDER_STATUS_VALUES } from './orders.type';

const orderItemSchema = z.object({
  productId: z.string().optional().default(''),
  productName: z.string().optional().default(''),
  quantity: z.coerce.number().int().nonnegative().default(1),
  price: z.coerce.number().nonnegative().default(0),
  image: z.string().optional().default(''),
  typeName: z.string().optional().default(''),
  _id: z.string().optional().default(''),
});

function buildOrderFormBaseSchema(t: (key: string) => string) {
  return z.object({
    orderId: z
      .string({ required_error: t('fieldOrderIdRequired') })
      .min(1, { message: t('fieldOrderIdRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldOrderId'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldOrderIdPlaceholder') },
        }),
      ),
    customer: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldCustomer'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldCustomerPlaceholder') },
        }),
      ),
    address: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldAddress'),
          fieldType: 'address-field',
          customData: {
            className: 'col-span-6',
          },
          inputProps: { placeholder: t('fieldAddressPlaceholder') },
        }),
      ),
    orderItems: z
      .array(orderItemSchema)
      .optional()
      .default([])
      .superRefine(
        fieldConfig({
          label: t('fieldOrderItems'),
          fieldType: 'order-items',
          customData: {
            className: 'col-span-6',
            addButtonText: t('orderItemsAddButton'),
          },
        }),
      ),
    note: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldNote'),
          fieldType: 'textarea',
          customData: {
            className: 'col-span-6',
          },
          inputProps: { placeholder: t('fieldNotePlaceholder') },
        }),
      ),
    discount: z.coerce
      .number()
      .nonnegative({ message: t('fieldDiscountMin') })
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldDiscount'),
          customData: {
            className: 'col-span-2',
          },
          inputProps: { placeholder: t('fieldDiscountPlaceholder') },
        }),
      ),
    shippingCost: z.coerce
      .number()
      .nonnegative({ message: t('fieldShippingCostMin') })
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldShippingCost'),
          customData: {
            className: 'col-span-2',
          },
          inputProps: { placeholder: t('fieldShippingCostPlaceholder') },
        }),
      ),
    total: z.coerce.number().superRefine(
      fieldConfig({
        label: t('fieldTotal'),
        fieldType: 'order-total',
        customData: {
          className: 'col-span-2',
        },
        inputProps: {
          placeholder: t('fieldTotalPlaceholder'),
        },
      }),
    ),
    status: z.enum(ORDER_STATUS_VALUES).superRefine(
      fieldConfig({
        label: t('fieldStatus'),
        fieldType: 'select',
        customData: {
          className: 'col-span-3',
        },
        inputProps: {
          options: getOrderStatusOptions(t),
        },
      }),
    ),
    isReviewed: z
      .boolean()
      .default(false)
      .superRefine(
        fieldConfig({
          label: t('fieldReviewed'),
          fieldType: 'switch',
          customData: {
            className: 'col-span-3 mt-4',
          },
        }),
      ),
  });
}

export function createOrderFormSchema(t: (key: string) => string) {
  return buildOrderFormBaseSchema(t);
}

export function editOrderFormSchema(t: (key: string) => string) {
  return buildOrderFormBaseSchema(t).extend({
    orderId: z
      .string({ required_error: t('fieldOrderIdRequired') })
      .min(1, { message: t('fieldOrderIdRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldOrderId'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: {
            placeholder: t('fieldOrderIdPlaceholder'),
            readOnly: true,
            disabled: true,
          },
        }),
      ),
  });
}

export type CreateOrderFormInput = z.infer<
  ReturnType<typeof createOrderFormSchema>
>;

export type EditOrderFormInput = z.infer<
  ReturnType<typeof editOrderFormSchema>
>;
