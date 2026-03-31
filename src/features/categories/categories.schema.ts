import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

export function createCategoryFormSchema(
  t: (key: string) => string,
  isEdit = false,
) {
  return z.object({
    slug: z
      .string({ required_error: t('fieldSlugRequired') })
      .min(1, { message: t('fieldSlugRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldSlug'),
          inputProps: {
            placeholder: t('fieldSlugPlaceholder'),
            readOnly: isEdit,
            disabled: isEdit,
          },
        }),
      ),
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'),
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
          inputProps: { placeholder: t('fieldDescriptionPlaceholder') },
        }),
      ),
    isActive: z
      .boolean()
      .default(true)
      .superRefine(fieldConfig({ label: t('fieldActive') })),
  });
}

export type CreateCategoryFormInput = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;
