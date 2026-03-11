# Copilot Instructions for next-admin-template

## Project Overview

This is an e-learning admin dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack default)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth v4 (SSO via IIG KAPI OAuth2 + credentials fallback, JWT)
- **State:** Zustand 5 (client) + TanStack Query 5 (server)
- **Forms:** AutoForm (Zod → auto-generated forms) + React Hook Form + Zod
- **HTTP:** Axios
- **i18n:** next-intl
- **Theme:** next-themes

## Key Patterns

### Adding a New Admin Page

1. Add route constant to `src/configs/routes.ts`
2. Create page at `src/app/(admin)/<route>/page.tsx`
3. Wrap page content in `<Main>` from `@/components/layout/main` (Header is already in the admin layout)
4. Add sidebar entry in `src/configs/sidebar-data.ts` (uses `useSidebarData()` hook with i18n)
5. Add translation keys to both `en.json` and `vi.json`

### Component Organization

- `components/ui/` — shadcn/ui primitives (do NOT modify directly)
- `components/icons/` — Custom icon components (e.g., `iig-icon.tsx`)
- `components/layout/` — All layout & toolbar components: sidebar, header, main, main-logo, nav-group, nav-user, top-nav, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences-applier. Barrel-exported via `index.ts`.
- `components/providers/` — React context providers (theme, query, preferences)
- `configs/` — App configuration (routes, sidebar navigation data, API endpoints, SSO config)
- `types/` — Shared TypeScript types (sidebar types, etc.)

### Adding a New API Integration

1. Create `src/services/<domain>/<domain>.type.ts` for API response types
2. Create `src/services/<domain>/<domain>.schema.ts` for Zod form schemas (AutoForm)
3. Create `src/services/<domain>/<domain>.api.ts` for API calls using `@/lib/api-client`
4. Create `src/services/<domain>/<domain>.query.ts` for TanStack Query hooks
5. Create `src/services/<domain>/index.ts` barrel file

### Adding a New API Endpoint

1. Add `NEXT_PUBLIC_<NAME>_API_URL` env variable to `.env.*` files
2. Add a new entry in `src/configs/endpoints.ts`
3. Create a client via `createApiClient('<key>')` from `@/lib/api-client`

### Adding a New Translation

1. Add keys to `src/i18n/messages/en.json`
2. Add corresponding keys to `src/i18n/messages/vi.json`
3. Use `useTranslations()` in components

### Adding a Create/Edit Form (AutoForm)

Forms are auto-generated from Zod schemas via [AutoForm](https://github.com/vantezzen/autoform).

1. Define a schema function in `services/<domain>/<domain>.schema.ts` that accepts `t` (i18n translator)
2. Use `fieldConfig()` from `@/lib/autoform` with `.superRefine()` on each field for labels/placeholders
3. In the dialog component, wrap the schema with `new ZodProvider(schema)` and pass to `<AutoForm>`
4. Use `children` of `<AutoForm>` for custom submit buttons
5. For edit dialogs, pass `defaultValues` prop with existing data

## Code Style

- Single quotes, no semicolons
- 100 character print width
- Tailwind classes sorted by prettier plugin
- `cn()` for conditional class merging
- `AppRoutes` for all route references
