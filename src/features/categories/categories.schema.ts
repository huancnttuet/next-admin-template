import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

export function createCategoryFormSchema(t: (key: string) => string) {
  return z.object({
    slug: z
      .string({ required_error: t('fieldSlugRequired') })
      .min(1, { message: t('fieldSlugRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldSlug'),
          inputProps: {
            placeholder: t('fieldSlugPlaceholder'),
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
      .default(false)
      .superRefine(
        fieldConfig({ label: t('fieldActive'), fieldType: 'switch' }),
      ),
  });
}

export function editCategoryFormSchema(t: (key: string) => string) {
  return z.object({
    slug: z
      .string({ required_error: t('fieldSlugRequired') })
      .min(1, { message: t('fieldSlugRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldSlug'),
          inputProps: {
            placeholder: t('fieldSlugPlaceholder'),
            readOnly: true,
            disabled: true,
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
      .default(false)
      .superRefine(
        fieldConfig({ label: t('fieldActive'), fieldType: 'switch' }),
      ),
  });
}

export type CreateCategoryFormInput = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;

export type EditCategoryFormInput = z.infer<
  ReturnType<typeof editCategoryFormSchema>
>;
