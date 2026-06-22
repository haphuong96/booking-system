# Booking System API

Backend API for Jitsu's driver booking system. Drivers reserve delivery tickets in a booking session, then claim a route assignment in a matching zone.

**Stack:** NestJS 11 · Prisma 7 · PostgreSQL 18 · TypeScript

---

## Prerequisites

- Node.js 20+
- Docker (for the PostgreSQL container)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the database
docker compose up -d   # from the repo root

# 3. Copy and fill in environment variables
cp .env.example .env   # or create .env manually (see Environment section)

# 4. Apply migrations and generate the Prisma client
npx prisma migrate deploy
npx prisma generate

# 5. Seed initial data (15 drivers, 40 routes across 10 zones)
npm run db:seed

# 6. Start the dev server
npm run start:dev
```

The API is available at `http://localhost:3000`.

---

## Environment

Create a `.env` file in `booking-system-api/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_system?schema=public"
```

---

## Commands

```bash
# Development
npm run start:dev       # watch mode
npm run start:debug     # watch + debugger

# Build & production
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Lint / format
npm run lint
npm run format

# Database
npx prisma migrate dev --name <name>   # create + apply a new migration
npx prisma generate                    # regenerate client after schema changes
npx prisma studio                      # GUI browser for the database
npm run db:seed                        # seed drivers and routes
npm run db:reset                       # ⚠ drop, remigrate, and reseed (dev only)
```

---

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/booking-sessions` | List all booking sessions |
| `POST` | `/booking-sessions` | Create a booking session |
| `DELETE` | `/booking-sessions/:id` | Delete a booking session |

See [`docs/specification.md`](docs/specification.md) for the full product requirements.
