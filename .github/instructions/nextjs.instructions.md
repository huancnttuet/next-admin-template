---
description: 'Best practices for building the elearning-admin-v2 Next.js (App Router) application.'
applyTo: '**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css'
---

# Next.js Best Practices — elearning-admin-v2

## 1. Project Structure & Organization

- **Use the `app/` directory** (App Router) for all routing.
- **Top-level folders:**
  - `app/` — Routing, layouts, pages, and route handlers
  - `public/` — Static assets
  - `lib/` — Shared utilities, API client factory, and logic
  - `configs/` — Application-wide configuration constants (routes, sidebar navigation data, API endpoints)
  - `components/` — Reusable, generic UI components (ui primitives, layout shell, providers)
  - `containers/` — Feature/page-level smart components grouped by domain
  - `services/` — API logic and TanStack Query hooks, grouped by domain:
  - `services/<domain>/<domain>.type.ts` — TypeScript API response types/interfaces
  - `services/<domain>/<domain>.schema.ts` — Zod form schemas for AutoForm
  - `services/<domain>/<domain>.api.ts` — Axios API functions
  - `services/<domain>/<domain>.query.ts` — TanStack Query hooks
  - `services/<domain>/index.ts` — Barrel file
  - `stores/` — Zustand stores
  - `hooks/` — Common reusable React hooks (NOT API query hooks)
  - `types/` — Shared/global TypeScript types
  - `i18n/` — Internationalization config + `messages/` subfolder with translation JSON files (en.json, vi.json)
- **Route Groups:** `(admin)` for authenticated pages, `(auth)` for login/signup
- **Colocation:** Place files near where they are used

## 2. Server and Client Components

- **Server Components by default** — only add `'use client'` when you need hooks, state, or browser APIs
- **Never use `next/dynamic` with `{ ssr: false }` inside a Server Component**
- Move client-only UI into a Client Component and import it in the Server Component

## 3. Component Best Practices

- **shadcn/ui primitives** in `components/ui/` — do not modify directly
- **Custom icons** in `components/icons/` — project-specific icon components
- **Layout & toolbar components** in `components/layout/` — sidebar, header, main, main-logo, nav-group, nav-user, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences-applier. Barrel-exported via `index.ts`.
- **Feature containers** in `containers/<domain>/` — data fetching + business logic
- Use TypeScript interfaces for all props
- Use `cn()` from `@/lib/utils` for conditional class names

## 4. Naming Conventions

- **Folders:** `kebab-case`
- **Component files:** `kebab-case.tsx` (e.g., `profile-dropdown.tsx`)
- **Variables/Functions:** `camelCase`
- **Types/Interfaces:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`

## 5. Route Definitions

- **Always use `AppRoutes`** from `@/configs/routes`
- Never hardcode route strings in components
- When adding new pages, add the route to `configs/routes.ts` first

## 6. State Management

- **Zustand** — Client-only global state (preferences, sidebar open/close)
- **TanStack Query** — Server state (API data, caching, optimistic updates)
- **React hooks** — Local component state
- Never duplicate server state in Zustand

## 7. API Integration Pattern

API base URLs are centralized in `configs/endpoints.ts`. The default client uses `ApiEndpoints.main`.

```typescript
// services/users/users.schema.ts — Zod form schemas
import { z } from 'zod';
import { fieldConfig } from '@/lib/autoform';
export function createUserSchema(t: (key: string) => string) {
  return z.object({
    name: z
      .string()
      .min(1)
      .superRefine(fieldConfig({ label: t('name') })),
  });
}
export type CreateUserInput = z.infer<ReturnType<typeof createUserSchema>>;

// configs/endpoints.ts — register all API base URLs here
export const ApiEndpoints = {
  main: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  // media: process.env.NEXT_PUBLIC_MEDIA_API_URL || 'http://localhost:8082/api',
};

// services/users/users.type.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// services/users/users.api.ts — default client (main API)
import apiClient from '@/lib/api-client';
export const getUsers = () => apiClient.get<User[]>('/users');

// services/media/media.api.ts — additional API client
import { createApiClient } from '@/lib/api-client';
const mediaClient = createApiClient('media');
export const uploadFile = (data: FormData) => mediaClient.post('/upload', data);

// services/users/users.query.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from './users.api';
export const useUsers = () =>
  useQuery({ queryKey: ['users'], queryFn: getUsers });
```

## 8. Authentication

- NextAuth v4 with two providers: **SSO** (IIG KAPI OAuth2) + **Credentials** (fallback)
- SSO config: `src/configs/sso.ts` — all SSO URLs, client ID, scopes
- SSO service: `src/services/sso/` — token exchange, user profile, refresh
- Auth config: `src/lib/auth.ts` — NextAuth options, JWT callbacks, token refresh
- Use `getServerSession()` in Server Components
- Use `useSession()` in Client Components
- Check `session.provider === 'sso'` for SSO-specific behavior (logout redirect, change password)
- Protect API routes with session validation

## 9. Internationalization (next-intl)

- Translation files in `src/i18n/messages/` (en.json, vi.json)
- Locale config & types in `src/i18n/config.ts`
- Server-side resolution in `src/i18n/request.ts`
- Locale switching via `LanguageSwitcher` component in `components/layout/` (cookie + `router.refresh()`)
- Use `useTranslations()` hook for translations
- Always add keys to ALL language files

## 10. Forms (AutoForm)

- Forms are auto-generated from Zod schemas via [AutoForm](https://github.com/vantezzen/autoform)
- Centralized `fieldConfig` re-exported in `src/lib/autoform.ts` from `@autoform/zod` (typed to project `FieldTypes`)
- AutoForm shadcn/ui registry components in `components/ui/autoform/`
- Define schemas in `services/<domain>/<domain>.schema.ts` (separate from `<domain>.type.ts`)
- Schema functions accept `t` (i18n translator) for labels, placeholders, and validation messages
- Use `fieldConfig()` from `@/lib/autoform` with `.superRefine()` on Zod fields
- Wrap schema with `new ZodProvider(schema)` from `@autoform/zod` before passing to `<AutoForm>`
- Use `children` to render custom submit buttons (not `withSubmit` — it only renders "Submit")
- For edit dialogs, pass `defaultValues` with existing data

## 11. Styling

- Tailwind CSS utility classes only
- CSS variables in `globals.css` for theming
- `cn()` for conditional class merging
- Mobile-first responsive design
- Dark mode via CSS variables and next-themes

## 12. Code Quality

- TypeScript strict mode
- Prettier: single quotes, no semicolons, 100 char width, tailwind plugin
- ESLint: Next.js recommended config
- Handle loading and error states in all data-fetching components

## 13. Avoid Unnecessary Files

Do not create example/demo files unless the user specifically requests them. Keep the repository clean and production-focused.
