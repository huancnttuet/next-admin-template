import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';
import {
  DISCOUNT_TYPE_VALUES,
  getDiscountTypeOptions,
} from './promocodes.type';

const dateSchema = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    const raw = String(value).trim();
    return raw.length === 0 ? undefined : raw;
  },
  z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Invalid date format',
    })
    .optional(),
);

function buildPromocodeFormBaseSchema(t: (key: string) => string) {
  return z.object({
    code: z
      .string({ required_error: t('fieldCodeRequired') })
      .min(1, { message: t('fieldCodeRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCode'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldCodePlaceholder') },
        }),
      ),
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldNamePlaceholder') },
        }),
      ),
    description: z
      .string()
      .optional()
      .default('')
      .superRefine(
        fieldConfig({
          label: t('fieldDescription'),
          fieldType: 'textarea',
          customData: {
            className: 'col-span-6',
          },
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
        }),
      ),
    discountType: z.enum(DISCOUNT_TYPE_VALUES).superRefine(
      fieldConfig({
        label: t('fieldDiscountType'),
        fieldType: 'select',
        customData: {
          className: 'col-span-3',
        },
        inputProps: {
          options: getDiscountTypeOptions(t),
        },
      }),
    ),
    discountValue: z.coerce
      .number({ message: t('fieldDiscountValueRequired') })
      .positive({ message: t('fieldDiscountValueMin') })
      .superRefine(
        fieldConfig({
          label: t('fieldDiscountValue'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldDiscountValuePlaceholder') },
        }),
      ),
    maxAmount: z.coerce
      .number()
      .nonnegative({ message: t('fieldMaxAmountMin') })
      .optional()
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldMaxAmount'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldMaxAmountPlaceholder') },
        }),
      ),
    minSpend: z.coerce
      .number()
      .nonnegative({ message: t('fieldMinSpendMin') })
      .optional()
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldMinSpend'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldMinSpendPlaceholder') },
        }),
      ),
    startDate: dateSchema.superRefine(
      fieldConfig({
        label: t('fieldStartDate'),
        inputProps: { type: 'date' },
        customData: {
          className: 'col-span-3',
        },
      }),
    ),
    endDate: dateSchema.superRefine(
      fieldConfig({
        label: t('fieldEndDate'),
        inputProps: { type: 'date' },
        customData: {
          className: 'col-span-3',
        },
      }),
    ),
    usageLimit: z.coerce
      .number()
      .int()
      .nonnegative({ message: t('fieldUsageLimitMin') })
      .optional()
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldUsageLimit'),
          customData: {
            className: 'col-span-3',
          },
          inputProps: { placeholder: t('fieldUsageLimitPlaceholder') },
        }),
      ),
    isActive: z
      .boolean()
      .default(true)
      .superRefine(
        fieldConfig({
          label: t('fieldActive'),
          customData: {
            className: 'col-span-3 mt-4',
          },
          fieldType: 'switch',
        }),
      ),
  });
}

function withPromocodeFormRefinement<T extends z.ZodTypeAny>(
  schema: T,
  t: (key: string) => string,
) {
  return schema.superRefine((value, context) => {
    const hasStartDate = typeof value.startDate === 'string';
    const hasEndDate = typeof value.endDate === 'string';

    if (hasStartDate && hasEndDate) {
      const start = new Date(value.startDate).getTime();
      const end = new Date(value.endDate).getTime();

      if (!Number.isNaN(start) && !Number.isNaN(end) && end < start) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: t('fieldEndDateInvalid'),
        });
      }
    }

    if (value.discountType === 'percent' && value.discountValue > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discountValue'],
        message: t('fieldDiscountValuePercentMax'),
      });
    }
  });
}

export function createPromocodeFormSchema(t: (key: string) => string) {
  return withPromocodeFormRefinement(buildPromocodeFormBaseSchema(t), t);
}

export function editPromocodeFormSchema(t: (key: string) => string) {
  return withPromocodeFormRefinement(
    buildPromocodeFormBaseSchema(t).extend({
      code: z
        .string({ required_error: t('fieldCodeRequired') })
        .min(1, { message: t('fieldCodeRequired') })
        .superRefine(
          fieldConfig({
            label: t('fieldCode'),
            inputProps: {
              placeholder: t('fieldCodePlaceholder'),
              readOnly: true,
              disabled: true,
            },
          }),
        ),
    }),
    t,
  );
}

export type CreatePromocodeFormInput = z.infer<
  ReturnType<typeof createPromocodeFormSchema>
>;

export type EditPromocodeFormInput = z.infer<
  ReturnType<typeof editPromocodeFormSchema>
>;
