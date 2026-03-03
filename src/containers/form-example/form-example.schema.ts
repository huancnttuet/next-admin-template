import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

/**
 * Full AutoForm example schema covering all supported field types:
 *   string  → <Input>
 *   number  → <Input type="number">
 *   enum    → <Select>
 *   boolean → <Checkbox>
 *   optional string → <Input> (with no required validation)
 *
 * The schema factory accepts the next-intl `t()` function so labels,
 * placeholders, and validation messages are all i18n-aware.
 */
export function createProfileSchema(t: (key: string) => string) {
  return z.object({
    // string → <Input>
    username: z
      .string({ required_error: t('fieldUsernameRequired') })
      .min(1, { message: t('fieldUsernameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldUsername'),
          inputProps: { placeholder: t('fieldUsernamePlaceholder') },
        }),
      ),

    // string + .email() → <Input> (AutoForm keeps it as string type)
    email: z
      .string({ required_error: t('fieldEmailRequired') })
      .email({ message: t('fieldEmailInvalid') })
      .superRefine(
        fieldConfig({
          label: t('fieldEmail'),
          inputProps: { placeholder: t('fieldEmailPlaceholder') },
        }),
      ),

    // number → <Input type="number">  (z.coerce converts the string from the DOM)
    age: z.coerce
      .number({ required_error: t('fieldAgeRequired') })
      .min(1, { message: t('fieldAgeMin') })
      .superRefine(
        fieldConfig({
          label: t('fieldAge'),
          inputProps: { placeholder: t('fieldAgePlaceholder') },
        }),
      ),

    // enum → <Select>
    role: z
      .enum(['admin', 'editor', 'viewer'], {
        required_error: t('fieldRoleRequired'),
      })
      .superRefine(fieldConfig({ label: t('fieldRole') })),

    // optional string → <Input> with no required validation
    bio: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBio'),
          inputProps: { placeholder: t('fieldBioPlaceholder') },
        }),
      ),

    // boolean → <Checkbox>
    isActive: z
      .boolean()
      .default(false)
      .superRefine(fieldConfig({ label: t('fieldIsActive') })),
  });
}

export type ProfileInput = z.infer<ReturnType<typeof createProfileSchema>>;
