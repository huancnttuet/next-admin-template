/**
 * Centralized AutoForm configuration for the project.
 *
 * Must use `fieldConfig` from `@autoform/zod` (NOT `buildZodFieldConfig` from
 * `@autoform/react`). Both packages define their own `Symbol("GetFieldConfig")`,
 * and `ZodProvider` looks only for the one defined in `@autoform/zod`. Using the
 * react-side helper silently stamps the wrong symbol, so labels and inputProps
 * are never read back by the schema parser.
 *
 * Usage:
 *   import { fieldConfig } from '@/lib/autoform'
 *
 *   const schema = z.object({
 *     name: z.string().superRefine(
 *       fieldConfig({ label: t('name'), inputProps: { placeholder: t('namePlaceholder') } })
 *     ),
 *   })
 */
import { fieldConfig as _fieldConfig } from '@autoform/zod';
import type { FieldTypes } from '@/components/autoform';

// Re-export typed to our project's FieldTypes so callers get proper autocomplete.
// AdditionalRenderable = null (no extra render types), FieldTypes = our union.
export const fieldConfig = _fieldConfig<null, FieldTypes>;
