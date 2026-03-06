# CampusHub

CampusHub is a full-stack student economic ecosystem SaaS where students can sell services, sell notes, find jobs, trade items, chat, socialize, and use AI study tools.

## Tech Stack
- Frontend: Next.js 14, React, TypeScript, TailwindCSS
- Backend: Node.js, Express, TypeScript, Socket.io
- Database: PostgreSQL + Prisma
- Auth: JWT + bcrypt
- Payments: Stripe Payment Intents
- AI: OpenAI API
- Infra: Docker, GitHub Actions

## Monorepo Structure
- `frontend/` Next.js landing + app UI
- `backend/` Express API + Socket.io
- `database/` Prisma schema + seed
- `docs/` deployment and API docs
- `scripts/` helper scripts

## Environment Setup
1. Copy `.env.example` to `.env`
2. Update secrets and keys

Minimum required values:
- `DATABASE_URL`
- `JWT_SECRET`

Optional integrations:
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Cloudinary keys (`CLOUDINARY_*`)

## Local Run (Recommended)
1. Start PostgreSQL with Docker:
   - `docker compose up -d postgres`
2. Install deps:
   - `npm install`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run db:migrate`
5. Seed demo data:
   - `npm run seed`
6. Start frontend + backend:
   - `npm run dev`

Frontend: `http://localhost:3000`
Backend: `http://localhost:8080`

## Demo Accounts
After seeding:
- Student: `student@campushub.app` / `Password123!`
- Business: `biz@campushub.app` / `Password123!`
- Admin: `admin@campushub.app` / `Password123!`

## Available Modules
- Authentication (register/login/reset/logout/profile)
- Services marketplace (CRUD + booking + reviews)
- Notes marketplace (upload/purchase/download/ratings)
- Student job board (post/apply)
- Item marketplace (list/update)
- Messaging (REST + Socket.io real-time)
- Social feed (posts/comments/likes)
- Business deals
- AI study assistant (summaries/QA/quiz/flashcards/study plan)
- Admin dashboard (users/moderation/analytics)
- Global search (services/items/notes/jobs + filters)
- Notifications (bookings/applications/etc.)
- Payments and transaction records (Stripe or local fallback)

## Docker (Full Stack)
- `docker compose up --build`

## Cloud Deployment
- Frontend: Vercel (`frontend/`)
- Backend: Render/Railway (`backend/`)
- Database: Managed PostgreSQL

Detailed instructions in [docs/deployment.md](docs/deployment.md).

## CI
GitHub Actions workflow builds frontend + backend on push/PR to `main`.

## Notes
- If Stripe/OpenAI keys are not set, the app still runs with graceful fallbacks.
- Backend enforces JWT auth, role guards, validation, CORS, Helmet, and rate limiting.
