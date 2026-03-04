import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

// ---------- Schemas (AutoForm / Zod) ----------

/**
 * Create a Zod schema for the questionnaire group form.
 * Accepts translated labels & placeholders so the schema is i18n-aware.
 */
export function createQuestionnaireGroupSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'),
          inputProps: { placeholder: t('fieldNamePlaceholder') },
        }),
      ),
  });
}

export type CreateQuestionnaireGroupInput = z.infer<
  ReturnType<typeof createQuestionnaireGroupSchema>
>;

/**
 * Schema for editing a questionnaire group.
 * Reuses the same shape as create — extend here when the edit form grows.
 */
export const editQuestionnaireGroupSchema = createQuestionnaireGroupSchema;
export type EditQuestionnaireGroupInput = CreateQuestionnaireGroupInput;
