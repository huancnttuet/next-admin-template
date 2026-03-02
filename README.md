# E-Learning Admin v2

A modern, feature-rich admin dashboard for e-learning platforms built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**.

## ✨ Features

- 🎨 **Beautiful UI** — Built on [shadcn/ui](https://ui.shadcn.com) with a fully customizable design system
- 🔐 **Authentication** — NextAuth v4 with credentials provider (JWT strategy)
- 🌍 **Internationalization** — Multi-language support via next-intl (English & Vietnamese)
- 🎛️ **Layout Preferences** — Real-time layout customization (theme preset, fonts, sidebar style, navbar behavior, etc.)
- 📊 **Dashboard** — Overview analytics with charts powered by Recharts
- 🧭 **Sidebar Navigation** — Collapsible sidebar with nested groups, multiple rendering modes
- 🌙 **Dark Mode** — Theme switching with next-themes (light/dark/system)
- 📱 **Responsive** — Mobile-first design with off-canvas sidebar support
- ⚡ **Fast** — Turbopack for development, optimized builds

## 🛠️ Tech Stack

| Category             | Technology                                                |
| -------------------- | --------------------------------------------------------- |
| Framework            | [Next.js 16](https://nextjs.org) (App Router)              |
| Language             | [TypeScript](https://www.typescriptlang.org)              |
| Styling              | [Tailwind CSS](https://tailwindcss.com)                   |
| UI Components        | [shadcn/ui](https://ui.shadcn.com) (Radix UI)             |
| Authentication       | [NextAuth.js v4](https://next-auth.js.org)                |
| State Management     | [Zustand 5](https://zustand-demo.pmnd.rs)                 |
| Server State         | [TanStack Query 5](https://tanstack.com/query)            |
| HTTP Client          | [Axios](https://axios-http.com)                           |
| Internationalization | [next-intl](https://next-intl-docs.vercel.app)            |
| Charts               | [Recharts](https://recharts.org)                          |
| Theme                | [next-themes](https://github.com/pacocoursey/next-themes) |
| Linting              | ESLint + Prettier                                         |
| Package Manager      | pnpm                                                      |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (admin)/            # Admin route group (with sidebar layout)
│   │   ├── page.tsx        # Dashboard
│   │   ├── layout.tsx      # Admin layout (sidebar + content)
│   │   ├── apps/           # Apps page
│   │   ├── chats/          # Chat page
│   │   ├── errors/         # Error pages (401, 403, 404, 500, 503)
│   │   ├── help-center/    # Help center
│   │   ├── settings/       # Settings (profile, account, appearance, etc.)
│   │   ├── tasks/          # Tasks page
│   │   └── users/          # Users page
│   ├── (auth)/             # Auth route group (no sidebar)
│   │   ├── sign-in/        # Sign in
│   │   ├── sign-up/        # Sign up
│   │   ├── forgot-password/# Forgot password
│   │   └── otp/            # OTP verification
│   ├── sign-in-2/          # Alternate sign-in (split layout)
│   └── api/auth/           # NextAuth API routes
├── components/
│   ├── icons/              # Custom icon components (e.g., iig-icon)
│   ├── layout/             # All layout & toolbar components (sidebar, header, nav, main, search, theme-switch, profile-dropdown, language-switcher, layout-controls, preferences-applier)
│   ├── providers/          # React providers (theme, query, preferences)
│   └── ui/                 # shadcn/ui primitives
├── configs/                # App configuration (routes, sidebar navigation data)
├── containers/             # Feature containers (dashboard components)
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config + messages/ translations
├── lib/                    # Utilities (auth, API client, helpers)
├── stores/                 # Zustand stores (preferences, sidebar)
└── types/                  # Shared TypeScript types (sidebar, etc.)
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
cp .env.example .env.local
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

| Variable              | Description           | Default                     |
| --------------------- | --------------------- | --------------------------- |
| `NEXTAUTH_URL`        | Auth callback URL     | `http://localhost:3000`     |
| `NEXTAUTH_SECRET`     | JWT encryption secret | —                           |
| `NEXT_PUBLIC_API_URL` | Backend API base URL  | `http://localhost:8000/api` |

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

Authentication is handled by NextAuth.js v4 with a credentials provider. The default configuration uses JWT strategy. Update `src/lib/auth.ts` to integrate with your backend API.

**Default credentials (development):**

- Email: `admin@example.com`
- Password: `admin123`

## 🌍 Internationalization

The app supports multiple languages using next-intl. Translation files are located in `src/i18n/messages/`:

- `en.json` — English
- `vi.json` — Vietnamese

Language switching is available via the **Language Switcher** (🌐) button in the header toolbar. The selected locale is persisted in a cookie.

To add a new language:

1. Create a new JSON file in `src/i18n/messages/` (e.g., `ja.json`)
2. Add the locale to the `locales` array in `src/i18n/config.ts`
3. Add the label to `LOCALE_LABELS` in `src/components/layout/language-switcher.tsx`

## 📖 Credits

- UI inspired by [shadcn-admin](https://github.com/satnaing/shadcn-admin) by Sat Naing
- Layout preferences inspired by [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by Arham Khan

## 📄 License

MIT
