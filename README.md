# E-Learning Admin v2

A modern, feature-rich admin dashboard for e-learning platforms built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## ✨ Features

- 🎨 **Beautiful UI** — Built on [shadcn/ui](https://ui.shadcn.com) with a fully customizable design system
- 🔐 **Authentication** — NextAuth v4 with SSO (IIG KAPI OAuth2) + credentials fallback (JWT strategy)
- 🌍 **Internationalization** — Multi-language support via next-intl (English & Vietnamese)
- 🎛️ **Layout Preferences** — Real-time layout customization (14 theme presets, 7 fonts, sidebar style, navbar behavior, etc.)
- 📊 **Dashboard** — Overview analytics with charts powered by Recharts
- 📋 **Data Tables** — Server-side pagination, sorting, filtering, column pinning, row selection with floating action bar ([Dice UI](https://www.diceui.com) + [TanStack Table](https://tanstack.com/table))
- 👥 **User Management** — Full CRUD data table for users with search, filters, and bulk actions
- 📝 **Questionnaire Groups** — CRUD management with AutoForm-powered create/edit dialogs, detail sheet, and inline actions
- 🧭 **Sidebar Navigation** — Collapsible sidebar with nested groups, multiple rendering modes
- 🌙 **Dark Mode** — Theme switching with next-themes (light/dark/system)
- 📱 **Responsive** — Mobile-first design with off-canvas sidebar support
- ⚡ **Fast** — Turbopack for development, optimized builds
- 🔍 **ESLint** — Fully configured with Next.js core-web-vitals, TypeScript rules, and unused import detection

## 🛠️ Tech Stack

| Category             | Technology                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Framework            | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                                                                    |
| Language             | [TypeScript](https://www.typescriptlang.org) (strict mode)                                                                  |
| Styling              | [Tailwind CSS](https://tailwindcss.com)                                                                                     |
| UI Components        | [shadcn/ui](https://ui.shadcn.com) (Radix UI)                                                                               |
| Data Tables          | [TanStack Table 8](https://tanstack.com/table)                                                                              |
| Action Bar           | [Dice UI](https://www.diceui.com) (floating selection bar)                                                                  |
| Authentication       | [NextAuth.js v4](https://next-auth.js.org)                                                                                  |
| State Management     | [Zustand 5](https://zustand-demo.pmnd.rs)                                                                                   |
| Server State         | [TanStack Query 5](https://tanstack.com/query)                                                                              |
| URL State            | [nuqs](https://nuqs.47ng.com)                                                                                               |
| HTTP Client          | [Axios](https://axios-http.com)                                                                                             |
| Forms                | [AutoForm](https://github.com/vantezzen/autoform) + [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Internationalization | [next-intl](https://next-intl-docs.vercel.app)                                                                              |
| Charts               | [Recharts](https://recharts.org)                                                                                            |
| Toasts               | [Sonner](https://sonner.emilkowal.ski)                                                                                      |
| Theme                | [next-themes](https://github.com/pacocoursey/next-themes)                                                                   |
| Linting              | ESLint 9 (flat config) + `eslint-config-next` + `@typescript-eslint` + `eslint-plugin-unused-imports`                       |
| Formatting           | Prettier + `prettier-plugin-tailwindcss`                                                                                    |
| Package Manager      | pnpm                                                                                                                        |

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (admin)/                # Admin route group (with sidebar layout)
│   │   ├── page.tsx            # Dashboard
│   │   ├── layout.tsx          # Admin layout (sidebar + header + content)
│   │   ├── account/            # Account page
│   │   ├── errors/             # Error pages (401, 403, 404, 500, 503)
│   │   ├── help-center/        # Help center
│   │   ├── questionnaire-groups/ # Questionnaire groups management
│   │   ├── settings/           # Settings (appearance, display, notifications)
│   │   └── users/              # Users management
│   ├── (auth)/                 # Auth route group (no sidebar)
│   │   ├── sign-in/            # Sign in
│   │   ├── sign-up/            # Sign up
│   │   ├── forgot-password/    # Forgot password
│   │   └── otp/                # OTP verification
│   ├── user/login/             # Alternative login page
│   └── api/auth/               # NextAuth API routes
├── components/
│   ├── data-table/             # Reusable data table components (column header, pagination, toolbar, filters, skeleton, view options)
│   ├── icons/                  # Custom icon components (e.g., iig-icon)
│   ├── layout/                 # Layout & toolbar components (sidebar, header, nav, main, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences)
│   ├── providers/              # React providers (theme, query, preferences)
│   └── ui/                     # shadcn/ui primitives (action-bar, button, checkbox, command, dialog, sheet, table, etc.)
├── configs/                    # App configuration (routes, sidebar data, API endpoints, SSO, data-table, search, user-menu)
├── containers/                 # Feature-level smart components
│   ├── dashboard/              # Dashboard charts and overview
│   ├── questionnaire-groups/   # Table, columns, create/edit dialogs, detail sheet, action bar
│   └── users/                  # Table, columns, action bar
├── hooks/                      # Custom React hooks (use-data-table, use-debounce, use-mobile, etc.)
├── i18n/                       # Internationalization config + messages/ translations (en, vi)
├── lib/                        # Utilities
│   ├── apis/                   # API client factory, error handling, proxy client
│   ├── auth.ts                 # NextAuth configuration
│   ├── data-table.ts           # Data table helpers
│   ├── format.ts               # Date/number formatting
│   ├── parsers.ts              # URL search params parsers (nuqs)
│   └── utils.ts                # General utilities (cn, etc.)
├── services/                   # Domain services — types, API calls, TanStack Query hooks
│   ├── questionnaire-groups/   # Questionnaire groups CRUD
│   ├── sso/                    # SSO OAuth2 service
│   └── users/                  # Users CRUD
├── stores/                     # Zustand stores (preferences, sidebar)
└── types/                      # Shared TypeScript types (sidebar, data-table, etc.)
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 9

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd elearning-admin-v2

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.development
```

### Development

```bash
# Start development server (with Turbopack)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint & format
pnpm lint
pnpm format
```

### Environment Variables

| Variable                               | Description               | Default                     |
| -------------------------------------- | ------------------------- | --------------------------- |
| `NEXTAUTH_URL`                         | Auth callback URL         | `http://localhost:3000`     |
| `NEXTAUTH_SECRET`                      | JWT encryption secret     | —                           |
| `NEXT_PUBLIC_API_URL`                  | Primary backend API URL   | `http://localhost:8080/api` |
| `NEXT_PUBLIC_SSO_TOKEN_API`            | SSO OAuth2 token endpoint | See `.env.example`          |
| `NEXT_PUBLIC_SSO_LOGIN_PAGE`           | SSO login page URL        | See `.env.example`          |
| `NEXT_PUBLIC_SSO_LOGOUT_PAGE`          | SSO logout URL            | See `.env.example`          |
| `NEXT_PUBLIC_SSO_CHANGE_PASSWORD_PAGE` | SSO change-password page  | See `.env.example`          |
| `NEXT_PUBLIC_SSO_CLIENT_ID`            | SSO OAuth2 client ID      | `tfc_admin`                 |
| `NEXT_PUBLIC_SSO_REDIRECT_URI`         | SSO OAuth2 redirect URI   | See `.env.example`          |
| `NEXT_PUBLIC_SSO_SCOPE`                | SSO OAuth2 scopes         | `openid profile email`      |

> **Multiple APIs:** Add `NEXT_PUBLIC_<NAME>_API_URL` env variables and register them in `src/configs/endpoints.ts`. See `src/lib/api-client.ts` for the `createApiClient()` factory.

## 🎛️ Layout Preferences

The admin dashboard supports real-time layout customization via the settings icon (⚙️) in the header. Preferences are persisted in localStorage via Zustand:

| Preference            | Options                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme Preset          | Default, Blue, Green, Orange, Tangerine, Soft Pop, Brutalist, Underground, Sunset Glow, Rose Garden, Lake View, Forest Whispers, Ocean Breeze, Lavender Dream |
| Font                  | Inter, Manrope, Nunito, Plus Jakarta Sans, Space Grotesk, DM Sans, System                                                                                     |
| Scale                 | XS, Normal, LG                                                                                                                                                |
| Radius                | SM, Normal, MD, LG, XL                                                                                                                                        |
| Theme Mode            | Light, Dark, System                                                                                                                                           |
| Page Layout           | Centered, Full Width                                                                                                                                          |
| Navbar Behavior       | Sticky, Scroll                                                                                                                                                |
| Sidebar Style         | Inset, Sidebar, Floating                                                                                                                                      |
| Sidebar Collapse Mode | Icon, OffCanvas                                                                                                                                               |

## 🔒 Authentication

Authentication is handled by **NextAuth.js v4** with two providers:

### SSO (Primary) — IIG Vietnam KAPI

OAuth2 Authorization Code flow against IIG Vietnam's KAPI identity provider.

- Config: `src/configs/sso.ts`
- Service: `src/services/sso/`
- Users click **"Sign in with SSO"** on the login page → redirected to KAPI → callback exchanges code for tokens
- Tokens are stored in the NextAuth JWT and automatically refreshed
- Sign-out redirects to KAPI logout page
- Change password links to the KAPI change-password page

**SSO environment variables:**

| Variable                               | Description                    |
| -------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_SSO_TOKEN_API`            | OAuth2 token endpoint          |
| `NEXT_PUBLIC_SSO_LOGIN_PAGE`           | SSO login/authorize page       |
| `NEXT_PUBLIC_SSO_LOGOUT_PAGE`          | SSO logout URL (with redirect) |
| `NEXT_PUBLIC_SSO_CHANGE_PASSWORD_PAGE` | SSO change-password page       |
| `NEXT_PUBLIC_SSO_CLIENT_ID`            | OAuth2 client ID               |
| `NEXT_PUBLIC_SSO_REDIRECT_URI`         | OAuth2 redirect URI            |
| `NEXT_PUBLIC_SSO_SCOPE`                | OAuth2 scopes                  |

### Credentials (Fallback / Development)

**Default credentials (development):**

- Email: `admin@example.com`
- Password: `password`

## 📋 Data Tables

The project uses a reusable, full-featured data table system built on **TanStack Table 8** with server-side operations:

### Features

- **Server-side pagination** — Page index and page size synced to URL search params via `nuqs`
- **Server-side sorting** — Multi-column sorting with URL state persistence
- **Faceted filters** — Select, date, and slider filters with column-specific configuration
- **Column pinning** — Pin columns to left/right (e.g., select, index, name, actions)
- **Row selection** — Checkbox column with select-all/select-row support
- **Floating action bar** — [Dice UI ActionBar](https://www.diceui.com/docs/components/radix/action-bar) appears when rows are selected, with bulk actions (delete, etc.)
- **Column visibility** — Toggle columns on/off via view options dropdown
- **Loading skeleton** — Shimmer skeleton matching column layout during data fetches
- **Resizable columns** — Drag to resize column widths

### Architecture

| Layer                        | Location                                                | Purpose                                      |
| ---------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| Reusable table UI            | `src/components/data-table/`                            | Pagination, toolbar, filters, skeleton, etc. |
| Table hook                   | `src/hooks/use-data-table.ts`                           | Composable hook wiring TanStack Table + nuqs |
| Domain columns               | `src/containers/<domain>/columns.tsx`                   | Column definitions with i18n                 |
| Domain table                 | `src/containers/<domain>/<domain>-table.tsx`            | Wires hook + columns + API query             |
| Domain action bar            | `src/containers/<domain>/<domain>-table-action-bar.tsx` | Floating bulk action bar                     |
| Domain API / types / queries | `src/services/<domain>/`                                | TanStack Query hooks + Axios API calls       |

### Adding a New Data Table

1. Define types in `src/services/<domain>/<domain>.type.ts`
2. Define form schemas in `src/services/<domain>/<domain>.schema.ts` (if needed)
3. Create API functions in `src/services/<domain>/<domain>.api.ts`
4. Create TanStack Query hooks in `src/services/<domain>/<domain>.query.ts`
5. Define columns in `src/containers/<domain>/columns.tsx`
6. Create the table container in `src/containers/<domain>/<domain>-table.tsx`
7. Optionally create an action bar in `src/containers/<domain>/<domain>-table-action-bar.tsx`
8. Add translation keys to `en.json` / `vi.json`

## 📝 AutoForm (Create / Edit Dialogs)

Forms are auto-generated from **Zod schemas** using [AutoForm](https://github.com/vantezzen/autoform), which sits on top of React Hook Form and shadcn/ui.

### How it works

1. **Define a Zod schema** in `services/<domain>/<domain>.schema.ts` — labels, placeholders, and validation messages are injected via the i18n `t()` function using `fieldConfig()` + `.superRefine()`.
2. **Render `<AutoForm>`** in a dialog — pass the schema wrapped in `ZodProvider`, an `onSubmit` handler, and optional `defaultValues` for editing.
3. **AutoForm generates the form** — fields, labels, placeholders, validation, and error messages are all derived from the schema.

> **Important:** Always import `fieldConfig` from `@/lib/autoform` (NOT directly from `@autoform/react`).
> `@autoform/react` and `@autoform/zod` each define their own `Symbol("GetFieldConfig")`.
> `ZodProvider` only recognises the symbol from `@autoform/zod` — using the react-side helper silently drops all labels and `inputProps`.

### Key files

| File                                      | Purpose                                                              |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `src/lib/autoform.ts`                     | Re-exports `fieldConfig` from `@autoform/zod`, typed to `FieldTypes` |
| `src/components/ui/autoform/`             | shadcn/ui AutoForm registry (field components, wrappers, form)       |
| `src/components/ui/autoform/AutoForm.tsx` | Merges shadcn UI + field components; exports `FieldTypes` union      |
| `services/<domain>/<domain>.schema.ts`    | Zod schemas with i18n-aware `fieldConfig` for form generation        |
| `containers/<domain>/create-*.tsx`        | Create dialog using `<AutoForm>` + `ZodProvider`                     |
| `containers/<domain>/edit-*.tsx`          | Edit dialog using `<AutoForm>` with `defaultValues`                  |

### Full example — adding a new AutoForm dialog

#### Step 1 — Schema (`services/categories/categories.schema.ts`)

```ts
import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';

// Schema factory — accepts the i18n translator so labels/messages are reactive.
export function createCategorySchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string({ required_error: t('fieldNameRequired') })
      .min(1, { message: t('fieldNameRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldName'), // translated label
          inputProps: { placeholder: t('fieldNamePlaceholder') }, // translated placeholder
        }),
      ),

    code: z
      .string({ required_error: t('fieldCodeRequired') })
      .min(1, { message: t('fieldCodeRequired') })
      .superRefine(
        fieldConfig({
          label: t('fieldCode'),
          inputProps: { placeholder: t('fieldCodePlaceholder') },
        }),
      ),

    // number field
    order: z
      .number({ required_error: t('fieldOrderRequired') })
      .min(1)
      .superRefine(
        fieldConfig({
          label: t('fieldOrder'),
          inputProps: { placeholder: '1' },
        }),
      ),

    // boolean (checkbox)
    isActive: z
      .boolean()
      .default(true)
      .superRefine(fieldConfig({ label: t('fieldIsActive') })),

    // select (enum)
    type: z.enum(['quiz', 'survey', 'exam']).superRefine(
      fieldConfig({
        label: t('fieldType'),
        fieldType: 'select', // must match a key in ShadcnAutoFormFieldComponents
      }),
    ),
  });
}

export type CreateCategoryInput = z.infer<
  ReturnType<typeof createCategorySchema>
>;

// Edit reuses the same shape — extend here when the edit form diverges.
export const editCategorySchema = createCategorySchema;
export type EditCategoryInput = CreateCategoryInput;
```

#### Step 2 — Translations (`src/i18n/messages/en.json` + `vi.json`)

Add a namespace for the domain. **Always add to both files.**

```jsonc
// en.json
"categories": {
  "createTitle": "Create Category",
  "createDescription": "Enter details for the new category.",
  "createNew": "New Category",
  "creating": "Creating…",
  "createSuccess": "Category created successfully.",
  "editTitle": "Edit Category",
  "editDescription": "Update the category details.",
  "save": "Save",
  "saving": "Saving…",
  "editSuccess": "Category updated successfully.",
  "fieldName": "Name",
  "fieldNamePlaceholder": "e.g. Mathematics",
  "fieldNameRequired": "Name is required.",
  "fieldCode": "Code",
  "fieldCodePlaceholder": "e.g. MATH-01",
  "fieldCodeRequired": "Code is required.",
  "fieldOrder": "Order",
  "fieldOrderRequired": "Order is required.",
  "fieldIsActive": "Active",
  "fieldType": "Type"
}
```

#### Step 3 — Create dialog (`containers/categories/create-category-dialog.tsx`)

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateCategory } from '@/services/categories';
import { createCategorySchema } from '@/services/categories';
import type { CreateCategoryInput } from '@/services/categories';

export function CreateCategoryDialog() {
  const t = useTranslations('categories');
  const [open, setOpen] = useState(false);
  const mutation = useCreateCategory();

  // Build schema inside the component so `t` is always fresh (i18n-aware).
  const schema = createCategorySchema(t);
  const schemaProvider = new ZodProvider(schema);

  const handleSubmit = (data: CreateCategoryInput) => {
    mutation.mutate(data, {
      onSuccess: () => {
        toast.success(t('createSuccess'));
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) mutation.reset(); // clear any previous error state on close
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <PlusCircle className='mr-2 size-4' />
          {t('createNew')}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('createTitle')}</DialogTitle>
          <DialogDescription>{t('createDescription')}</DialogDescription>
        </DialogHeader>

        {/* AutoForm renders all fields from the Zod schema automatically */}
        <AutoForm schema={schemaProvider} onSubmit={handleSubmit}>
          <div className='flex justify-end'>
            <Button type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? t('creating') : t('createNew')}
            </Button>
          </div>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
```

#### Step 4 — Edit dialog (`containers/categories/edit-category-dialog.tsx`)

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { ZodProvider } from '@autoform/zod';
import { toast } from 'sonner';
import { AutoForm } from '@/components/ui/autoform';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCategoryDetail, useUpdateCategory } from '@/services/categories';
import { editCategorySchema } from '@/services/categories';
import type { EditCategoryInput } from '@/services/categories';

interface Props {
  id: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ id, open, onOpenChange }: Props) {
  const t = useTranslations('categories');
  const mutation = useUpdateCategory();
  const { data: category } = useCategoryDetail(id ?? '');

  const schema = editCategorySchema(t);
  const schemaProvider = new ZodProvider(schema);

  const handleSubmit = (data: EditCategoryInput) => {
    if (!id) return;
    mutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success(t('editSuccess'));
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) mutation.reset();
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>{t('editDescription')}</DialogDescription>
        </DialogHeader>

        {/* Render only after data is loaded so defaultValues are correct */}
        {category && (
          <AutoForm
            schema={schemaProvider}
            onSubmit={handleSubmit}
            defaultValues={{
              // pre-fills every field with existing data
              name: category.name,
              code: category.code,
              order: category.order,
              isActive: category.isActive,
              type: category.type,
            }}
          >
            <Button
              type='submit'
              disabled={mutation.isPending}
              className='w-full'
            >
              {mutation.isPending ? t('saving') : t('save')}
            </Button>
          </AutoForm>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

### Supported field types

AutoForm infers the field type from the Zod schema. Override with `fieldType` in `fieldConfig` when needed.

| Zod type      | Rendered as             | `fieldType` key |
| ------------- | ----------------------- | --------------- |
| `z.string()`  | `<Input>`               | `"string"`      |
| `z.number()`  | `<Input type="number">` | `"number"`      |
| `z.boolean()` | `<Checkbox>`            | `"boolean"`     |
| `z.date()`    | Date picker             | `"date"`        |
| `z.enum([…])` | `<Select>`              | `"select"`      |

### `fieldConfig` options reference

```ts
fieldConfig({
  label: 'Field label', // rendered above the input
  description: 'Helper text', // rendered below the input
  inputProps: {
    placeholder: 'Placeholder text', // HTML placeholder
    disabled: true, // disable the input
    className: 'w-full', // extra Tailwind classes
  },
  fieldType: 'select', // override inferred field type
});
```

## 🔍 ESLint Configuration

The project uses **ESLint 9** with flat config (`eslint.config.mjs`):

| Plugin / Config                    | Purpose                                               |
| ---------------------------------- | ----------------------------------------------------- |
| `eslint-config-next`               | Next.js core-web-vitals (React, React Hooks, imports) |
| `@typescript-eslint/eslint-plugin` | TypeScript-aware rules (`no-unused-vars`, etc.)       |
| `eslint-plugin-unused-imports`     | Detects and auto-fixes unused imports                 |

### Key rules

- **`@typescript-eslint/no-unused-vars`** — Warns on unused variables (ignores `_` prefixed)
- **`unused-imports/no-unused-imports`** — Warns on unused imports, auto-fixable with `--fix`
- **`unused-imports/no-unused-vars`** — Catches unused vars that TypeScript may miss

```bash
# Run ESLint
pnpm lint

# Run with auto-fix (removes unused imports, etc.)
npx eslint src/ --fix
```

## 🌍 Internationalization

The app supports multiple languages using next-intl. Translation files are located in `src/i18n/messages/`:

- `en.json` — English
- `vi.json` — Vietnamese

Language switching is available via the **Language Switcher** (🌐) button in the header toolbar. The selected locale is persisted in a cookie.

All data table labels, column headers, action buttons, toast messages, and error states are fully translated.

To add a new language:

1. Create a new JSON file in `src/i18n/messages/` (e.g., `ja.json`)
2. Add the locale to the `locales` array in `src/i18n/config.ts`
3. Add the label to `LOCALE_LABELS` in `src/components/layout/language-switcher.tsx`

## ⚠️ API Error Handling

API errors are handled centrally via `src/lib/apis/api-error.ts`:

- **`getApiProblemDetails(error)`** — Extracts RFC 7807 problem details from Axios errors
- **`getErrorMessage(error)`** — Returns a user-friendly error message string
- **`getValidationErrors(error)`** — Extracts field-level validation errors
- **`getFieldErrors(error)`** — Maps validation errors to React Hook Form compatible format

Toast notifications are powered by **Sonner** with `richColors`, shown at the top-right corner.

## 📖 Credits

- UI inspired by [shadcn-admin](https://github.com/satnaing/shadcn-admin) by Sat Naing
- Layout preferences inspired by [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by Arham Khan
- Data table components based on [Dice UI](https://www.diceui.com) by sadmann7

## 📄 License

MIT
