# Tech Stack: helphesk

## Frontend
- **Framework:** React (TypeScript)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State Management:** TanStack Query (React Query) for server state

## Backend
- **Runtime:** Node.js (Express) with TypeScript
- **Authentication:** Database-backed sessions (e.g., `express-session` with a PostgreSQL store)
- **API Architecture:** RESTful API

## Database & ORM
- **Database:** PostgreSQL (Relational data for tickets, users, categories)
- **ORM:** Prisma (Type-safe access and migrations)

## AI & Integrations
- **LLM:** Anthropic Claude API (Classification, summaries, and suggested replies)
- **Email:** SendGrid or Mailgun (Outbound replies and inbound webhooks)

## Infrastructure
- **Deployment:** Docker
- **Hosting:** Cloud provider (AWS, Railway, or Fly.io)
