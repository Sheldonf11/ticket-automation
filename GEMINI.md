# Project Memory: helphesk

## Project Overview
`helphesk` is an AI-powered ticket management system designed to automate ticket classification, summaries, and responses using the Claude API. It aims to deliver faster, more personalized support to students while freeing up agents for complex issues.

## Tech Stack
- **Runtime**: Bun (v1.3.12+)
- **Frontend**: React (TypeScript) via Vite
- **Backend**: Node.js (Express) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn UI (base-nova style, neutral base color)
- **UI Components**: shadcn UI — add components via `npx shadcn@latest add <component>`
- **Icons**: Lucide React (`lucide-react`)
- **Font**: Geist Variable (via `@fontsource-variable/geist`)
- **API Architecture**: RESTful API
- **Data Fetching**: Axios + TanStack Query (React Query)
- **Testing**: Vitest + React Testing Library (Component Testing) & Playwright (E2E)
- **AI**: Anthropic Claude API (Planned for Phase 5)

## Project Structure
The project consists of two independent, standalone directories. **Do not use a monorepo or Bun workspaces.**
- `/client`: Independent React + TypeScript frontend.
- `/server`: Independent Express + TypeScript backend.
- Both maintain their own `package.json`, `bun.lock`, and `node_modules`.

### Client Directory Layout
- `components.json` — shadcn configuration (style: base-nova, rsc: false)
- `src/components/ui/` — shadcn UI components (Button, Card, Input, Label, Alert, Badge)
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `src/lib/auth-client.ts` — Better Auth client
- `src/pages/` — Page components (Login, Home, Users)
- `src/components/` — Shared components (ProtectedRoute, AdminRoute)

### Path Aliases
- `@/*` maps to `./src/*` — configured in both `tsconfig.json` (for shadcn CLI) and `tsconfig.app.json` (for TypeScript), plus `vite.config.ts` (for Vite bundling).
- **Do NOT use `baseUrl`** — it is deprecated in TypeScript 6.0+. Use `paths` only.
- Always use `@/` imports in components (e.g., `import { Button } from '@/components/ui/button'`).

## Development & Testing Commands
- **Root**: `bun run test:e2e` (Triggers Playwright test suite leveraging test database isolation).
- **Client**: `cd client && bun run dev` (Starts Vite at http://localhost:5173).
- **Client (Tests)**: `cd client && bun run test:component` (Runs Vitest component tests).
- **Server**: `cd server && bun run dev` (Starts Express at http://localhost:3001).

### E2E Testing Architecture
- **Framework**: Playwright via `@playwright/test`.
- **Isolation Strategy**: The root `playwright.config.ts` dynamically spins up decoupled testing servers (Backend: `3002`, Frontend: `5174`) so development runs aren't interrupted.
- **Database Provisioning**: The `e2e/global-setup.ts` strictly enforces a clean test database (`helpdesk_test`) populated via `bunx prisma db push --force-reset` combined with an automatic admin `db:seed` execution per testing cycle.

## Key Conventions
- **Naming**: Use `camelCase` for variables/functions and `PascalCase` for React components.
- **Styling**: Use **only shadcn design tokens** for colors and spacing. Never hardcode color values like `neutral-500` or `bg-white` — use semantic tokens instead (`text-muted-foreground`, `bg-background`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`, `text-destructive`, etc.).
- **Components**: Always use shadcn UI components (Button, Input, Card, Badge, Alert, Label, etc.) instead of raw HTML elements with manual Tailwind classes.
- **TypeScript**: Maintain strict type safety. Avoid `any`.
- **API**: Backend healthcheck available at `/api/health`.
- **Data Fetching**: Use **TanStack Query (React Query)** for state management and **Axios** for HTTP requests.
  - **Axios Config**: Always include `withCredentials: true` to ensure Better Auth session cookies are transmitted.
  - **Hooks**: Use `useQuery` for reads and `useMutation` for writes (POST/PUT/DELETE).
- **Component Testing**:
  - Use **Vitest** and **React Testing Library** for unit and component-level testing.
  - Test files must use the `.test.tsx` extension.
  - **Utilities**: Always use `renderWithProviders` from `@/test/render` to ensure components are wrapped with `QueryClientProvider` and `MemoryRouter`.

## Foundational Mandates
### Documentation & Research
- **Context7 Priority**: Always use the `context7` tool suite (`mcp_context7_resolve-library-id` and `mcp_context7_query-docs`) to fetch current documentation for all libraries (React, Express, Bun, Vite, etc.).
- **Recent Changes**: Do not rely on training data for library syntax; always verify with Context7.
- **Search Preference**: Prefer Context7 over general web searches.

### Architecture
- **Isolation**: Keep `client` and `server` strictly decoupled with their own dependency management.

### Backend & Authentication
- **Better Auth**: Implemented via `better-auth/node` using the `toNodeHandler(auth)` mounted at `/api/auth/*splat`.
- **CORS Requirements**: API must be configured with `credentials: true` and an explicit `origin` (falling back to `http://localhost:5173` via `process.env.FRONTEND_URL`). Wildcard `*` origins will break session cookies securely required by Better Auth.
- **Middleware**: Protected routes use the `requireAuth` middleware (`server/src/middleware/requireAuth.ts`) which calls `auth.api.getSession()` with `fromNodeHeaders(req.headers)` and attaches `req.user` and `req.session`.
- **Express Types**: Custom Request properties (like `user` and `session`) are globally declared in `server/src/types/express.d.ts`. Avoid inline module augmentations.

### Auth Server Configuration (`server/src/lib/auth.ts`)
- **Adapter**: Prisma adapter with PostgreSQL (`prismaAdapter` from `better-auth/adapters/prisma`).
- **Database**: PostgreSQL via Prisma Client with `@prisma/adapter-pg` (connection string from `DATABASE_URL`).
- **Auth Method**: Email + password (`emailAndPassword: { enabled: true }`).
- **User Roles**: Custom `role` field on the User model as an `additionalField` with type `["admin", "agent"]`, defaulting to `"agent"`. Defined as a Prisma enum `Role { admin, agent }`.
- **Signup Restriction**: Public signups are **disabled** via a `databaseHooks.user.create.before` hook that throws `APIError("BAD_REQUEST")` unless `process.env.ALLOW_SEED_SIGNUP === "true"`. Only the seed script can create users.
- **Rate Limiting**: Enforced via Better Auth explicitly only in production (`process.env.NODE_ENV === "production"`).
- **Trusted Origins**: Set via `trustedOrigins: [process.env.FRONTEND_URL]`.
- **Session Type**: Exported as `type Session = typeof auth.$Infer.Session` for use in middleware and type declarations.

### Database Schema (`server/prisma/schema.prisma`)
- **Models**: `User`, `Session`, `Account`, `Verification` — all following Better Auth's core schema.
- **Table Mapping**: Models use `@@map()` to lowercase table names (e.g., `User` → `"user"`).
- **Cascade Deletes**: `Session` and `Account` cascade on user deletion.
- **Migrations**: Run via `bun prisma migrate dev`.

### Seed Script (`server/prisma/seed.ts`)
- Creates an initial admin user using `auth.api.signUpEmail()`.
- Temporarily sets `ALLOW_SEED_SIGNUP=true` to bypass the signup block.
- Reads credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars.
- Run via `cd server && bun run db:seed`.
- Idempotent — logs a skip message if the user already exists.

### Client-Side Auth (`client/src/lib/auth-client.ts`)
- Uses `createAuthClient` from `better-auth/react` with `baseURL: "http://localhost:3001"`.
- Exports `signIn`, `signUp`, `signOut`, `useSession` for use across components.
- `useSession()` returns `{ data: session, isPending }` — used by `ProtectedRoute` and page components.

### Protected Routes (`client/src/components/ProtectedRoute.tsx` & `AdminRoute.tsx`)
- `ProtectedRoute`: Wraps standard authenticated pages (e.g., `<Home />`). Details:
  - Shows a loading spinner (`Loader2`) while `isPending` is true.
  - Redirects to `/login` if no session exists.
- `AdminRoute`: Wraps admin-only pages (e.g., `<Users />`). Details:
  - Validates authentication state identically to `ProtectedRoute`.
  - Performs an additional strict check for `session.user.role === 'admin'`.
  - Redirects authenticated but non-admin users to `/`.

### Required Environment Variables (`server/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for session signing (min 32 chars) |
| `BETTER_AUTH_URL` | Backend URL (`http://localhost:3001`) |
| `FRONTEND_URL` | Frontend URL for CORS + trusted origins (`http://localhost:5173`) |
| `ADMIN_EMAIL` | Initial admin user email (used by seed script) |
| `ADMIN_PASSWORD` | Initial admin user password (used by seed script) |
| `ALLOW_SEED_SIGNUP` | Set to `"true"` only during seeding; defaults to `"false"` |

