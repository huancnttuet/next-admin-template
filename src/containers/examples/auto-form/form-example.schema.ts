import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

/**
 * Full AutoForm example schema covering all supported field types.
 * The schema factory accepts the next-intl `t()` function so labels,
 * placeholders, and validation messages are all i18n-aware.
 */

// ── Schema A: basic text & numeric fields ─────────────────────────────────────
export function createBasicSchema(t: (key: string) => string) {
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

    // number → <Input type="number">  (z.preprocess handles empty/NaN → undefined cleanly)
    age: z
      .preprocess(
        (val) => {
          if (val === '' || val === undefined || val === null) return undefined;
          const n = Number(val);
          return isNaN(n) ? undefined : n;
        },
        z
          .number({ required_error: t('fieldAgeRequired') })
          .min(1, { message: t('fieldAgeMin') }),
      )
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

    // optional string → <Textarea> via fieldType override
    bio: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBio'),
          fieldType: 'textarea',
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

// ── Schema B: advanced / rich input fields ────────────────────────────────────
export function createAdvancedSchema(t: (key: string) => string) {
  return z.object({
    // date → date picker <Input type="date">
    birthday: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBirthday'),
          fieldType: 'date',
        }),
      ),

    // enum → radio group
    gender: z
      .enum(['male', 'female', 'other'], {
        required_error: t('fieldGenderRequired'),
      })
      .superRefine(
        fieldConfig({
          label: t('fieldGender'),
          fieldType: 'radio',
        }),
      ),

    // boolean → <Switch>
    notifications: z
      .boolean()
      .default(false)
      .superRefine(
        fieldConfig({
          label: t('fieldNotifications'),
          fieldType: 'switch',
        }),
      ),

    // string[] (custom) → multi-checkbox, options passed via customData
    interests: z
      .array(z.string())
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldInterests'),
          fieldType: 'multi-checkbox',
          customData: {
            options: ['reading', 'coding', 'gaming', 'cooking', 'sports'],
          },
        }),
      ),

    // string[] (custom) → multi-select (badge dropdown), options passed via customData
    skills: z
      .array(z.string())
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldSkills'),
          fieldType: 'multi-select',
          customData: {
            options: ['react', 'nextjs', 'typescript', 'tailwind', 'nodejs'],
          },
        }),
      ),

    // enum → combobox (searchable)
    country: z
      .enum(['us', 'vn', 'gb', 'de', 'jp', 'au', 'ca', 'fr', 'sg', 'kr'], {
        required_error: t('fieldCountryRequired'),
      })
      .superRefine(
        fieldConfig({
          label: t('fieldCountry'),
          fieldType: 'combobox',
        }),
      ),

    // number → slider
    experience: z.coerce
      .number()
      .min(0)
      .max(100)
      .default(0)
      .superRefine(
        fieldConfig({
          label: t('fieldExperience'),
          fieldType: 'slider',
          description: t('fieldExperienceDescription'),
        }),
      ),
  });
}

export type BasicInput = z.infer<ReturnType<typeof createBasicSchema>>;
export type AdvancedInput = z.infer<ReturnType<typeof createAdvancedSchema>>;

// ── Schema C: date picker variations (one schema per variant card) ───────────

// 1. Basic calendar — no restrictions
export function createDateBasicSchema(t: (key: string) => string) {
  return z.object({
    date: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldDateBasic'),
          fieldType: 'date',
          customData: { placeholder: t('fieldDatePlaceholder') },
        }),
      ),
  });
}

// 2. Min / max range — only dates within 2026
export function createDateRangeSchema(t: (key: string) => string) {
  return z.object({
    date: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldDateRange'),
          description: t('fieldDateRangeDescription'),
          fieldType: 'date',
          customData: {
            min: '2026-01-01',
            max: '2026-12-31',
            defaultMonth: '2026-03-01',
            placeholder: t('fieldDatePlaceholder'),
          },
        }),
      ),
  });
}

// 3. Business days only — weekends disabled
export function createDateBusinessSchema(t: (key: string) => string) {
  return z.object({
    date: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldDateBusiness'),
          description: t('fieldDateBusinessDescription'),
          fieldType: 'date',
          customData: {
            disableWeekends: true,
            placeholder: t('fieldDatePlaceholder'),
          },
        }),
      ),
  });
}

// 4. Specific disabled dates — public holidays
export function createDateHolidaySchema(t: (key: string) => string) {
  return z.object({
    date: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldDateHoliday'),
          description: t('fieldDateHolidayDescription'),
          fieldType: 'date',
          customData: {
            disabledDates: [
              '2026-01-01',
              '2026-04-30',
              '2026-05-01',
              '2026-09-02',
            ],
            defaultMonth: '2026-04-01',
            placeholder: t('fieldDatePlaceholder'),
          },
        }),
      ),
  });
}

export type DateInput = { date?: string };

// ── Schema D: layout customization examples ───────────────────────────────────

/**
 * createLayoutSchema — shared fields used across all three layout variants.
 * customData.className on each field is the Tailwind class injected onto
 * the FieldWrapper <div> by the extended FieldWrapper component.
 * When the parent <form> uses a CSS grid, these classes (e.g. "col-span-2")
 * control how many columns a field occupies.
 */
export function createLayoutSchema(t: (key: string) => string) {
  return z.object({
    firstName: z
      .string({ required_error: t('fieldFirstNameRequired') })
      .min(1, { message: t('fieldFirstNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldFirstName'),
          inputProps: { placeholder: t('fieldFirstNamePlaceholder') },
        }),
      ),

    lastName: z
      .string({ required_error: t('fieldLastNameRequired') })
      .min(1, { message: t('fieldLastNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldLastName'),
          inputProps: { placeholder: t('fieldLastNamePlaceholder') },
        }),
      ),

    email: z
      .string({ required_error: t('fieldEmailRequired') })
      .email({ message: t('fieldEmailInvalid') })
      .superRefine(
        fieldConfig({
          label: t('fieldEmail'),
          inputProps: { placeholder: t('fieldEmailPlaceholder') },
        }),
      ),

    phone: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldPhone'),
          inputProps: { placeholder: t('fieldPhonePlaceholder') },
        }),
      ),

    birthDate: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBirthday'),
          fieldType: 'date',
          customData: { placeholder: t('fieldDatePlaceholder') },
        }),
      ),

    department: z
      .enum(['engineering', 'design', 'marketing', 'hr', 'finance'], {
        required_error: t('fieldDepartmentRequired'),
      })
      .superRefine(fieldConfig({ label: t('fieldDepartment') })),

    bio: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBio'),
          fieldType: 'textarea',
          inputProps: { placeholder: t('fieldBioPlaceholder') },
        }),
      ),
  });
}

/**
 * createLayoutGridSchema — same fields but each FieldWrapper gets a
 * customData.className so they sit inside a CSS grid:
 *  - firstName / lastName → col-span-1 (two per row in 2-col grid)
 *  - email → col-span-2 (full width)
 *  - phone / birthDate → col-span-1
 *  - department → col-span-1
 *  - bio → col-span-2 (full width)
 */
export function createLayoutGridSchema(t: (key: string) => string) {
  return z.object({
    firstName: z
      .string({ required_error: t('fieldFirstNameRequired') })
      .min(1, { message: t('fieldFirstNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldFirstName'),
          inputProps: { placeholder: t('fieldFirstNamePlaceholder') },
          customData: { className: 'col-span-1' },
        }),
      ),

    lastName: z
      .string({ required_error: t('fieldLastNameRequired') })
      .min(1, { message: t('fieldLastNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldLastName'),
          inputProps: { placeholder: t('fieldLastNamePlaceholder') },
          customData: { className: 'col-span-1' },
        }),
      ),

    email: z
      .string({ required_error: t('fieldEmailRequired') })
      .email({ message: t('fieldEmailInvalid') })
      .superRefine(
        fieldConfig({
          label: t('fieldEmail'),
          inputProps: { placeholder: t('fieldEmailPlaceholder') },
          customData: { className: 'col-span-2' },
        }),
      ),

    phone: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldPhone'),
          inputProps: { placeholder: t('fieldPhonePlaceholder') },
          customData: { className: 'col-span-1' },
        }),
      ),

    birthDate: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBirthday'),
          fieldType: 'date',
          customData: {
            className: 'col-span-1',
            placeholder: t('fieldDatePlaceholder'),
          },
        }),
      ),

    department: z
      .enum(['engineering', 'design', 'marketing', 'hr', 'finance'], {
        required_error: t('fieldDepartmentRequired'),
      })
      .superRefine(
        fieldConfig({
          label: t('fieldDepartment'),
          customData: { className: 'col-span-1' },
        }),
      ),

    bio: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldBio'),
          fieldType: 'textarea',
          inputProps: { placeholder: t('fieldBioPlaceholder') },
          customData: { className: 'col-span-2' },
        }),
      ),
  });
}

export type LayoutInput = z.infer<ReturnType<typeof createLayoutSchema>>;

// ── Schema E: file upload examples ────────────────────────────────────────────

/** Single image upload */
export function createImageUploadSchema(t: (key: string) => string) {
  return z.object({
    avatar: z
      .any()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldAvatar'),
          description: t('fieldAvatarDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*',
            maxSizeMB: 2,
            multiple: false,
          },
        }),
      ),
  });
}

/** Multiple files — images + PDF */
export function createMultiFileUploadSchema(t: (key: string) => string) {
  return z.object({
    documents: z
      .any()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldDocuments'),
          description: t('fieldDocumentsDescription'),
          fieldType: 'file-upload',
          customData: {
            accept: 'image/*,application/pdf',
            maxSizeMB: 5,
            multiple: true,
            maxFiles: 3,
          },
        }),
      ),
  });
}

export type FileUploadInput = { avatar?: unknown; documents?: unknown };

// ── Schema F: async combobox ──────────────────────────────────────────────────

import {
  AsyncComboboxCustomData,
  AsyncComboboxOption,
} from '@/components/ui/autoform/components/AsyncComboboxField';

/** Fetch functions injected at call-site so `queryFn` lives in `customData`. */
export interface AsyncComboboxFetchFns {
  fetchCategories: () => Promise<AsyncComboboxOption[]>;
  fetchTags: () => Promise<AsyncComboboxOption[]>;
}

/**
 * `queryKey` and `queryFn` are embedded directly in each field's `customData`
 * (typed as `AsyncComboboxCustomData`) so `<AutoForm>` needs zero extra props.
 */
export function createAsyncComboboxSchema(
  t: (key: string) => string,
  fetchFns: AsyncComboboxFetchFns,
) {
  return z.object({
    category: z
      .string({ required_error: t('fieldCategoryRequired') })
      .min(1, { message: t('fieldCategoryRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCategory'),
          fieldType: 'async-combobox',
          customData: {
            queryKey: ['form-example-categories'],
            queryFn: fetchFns.fetchCategories,
            placeholder: t('fieldCategoryPlaceholder'),
            searchPlaceholder: t('searchPlaceholder'),
          } satisfies AsyncComboboxCustomData,
        }),
      ),

    tag: z
      .string()
      .optional()
      .superRefine(
        fieldConfig({
          label: t('fieldTag'),
          fieldType: 'async-combobox',
          customData: {
            queryKey: ['form-example-tags'],
            queryFn: fetchFns.fetchTags,
            placeholder: t('fieldTagPlaceholder'),
            searchPlaceholder: t('searchPlaceholder'),
          } satisfies AsyncComboboxCustomData,
        }),
      ),
  });
}

export type AsyncComboboxInput = z.infer<
  ReturnType<typeof createAsyncComboboxSchema>
>;
