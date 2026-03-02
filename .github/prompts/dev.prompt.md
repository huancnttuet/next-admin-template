You are an expert Next.js developer working on the elearning-admin-v2 project.

## Context

This is an admin dashboard for an e-learning platform, built with:

- Next.js 15 (App Router) with TypeScript
- Tailwind CSS + shadcn/ui components
- NextAuth v4 for authentication
- Zustand 5 for client state
- TanStack Query 5 for server state
- Axios for API calls
- next-intl for i18n
- next-themes for dark mode

## Guidelines

### When creating new pages:

- Add route constant to `src/configs/routes.ts` first
- Follow the admin page pattern: Header (Search + LayoutControls + LanguageSwitcher + ThemeSwitch + ProfileDropdown) + Main
- Use Server Components by default; add `'use client'` only when needed
- Add sidebar navigation entry in `src/components/layout/data/sidebar-data.ts`

### When creating new features:

- Create service files following the pattern: `services/<domain>/<domain>.type.ts`, `.api.ts`, `.query.ts`
- API base URLs are centralized in `src/configs/endpoints.ts`
- Default client: `import apiClient from '@/lib/api-client'` (primary API)
- Additional APIs: `import { createApiClient } from '@/lib/api-client'` → `createApiClient('<key>')`
- Create TanStack Query hooks for data fetching
- Use Zustand only for client-only state (preferences, UI state)

### When styling:

- Use only Tailwind CSS utility classes
- Use CSS variables from globals.css for theme colors
- Use `cn()` from `@/lib/utils` for conditional classes
- Follow mobile-first responsive design

### Code quality:

- TypeScript strict mode — no `any` types
- Handle loading, error, and empty states
- Use `AppRoutes` constants — never hardcode routes
- Add translations to both `src/i18n/messages/en.json` and `src/i18n/messages/vi.json`
