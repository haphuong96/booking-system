# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

```
booking-system/
├── docker-compose.yml          # PostgreSQL container (postgres:18-alpine, port 5432)
├── booking-system-migration.sql  # Original SQL schema (reference only)
└── booking-system-api/         # NestJS application
    ├── docs/specification.md   # Full product specification
    ├── src/
    │   ├── prisma/             # Global PrismaModule + PrismaService
    │   └── ...                 # Feature modules go here
    ├── prisma/
    │   ├── schema.prisma       # Prisma 7 schema (models)
    │   ├── seed.ts             # Seeds drivers (15) and routes (40: 10 zones × 4 each)
    │   └── migrations/         # Generated migration files
    ├── prisma.config.ts        # Prisma CLI config — reads DATABASE_URL for migrations
    └── generated/prisma/       # Auto-generated Prisma client (do not edit)
```

## Commands

All commands run from `booking-system-api/`.

```bash
# Development
npm run start:dev       # watch mode
npm run start:debug     # watch + debugger

# Build & production
npm run build
npm run start:prod

# Tests
npm run test            # unit tests
npm run test:watch
npm run test:cov
npm run test:e2e

# Lint / format
npm run lint
npm run format

# Database (start container first)
docker compose up -d                          # from repo root
npx prisma migrate dev --name <name>          # create + apply migration
npx prisma migrate deploy                     # apply existing migrations (prod)
npx prisma generate                           # regenerate client after schema changes
npx prisma studio                             # GUI
npx prisma db seed                            # seed drivers, routes + tickets
npm run db:seed                               # same via npm
npm run db:reset                              # ⚠ drop + reapply all migrations + reseed (dev only)
```

## Architecture

**Stack:** NestJS 11, Prisma 7, PostgreSQL 18, TypeScript (`module: nodenext`).

**Database connection (Prisma 7 specifics):**
- Prisma 7 does not support `url` in `schema.prisma`. The connection URL lives in two places:
  - `prisma.config.ts` — used by the Prisma CLI for migrations
  - `PrismaService` constructor — uses `@prisma/adapter-pg` (`PrismaPg`) to pass `DATABASE_URL` at runtime
- After any schema change, run `npx prisma generate` to rebuild `generated/prisma/`.
- Import the client from `../../generated/prisma/client` (not from `@prisma/client`).

**PrismaService pattern:**
`PrismaModule` is `@Global()`, so `PrismaService` is available everywhere without re-importing the module. Access the client via `prismaService.prisma.<model>`.

**Data model relationships (non-obvious):**
- `Ticket` is the parent — exists independently; a null `ticketBooking` means the ticket is still available to book.
- `TicketBooking` is created when a driver books a ticket; its PK `ticketId` is a FK → `tickets.id` (1:1).
- `RouteClaim` is 1:1 with `Ticket` via `route_claims.ticket_id → tickets.id`.
- `BookingTargetDriver` is an explicit junction table between `BookingSession` and `Driver` with a composite PK `[bookingSessionId, driverId]`.

## Domain

Jitsu is a last-mile logistics platform. The booking system lets drivers reserve delivery tickets, then claim a route assignment in a matching zone.

**Zones** — 10 fixed zone identifiers: `Z1` through `Z10`. Both `routes.zone` and `tickets.zone` use these values. A driver can only claim a route assignment whose zone matches their booked ticket's zone.

**Seed data** (`prisma/seed.ts`) — 15 named drivers and 40 routes (4 per zone). `ZONES` is exported from the seed file so other modules can import the canonical zone list.

## Environment

`.env` (in `booking-system-api/`):
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_system?schema=public"
```
Docker container credentials match: user `postgres`, password `postgres`, db `booking_system`.
