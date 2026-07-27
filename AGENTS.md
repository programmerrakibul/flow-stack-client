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
│   │   ├── auth-loader.tsx     # App-level auth loading
│   │   ├── container.tsx       # Responsive width wrapper
│   │   ├── data-table.tsx      # TanStack Table wrapper with pagination
│   │   ├── search-input.tsx    # Debounced search input
│   │   ├── error-state.tsx     # Consistent error UI with retry
│   │   └── loading-skeleton.tsx # Skeleton loaders (stats, table, card)
│   └── ui/                     # shadcn/ui, Ark UI, Base UI components (DO NOT MODIFY)
├── constants/                  # Static constants and config maps
│   └── enums.ts                # STATUS_CONFIG, PRIORITY_CONFIG, ROLE_CONFIG
├── hooks/                      # All custom hooks (shared + domain)
│   ├── use-auth.ts             # Zustand auth store consumer
│   ├── use-auth-mutations.ts   # useSignUp, useSignIn, useSignOut, useProfile
│   ├── use-dashboard-queries.ts # Dashboard hooks (user/admin)
│   ├── use-debounce.ts         # Debounce hook for search
│   ├── use-mobile.ts           # Responsive breakpoint detection
│   └── use-task-queries.ts     # Task CRUD hooks
├── layouts/                    # Layout components (route wrappers)
│   ├── root-layout.tsx         # Navbar + Outlet + Footer
│   ├── dashboard-layout.tsx    # Sidebar + header + Outlet
│   ├── navbar.tsx              # Top navigation bar
│   └── footer.tsx              # Site footer
├── lib/                        # Configuration and Axios instance
│   ├── axios.ts                # Axios instance with interceptors
│   └── utils.ts                # Re-export of cn() for components/ui compat
├── pages/                      # All page components (route endpoints)
│   ├── home-page.tsx           # Landing page
│   ├── sign-in-page.tsx        # Auth: sign in
│   ├── sign-up-page.tsx        # Auth: sign up
│   ├── add-task-page.tsx       # User: create task
│   ├── my-tasks-page.tsx       # User: task list with filters
│   ├── user-overview-page.tsx  # User: dashboard stats
│   ├── profile-page.tsx        # Shared: user/admin profile
│   ├── admin-overview-page.tsx # Admin: dashboard stats
│   ├── admin-all-tasks-page.tsx # Admin: all tasks management
│   └── admin-all-users-page.tsx # Admin: user management
├── providers/                  # Context providers
│   ├── theme-provider.tsx      # next-themes ThemeProvider wrapper
│   └── query-provider.tsx      # TanStack QueryClientProvider wrapper
├── routes/                     # Routing configuration
│   ├── router.tsx              # createBrowserRouter with all routes
│   └── protected-route.tsx     # Auth guard with role-based access
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
│   ├── task.ts                 # Priority, Status enums + TTask interface
│   └── user.ts                 # Role enum + TUser interface
├── utils/                      # Standalone utility functions
│   ├── auth-actions.ts         # fetchProfile(), signOut() (async, calls store)
│   ├── cn.ts                   # cn() utility (clsx + tailwind-merge)
│   └── local-storage.ts       # localStorage wrapper
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
| Ark UI | Headless primitives (Toast, Tabs, Field, etc.) |
| Base UI | Headless primitives (Dialog, Dropdown, Radio, etc.) |
| Magic UI | Animated theme toggler, particles, grid patterns |
| TanStack Query | Server state management |
| TanStack Table | Data table rendering |
| Zustand | Client state (filter/search/pagination) |
| React Hook Form | Form state management |
| Zod v4 | Schema validation |
| Axios | HTTP client with interceptors |
| next-themes | Dark/light theme switching |
| Motion | Animation library |
| React Router v8 | Client-side routing (data mode) |

## Routing

Uses `createBrowserRouter` (React Router data mode):

| Path | Auth | Role | Description |
|---|---|---|---|
| `/` | No | - | Home page |
| `/sign-in` | No | - | Sign in page |
| `/sign-up` | No | - | Sign up page |
| `/dashboard/overview` | Yes | USER | User dashboard overview |
| `/dashboard/add-task` | Yes | USER | Create new task |
| `/dashboard/my-tasks` | Yes | USER | User's task list |
| `/dashboard/profile` | Yes | USER | User profile |
| `/admin/dashboard` | Yes | ADMIN | Admin dashboard overview |
| `/admin/all-tasks` | Yes | ADMIN | All tasks management |
| `/admin/all-users` | Yes | ADMIN | User management |
| `/admin/profile` | Yes | ADMIN | Admin profile |

## Authentication

- **Stateless JWT dual-token** via HttpOnly cookies (managed by server)
- Auth state fetched from `/api/v1/auth/profile` on app load
- Axios interceptor auto-refreshes expired tokens
- `ProtectedRoute` component wraps authenticated routes
- Role-based access via `allowedRoles` prop

## State Management

- **TanStack Query**: All server state (tasks, dashboard, users)
- **Zustand**: Client state (task filter/search/pagination in URL-synced store)
- **React Hook Form**: Form state per form instance
- **AuthContext**: Current user state (fetched from API)

## API Integration

Single shared Axios instance (`src/lib/axios.ts`):
- Base URL from `VITE_API_BASE_URL` env variable
- `withCredentials: true` for cookie auth
- Auto-refresh interceptor (411 → refresh token → retry)

Each feature has its own `services/` folder with API call functions,
wrapped in custom hooks using `useQuery` / `useMutation`.

## Code Conventions

- **Arrow functions** for all non-framework functions
- **Feature-driven** structure: each feature is self-contained
- **Zod schemas** with TypeScript inference for all forms
- **Enum + config map pattern** for Status, Priority, Role
- **No comments** unless explicitly requested
- **Shared components** in `components/shared/` - no duplication
- **Controller pattern** for React Hook Form (field, fieldState destructuring)

## Database Commands

This is a client-only project. Server commands are in the `flow-stack-server`
project.
