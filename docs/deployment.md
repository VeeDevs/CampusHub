# Deployment Guide

## Frontend (Vercel)
1. Import repository into Vercel.
2. Set root directory to `frontend`.
3. Set env vars:
   - `NEXT_PUBLIC_API_URL=https://<backend-domain>/api`
   - `NEXT_PUBLIC_APP_URL=https://<frontend-domain>`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>`
4. Deploy.

## Backend (Render)
1. Create a new Web Service from this repo.
2. Root directory: `backend`.
3. Build command: `npm install && npx prisma generate --schema ../database/prisma/schema.prisma && npm run build`
4. Start command: `npm run start`
5. Add env vars:
   - `NODE_ENV=production`
   - `BACKEND_PORT=8080`
   - `DATABASE_URL=<managed-postgres-url>`
   - `JWT_SECRET=<secure-random-secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_ORIGIN=https://<frontend-domain>`
   - `OPENAI_API_KEY=<optional>`
   - `STRIPE_SECRET_KEY=<optional>`
   - `PLATFORM_COMMISSION_RATE=0.10`

## Database
Use managed PostgreSQL and run:
- `npm run prisma:generate`
- `npm run db:migrate`
- `npm run seed` (optional)

## Railway Alternative
- Deploy backend service from `backend/`
- Attach PostgreSQL plugin
- Configure same env vars as Render

## Production Checklist
- Rotate secrets and use strong JWT key
- Restrict CORS to real frontend domain
- Enable Stripe webhooks if using payment confirmation events
- Enable backups for PostgreSQL
- Add S3/Cloudinary storage credentials for note/item uploads
