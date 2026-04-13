# Project Memory: helphesk

## Project Overview
`helphesk` is an AI-powered ticket management system designed to automate ticket classification, summaries, and responses using the Claude API. It aims to deliver faster, more personalized support to students while freeing up agents for complex issues.

## Tech Stack
- **Runtime**: Bun (v1.3.12+)
- **Frontend**: React (TypeScript) via Vite
- **Backend**: Node.js (Express) with TypeScript
- **Styling**: Vanilla CSS (Simple, centered layouts)
- **API Architecture**: RESTful API
- **AI**: Anthropic Claude API (Planned for Phase 5)

## Project Structure
The project consists of two independent, standalone directories. **Do not use a monorepo or Bun workspaces.**
- `/client`: Independent React + TypeScript frontend.
- `/server`: Independent Express + TypeScript backend.
- Both maintain their own `package.json`, `bun.lock`, and `node_modules`.

## Development Commands
- **Root**: None (Use local directory commands).
- **Client**: `cd client && bun run dev` (Starts Vite at http://localhost:5173).
- **Server**: `cd server && bun run dev` (Starts Express at http://localhost:3001).

## Key Conventions
- **Naming**: Use `camelCase` for variables/functions and `PascalCase` for React components.
- **Styles**: Prefer inline styles or `index.css` for simplicity during the initial phases.
- **TypeScript**: Maintain strict type safety. Avoid `any`.
- **API**: Backend healthcheck available at `/api/health`.

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
- **Middleware**: Protected routes use the `requireAuth` middleware which attaches `req.user` and `req.session`.
- **Express Types**: Custom Request properties (like `user` and `session`) are globally declared in `server/src/types/express.d.ts`. Avoid inline module augmentations.
