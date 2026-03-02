---
description: 'Next.js + Tailwind development standards and instructions for elearning-admin-v2'
applyTo: '**/*.tsx, **/*.ts, **/*.jsx, **/*.js, **/*.css'
---

# Next.js + Tailwind Development Instructions

Instructions for the elearning-admin-v2 project built with Next.js 16 (App Router), Tailwind CSS, TypeScript, and shadcn/ui.

## Project Context

- Next.js 16 (App Router) with Turbopack (default bundler)
- TypeScript strict mode
- Tailwind CSS with shadcn/ui design system
- NextAuth v4 for authentication (JWT strategy)
- Zustand 5 for client state management
- TanStack Query 5 for server state
- Axios for HTTP requests
- next-intl for internationalization
- next-themes for dark mode
- pnpm as package manager

## Architecture & File Organization

### Route Groups

- `(admin)` — Authenticated admin pages with sidebar layout
- `(auth)` — Authentication pages (sign-in, sign-up, forgot-password, otp) without sidebar

### Key Directories

- `components/ui/` — shadcn/ui primitives (do NOT modify directly; regenerate with CLI)
- `components/icons/` — Custom icon components (e.g., `iig-icon.tsx`)
- `components/layout/` — All layout & toolbar components (sidebar, header, main, main-logo, nav-group, nav-user, top-nav, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences-applier). Barrel-exported via `index.ts`.
- `components/providers/` — React context providers (theme, query, preferences)
- `containers/<domain>/` — Feature-level smart components grouped by domain
- `stores/` — Zustand stores (preferences-store, sidebar-store)
- `services/<domain>/` — API logic: `<domain>.type.ts`, `<domain>.api.ts`, `<domain>.query.ts`
- `configs/` — Application constants (routes, sidebar navigation data)
- `lib/` — Shared utilities (auth, api-client, utils)
- `types/` — Shared TypeScript types (sidebar types, etc.)
- `i18n/` — Internationalization config (`config.ts`, `request.ts`) + `messages/` subfolder (en.json, vi.json)

### Admin Page Pattern

Every admin page MUST follow this structure:

```tsx
import {
  Header,
  Main,
  Search,
  LayoutControls,
  LanguageSwitcher,
  ThemeSwitch,
  ProfileDropdown,
} from '@/components/layout'

;<>
  <Header>
    <Search />
    <div className='ml-auto flex items-center gap-2'>
      <LayoutControls />
      <LanguageSwitcher />
      <ThemeSwitch />
      <ProfileDropdown />
    </div>
  </Header>
  <Main>{/* Page-specific content */}</Main>
</>
```

## Development Standards

### Components

- Use `'use client'` directive only when hooks, state, or browser APIs are needed
- Server Components by default for data fetching and static UI
- Import UI primitives from `@/components/ui/`
- Import layout & toolbar components from `@/components/layout/` (barrel export available via `@/components/layout`)

### Styling

- Tailwind CSS utility classes only — no inline styles or CSS modules
- Use CSS variables from `globals.css` for theme colors (e.g., `bg-background`, `text-foreground`)
- Responsive design: mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Dark mode via CSS variables — never use `dark:` variant directly; rely on the theme system
- Use `cn()` utility from `@/lib/utils` for conditional class merging

### State Management

- **Zustand** for client-only global state (preferences, sidebar)
- **TanStack Query** for server state (API data, caching, mutations)
- **React hooks** for local component state
- Never duplicate server state in Zustand — use TanStack Query

### API Integration

- Use the Axios client from `@/lib/api-client` for all API calls
- Follow the services pattern: `services/<domain>/<domain>.api.ts` for fetch functions
- Create TanStack Query hooks in `services/<domain>/<domain>.query.ts`
- Define types in `services/<domain>/<domain>.type.ts`

### Routes

- Always use `AppRoutes` from `@/configs/routes` — never hardcode route strings
- When adding new pages, add the route constant to `configs/routes.ts` first

### Internationalization

- Wrap translatable strings with `useTranslations()` hook from next-intl
- Add new keys to both `en.json` and `vi.json` in `src/i18n/messages/`
- Use namespaced translation keys: `t('dashboard.title')`
- Language switching is handled by `LanguageSwitcher` component via cookies + `router.refresh()`
- Locale config & supported locales defined in `src/i18n/config.ts`
- Server-side locale resolution in `src/i18n/request.ts`

### Authentication

- Use `getServerSession()` in Server Components for auth checks
- Use `useSession()` in Client Components
- Protect API routes with session validation
- Auth config is in `src/lib/auth.ts`

### Layout Preferences

- The preferences store (`stores/preferences-store.ts`) manages: themeMode, themePreset, font, scale, radius, contentLayout, navbarStyle, sidebarVariant, sidebarCollapsible
- `PreferencesApplier` component (`components/layout/preferences-applier.tsx`) applies:
  - Theme preset via `data-theme-preset` attribute on `<html>`
  - Font via CSS class on `<body>`
  - Scale via root `font-size` calculation (xs=0.9, normal=1, lg=1.1)
  - Radius via `--radius` CSS variable (sm=0.25rem, normal/md=0.5rem, lg=0.75rem, xl=1rem)
  - Content layout via `data-content-layout` attribute
- Theme presets (Default, Blue, Green, Orange, Tangerine, Soft Pop, Brutalist, Underground, Sunset Glow, Rose Garden, Lake View, Forest Whispers, Ocean Breeze, Lavender Dream) define CSS variable overrides in `globals.css` using `[data-theme-preset='<name>']` selectors with both light and dark variants
- Font switching uses Next.js font CSS variables (`--font-inter`, `--font-manrope`, `--font-nunito`, `--font-plus-jakarta-sans`, `--font-space-grotesk`, `--font-dm-sans`) with matching utility classes (`.font-inter`, `.font-manrope`, `.font-nunito`, `.font-plus-jakarta-sans`, `.font-space-grotesk`, `.font-dm-sans`, `.font-system`)
- The `Main` component reads `contentLayout` from the store and applies `max-w-screen-xl` for centered layout
- Layout components read from this store to adjust behavior
- Preferences persist to localStorage automatically via Zustand persist middleware

## Code Quality

- Prettier with single quotes, no semicolons, 100 char print width
- Tailwind class sorting via prettier-plugin-tailwindcss
- ESLint with Next.js recommended config
- Always handle loading and error states in data-fetching components
