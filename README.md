# Flow Stack Client

A modern task management frontend built with React 19, TypeScript, and Vite.

## Features

- **JWT authentication** with auto-refresh via HttpOnly cookies
- **Role-based access control** (User & Admin dashboards)
- **Task management** with CRUD, filtering, search, and pagination
- **Dashboard analytics** with real-time stats
- **User management** for admin users
- **Dark/light theme** with animated transitions
- **Responsive design** (mobile card views, desktop data tables)
- **Type-safe** throughout with TypeScript and Zod validation

## Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x
- Flow Stack Server running (see `flow-stack-server` project)

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_IMGBB_API_KEY=your_imgbb_api_key_here
```

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL |
| `VITE_IMGBB_API_KEY` | imgbb API key for profile image uploads |

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
│   ├── contexts/        # React contexts (auth)
│   ├── features/        # Feature modules (auth, task, dashboard, home)
│   ├── hooks/           # Shared custom hooks
│   ├── lib/             # Utilities, types, API client, enums
│   ├── providers/       # Context providers (theme, query)
│   ├── routes/          # Routing config and guards
│   └── stores/          # Zustand stores
├── public/              # Static assets (favicon, icons)
├── AGENTS.md            # Architecture guide
└── README.md            # This file
```

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool |
| Tailwind CSS v4 | Styling |
| shadcn/ui | Component library |
| TanStack Query | Server state |
| Zustand | Client state |
| React Hook Form + Zod | Forms & validation |
| Axios | HTTP client |
| React Router v8 | Routing |

## Scripts

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Type-check + production build
pnpm lint         # Run ESLint
pnpm preview      # Preview production build
```

## Architecture

This project follows **Feature-Driven Architecture** where each feature
module is self-contained with its own components, services, hooks, pages,
and validation schemas.

For architecture details, see [AGENTS.md](./AGENTS.md).
