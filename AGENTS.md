# AGENTS.md - Technical Architecture Guide

## System Architecture

Flow Stack Client is a **React 19 + TypeScript** single-page application built
with **Vite** following **Folder-Per-Concern Architecture**.

```
src/
├── main.tsx                    # App bootstrap (providers wrapping)
├── App.tsx                     # Root: RouterProvider only
├── index.css                   # Tailwind v4, CSS custom properties, theming
├── assets/                     # Static assets (images, icons)
├── components/
│   ├── shared/                 # Reusable cross-feature components
│   │   ├── alert-dialog-confirm.tsx  # Reusable delete confirmation dialog
│   │   ├── auth-loader.tsx           # App-level auth loading
│   │   ├── container.tsx             # Responsive width wrapper
│   │   ├── data-table.tsx            # Table with columns API + renderCard (mobile)
│   │   ├── error-state.tsx           # Consistent error UI with retry
│   │   ├── file-upload.tsx           # Image upload with preview + onFileSelect
│   │   ├── footer.tsx                # Site footer
│   │   ├── loading-skeleton.tsx      # Skeleton loaders (stats, table, card)
│   │   ├── navbar.tsx                # Top navigation bar
│   │   ├── search-input.tsx          # Debounced search input
│   │   └── task-filters.tsx          # Search + Status + Priority filter bar
│   └── ui/                     # shadcn/ui, Ark UI, Base UI components (DO NOT MODIFY)
├── constants/                  # Static constants and config maps
│   └── enums.ts                # STATUS_CONFIG, PRIORITY_CONFIG, ROLE_CONFIG
├── hooks/                      # All custom hooks (shared + domain)
│   ├── use-dashboard.ts        # Dashboard hooks (user/admin stats, users, tasks)
│   ├── use-debounce.ts         # Debounce hook for search
│   ├── use-image-upload.ts     # Immediate image upload (on file select)
│   ├── use-mobile.ts           # Responsive breakpoint detection
│   └── use-task.ts             # Task CRUD hooks
├── layouts/                    # Layout components (route wrappers)
│   ├── root-layout.tsx         # Navbar + Outlet + Footer (hidden on /dashboard/*)
│   └── dashboard-layout.tsx    # Sticky header + ScrollArea sidebar + Outlet
├── lib/                        # Configuration and utilities
│   ├── axios.ts                # Axios instance with interceptors
│   ├── upload-image.ts         # imgbb image upload service
│   └── utils.ts                # Re-export of cn() for components/ui compat
├── pages/                      # All page components (route endpoints)
│   ├── home-page.tsx           # Landing page
│   ├── sign-in-page.tsx        # Auth: sign in
│   ├── sign-up-page.tsx        # Auth: sign up (immediate image upload)
│   ├── dashboard-overview.tsx  # Role-aware overview (AdminOverviewPage / UserOverviewPage)
│   ├── add-task-page.tsx       # User: create task
│   ├── my-tasks-page.tsx       # User: task list with filters
│   ├── user-overview-page.tsx  # User: dashboard stats
│   ├── profile-page.tsx        # Shared: user/admin profile
│   ├── admin-overview-page.tsx # Admin: dashboard stats
│   ├── admin-all-tasks-page.tsx # Admin: all tasks management
│   └── admin-all-users-page.tsx # Admin: user management
├── providers/                  # Context providers
│   ├── provider-wrapper.tsx    # AuthLoader + QueryProvider + ThemeProvider + Toaster
│   ├── query-provider.tsx      # TanStack QueryClientProvider
│   └── theme-provider.tsx      # next-themes ThemeProvider wrapper
├── routes/                     # Routing configuration
│   ├── router.tsx              # createBrowserRouter with all routes
│   └── protected-route.tsx     # Auth guard with optional role-based access
├── services/                   # API service functions
│   ├── auth.ts                 # Auth API (signUp, signIn, signOut, getProfile)
│   ├── dashboard.ts            # Dashboard API (user/admin stats, users, tasks)
│   └── task.ts                 # Task CRUD API
├── stores/                     # Zustand stores
│   ├── auth-store.ts           # Authentication state (user, isLoading)
│   └── task-filter-store.ts    # Table filter/search/pagination state
├── types/                      # TypeScript type definitions
│   ├── api.ts                  # TPagination, TSuccessResponse, TResponse
│   ├── api-types.ts            # Payload types, dashboard types, JWT types
│   ├── dashboard.ts            # TUserDashboard, TAdminDashboard, TAdminUser
│   ├── task.ts                 # Priority, Status enums + TTask interface
│   └── user.ts                 # Role enum + TUser interface
├── utils/                      # Standalone utility functions
│   └── utils.ts                # cn() utility (clsx + tailwind-merge)
└── validation/                 # Zod validation schemas
    ├── auth.schema.ts          # signInSchema, signUpSchema
    └── task.schema.ts          # taskSchema, taskUpdateSchema
```

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Component registry (base-lyra style) |
| Ark UI | Headless primitives (Tabs, Field, RadioGroup, etc.) |
| Base UI | Headless primitives (Dialog, Dropdown, ScrollArea, etc.) |
| Magic UI | Animated theme toggler, particles, grid patterns |
| TanStack Query | Server state management |
| Zustand | Client state (filter/search/pagination) |
| React Hook Form | Form state management |
| Zod v4 | Schema validation |
| Axios | HTTP client with interceptors |
| sonner | Toast notifications |
| next-themes | Dark/light theme switching |
| Motion | Animation library |
| React Router v8 | Client-side routing (data mode) |

## Routing

All dashboard routes live under `/dashboard`. The root layout hides Navbar/Footer
for any path starting with `/dashboard`. The dashboard layout provides a sticky
header and a fixed sidebar with independent scrolling via `ScrollArea`.

| Path | Auth | Role | Description |
|---|---|---|---|
| `/` | No | - | Home page |
| `/sign-in` | No | - | Sign in page |
| `/sign-up` | No | - | Sign up page |
| `/dashboard` | Yes | ANY | Role-aware overview (admin or user) |
| `/dashboard/profile` | Yes | ANY | User/Admin profile |
| `/dashboard/add-task` | Yes | USER | Create new task |
| `/dashboard/my-tasks` | Yes | USER | User's task list |
| `/dashboard/all-tasks` | Yes | ADMIN | All tasks management |
| `/dashboard/all-users` | Yes | ADMIN | User management |

No `/admin` or `/user` segments appear in URL paths. Role-based access is
enforced via nested `ProtectedRoute` components with `allowedRoles`.

## Authentication

- **Stateless JWT dual-token** via HttpOnly cookies (managed by server)
- Auth state fetched from `/api/v1/auth/profile` on app load
- Axios interceptor auto-refreshes expired tokens
- `ProtectedRoute` component wraps authenticated routes with optional role filter
- The outer `ProtectedRoute` (no `allowedRoles`) blocks unauthenticated users
- Inner `ProtectedRoute` (with `allowedRoles`) redirects unauthorized roles to `/dashboard`

## State Management

- **TanStack Query**: All server state (tasks, dashboard, users)
- **Zustand**: Client state (auth, task filter/search/pagination)
- **React Hook Form**: Form state per form instance
- **Zustand auth store**: Union-typed state (`AuthState`) with standalone async actions

## Image Upload

- Images are uploaded **immediately on file selection** (not on form submit)
- `useImageUpload` hook wraps the `uploadImage()` service call
- `FileUpload` component shows preview and calls `onFileSelect` with the raw `File`
- Sign-up page triggers `uploadImage` on file select and stores the returned URL
- The form submits the already-uploaded URL (or none)

## API Integration

Single shared Axios instance (`src/lib/axios.ts`):
- Base URL from `VITE_API_BASE_URL` env variable
- `withCredentials: true` for cookie auth
- Auto-refresh interceptor (411 → refresh token → retry)

Each feature has its own `services/` folder with API call functions,
wrapped in custom hooks using `useQuery` / `useMutation`.

## DataTable

The shared `DataTable` component (`src/components/shared/data-table.tsx`) uses
a simple `DataTableColumn<T>` API (not TanStack Table):

```ts
interface DataTableColumn<T> {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}
```

- Above `sm` breakpoint: renders a HTML table
- Below `sm` breakpoint: renders cards via the `renderCard` prop
- Server-side pagination via `TPagination` (prev/next buttons)
- Loading spinner and empty state built-in

## Code Conventions

- **Arrow functions** for all components and hooks
- **Folder-per-concern** structure (flat directories for pages, hooks, services)
- **Zod schemas** with TypeScript inference for all forms
- **Enum + config map pattern** for Status, Priority, Role
- **No comments** unless explicitly requested
- **Shared components** in `components/shared/` — no duplication
- **Controller pattern** for React Hook Form (field, fieldState destructuring)
- **Toast notifications** via `sonner` (`toast.success()`, `toast.error()`, `toast.loading()`)

## Build & Lint

```bash
pnpm lint         # ESLint
pnpm build        # tsc -b && vite build
pnpm dev          # Dev server on port 3000
```
