# Flow Stack Client

A modern task management frontend built with React 19, TypeScript, and Vite.

## Features

- **JWT authentication** with auto-refresh via HttpOnly cookies
- **Role-based access control** (User & Admin dashboards under a single
  `/dashboard` path)
- **Task management** with CRUD, filtering, search, pagination, and inline edit
  dialog
- **Dashboard analytics** with real-time stats for both user and admin roles
- **User management** — activate/inactivate and delete users (admin only)
- **Dark/light theme** with animated transitions
- **Responsive design** — mobile card views via `renderCard`, desktop data
  tables
- **Type-safe** throughout with TypeScript and Zod validation
- **Immediate image upload** — profile images upload on file selection, not form
  submission

## Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

| Variable            | Description          |
| ------------------- | -------------------- |
| `VITE_API_BASE_URL` | Backend API base URL |

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The app will start at `http://localhost:3000`.

### 3. Build for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
flow-stack-client/
├── src/
│   ├── components/      # UI components (shared + ui/)
│   ├── hooks/           # Shared custom hooks
│   ├── layouts/         # Page layout wrappers
│   ├── lib/             # Axios config, utilities
│   ├── pages/           # All page components (route endpoints)
│   ├── providers/       # Context providers (theme, query, sonner)
│   ├── routes/          # Routing config and auth guards
│   ├── services/        # API service functions
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Standalone utility functions
│   └── validation/      # Zod validation schemas
├── public/              # Static assets (favicon, icons)
├── AGENTS.md            # Architecture guide
└── README.md            # This file
```

## Tech Stack

| Technology            | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| React 19              | UI framework                                             |
| TypeScript 6          | Type safety                                              |
| Vite 8                | Build tool                                               |
| Tailwind CSS v4       | Styling                                                  |
| shadcn/ui             | Component library                                        |
| Ark UI                | Headless primitives (Tabs, Field, etc.)                  |
| Base UI               | Headless primitives (Dialog, Dropdown, ScrollArea, etc.) |
| TanStack Query        | Server state (tasks, users)                              |
| Zustand               | Client state (auth, dashboard, filters)                  |
| React Hook Form + Zod | Forms & validation                                       |
| Axios                 | HTTP client                                              |
| sonner                | Toast notifications                                      |
| React Router v8       | Routing                                                  |
| next-themes           | Theme switching                                          |
| Motion                | Animation library (home page)                            |

## Scripts

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Type-check + production build
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

## Architecture

This project follows **Folder-Per-Concern Architecture** with flat directories
for pages, services, hooks, and validation. Shared UI components live in
`components/shared/`. Pre-built primitives live in `components/ui/` (do not
modify).

For architecture details, see [AGENTS.md](./AGENTS.md).
