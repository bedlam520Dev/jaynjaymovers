# Project: Jay N Jay Movers

## Stack
- **Framework**: Next.js 16 + React 19 (App Router)
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` config)
- **UI Components**: Base UI React (migrated from Radix/shadcn)
- **State**: Zustand (client), React Query (server)
- **Forms**: react-hook-form + Zod resolvers
- **Auth**: Supabase Auth (SSR) + OAuth provider wrappers
- **DB**: Supabase Postgres (RLS, triggers, SECURITY INVOKER functions)
- **Payments**: Stripe, PayPal, Google Pay, Apple Pay wrappers
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: oxlint, formatting: oxfmt
- **Build/PM**: pnpm, dotenvx for env encryption

## Project Conventions
- `src/lib/supabase/client.ts` — browser supabase client with fallback mock when `NEXT_PUBLIC_ENABLE_SUPABASE=false`
- `src/lib/supabase/server.ts` — server supabase client with `next/headers` cookie handling
- All API routes use Zod schemas from `src/lib/schemas/api.ts` for input validation
- Payment methods use resolver pattern in `src/lib/payments/` — each method has its own directory

## DB Schema (applied via 5 migrations)
- `public.profiles` — FK to `auth.users`, auto-created via `handle_new_user` trigger
- `public.bookings` — CHECK constraints on service_type, home_size, status, time_window
- `public.time_slots` — tracked with `increment_slot_booking()` function (SECURITY INVOKER)
- `public.payments` — FK to bookings, CHECK on method (stripe/paypal/cashapp/googlepay/applepay/zelle/crypto)
- `public.quote_requests` — CHECK on service_type, home_size, status
- `public.reviews` — CHECK on rating (1-5)
- RLS enabled on all tables with proper policies
- Functions: `handle_new_user()`, `sync_user_metadata()`, `increment_slot_booking()`
- All functions use `SECURITY INVOKER` with `SET search_path = ''`

## Completed Work
- Fully responsive layout (fluid clamp(), `page-content` in layout.tsx, grid reductions on mobile)
- 15+ pages (home, about, services, quote, schedule, reviews, auth, dashboards, legal)
- Payment provider abstraction layer (Stripe, PayPal, Google Pay, Apple Pay)
- Auth provider wrappers (Google OAuth, Apple OAuth) with env-var checks
- Mock data removed, real hooks/routes in place
- 122 passing unit tests (pricing, utils, payments, schemas, supabase client mock)
- 6 Playwright E2E spec files (home, nav, auth-flow, quote-flow, schedule, services/404)
- Supabase schema applied and hardened (5 migrations, security advisories fixed)
- DynamicBackground commented out until frontend refinement complete (dual core CPU perf)

## Running Tests
```bash
pnpm test            # Vitest unit tests
pnpm test:e2e        # Playwright E2E (requires dev server)
pnpm test:watch      # Vitest watch mode
```

## Lint/Typecheck/Format
```bash
pnpm tschk           # TypeScript check
pnpm lint            # oxlint
pnpm format          # oxfmt
pnpm validate        # all three in sequence
```

## Entry Points
- `npm run dev` — uses dotenvx from `.env.development`
- `npm run build` — uses dotenvx from `.env.production`
- Env files are encrypted with dotenvx; keys available in `_dev/keys/` (gitignored)

## Development Notes
- Tailwind CSS v4 uses `@import "tailwindcss"` in global CSS (not `@tailwind` directives)
- Components use CVA (`class-variance-authority`) for variant management
- Base UI React components in `src/components/ui/` (migrated from Radix)
- Tailwind v4 theme variables defined via `@theme` in `src/app/globals.css`
- Container queries available via `@tailwindcss/container-queries`
