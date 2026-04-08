import { z } from 'zod';

const discountTypeSchema = z.enum(['percent', 'fixed']);

const optionalDateStringSchema = z.preprocess(
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

const promocodeBaseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().default(''),
  discountType: discountTypeSchema,
  discountValue: z.coerce.number().positive(),
  maxAmount: z.coerce.number().nonnegative().default(0),
  minSpend: z.coerce.number().nonnegative().default(0),
  startDate: optionalDateStringSchema,
  endDate: optionalDateStringSchema,
  usageLimit: z.coerce.number().int().nonnegative().default(0),
  usedCount: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().optional().default(true),
});

function withPromocodeRefinement<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine((value, context) => {
    const hasStartDate = typeof value.startDate === 'string';
    const hasEndDate = typeof value.endDate === 'string';

    if (hasStartDate && hasEndDate) {
      const start = new Date(value.startDate).getTime();
      const end = new Date(value.endDate).getTime();

      if (end < start) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'End date must be greater than or equal to start date',
        });
      }
    }

    if (value.discountType === 'percent' && value.discountValue > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['discountValue'],
        message: 'Percent discount must be less than or equal to 100',
      });
    }
  });
}

export const createPromocodeSchema =
  withPromocodeRefinement(promocodeBaseSchema);

export const updatePromocodeSchema = withPromocodeRefinement(
  promocodeBaseSchema.omit({ code: true, usedCount: true }).partial(),
);
