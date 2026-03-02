# Copilot Instructions for elearning-admin-v2

## Project Overview

This is an e-learning admin dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack default)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** NextAuth v4 (credentials, JWT)
- **State:** Zustand 5 (client) + TanStack Query 5 (server)
- **HTTP:** Axios
- **i18n:** next-intl
- **Theme:** next-themes

## Key Patterns

### Adding a New Admin Page

1. Add route constant to `src/configs/routes.ts`
2. Create page at `src/app/(admin)/<route>/page.tsx`
3. Use the standard page template with Header + Main
4. Import layout & toolbar components from `@/components/layout/` (barrel export available)
5. Add sidebar entry in `src/configs/sidebar-data.ts` (uses `useSidebarData()` hook with i18n)
6. Add translation keys to both `en.json` and `vi.json`

### Component Organization

- `components/ui/` — shadcn/ui primitives (do NOT modify directly)
- `components/icons/` — Custom icon components (e.g., `iig-icon.tsx`)
- `components/layout/` — All layout & toolbar components: sidebar, header, main, main-logo, nav-group, nav-user, top-nav, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences-applier. Barrel-exported via `index.ts`.
- `components/providers/` — React context providers (theme, query, preferences)
- `configs/` — App configuration (routes, sidebar navigation data)
- `types/` — Shared TypeScript types (sidebar types, etc.)

### Adding a New API Integration

1. Create `src/services/<domain>/<domain>.type.ts` for types
2. Create `src/services/<domain>/<domain>.api.ts` for API calls using `@/lib/api-client`
3. Create `src/services/<domain>/<domain>.query.ts` for TanStack Query hooks
4. Create `src/services/<domain>/index.ts` barrel file

### Adding a New Translation

1. Add keys to `src/i18n/messages/en.json`
2. Add corresponding keys to `src/i18n/messages/vi.json`
3. Use `useTranslations()` in components

## Code Style

- Single quotes, no semicolons
- 100 character print width
- Tailwind classes sorted by prettier plugin
- `cn()` for conditional class merging
- `AppRoutes` for all route references
