# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server with Turbopack
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # next lint
```

There is no configured test runner.

## Required environment variables

`lib/env.ts` hard-fails on startup without these:

- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

Optional but load-bearing for features: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (OAuth), `ADMIN_EMAIL` (auto-assigns `role: "admin"` on signup, see `lib/auth.ts:54`), `ALLOWED_ORIGINS` (CORS), `MINIO_*` (PDF storage — `lib/minio.ts` throws if missing), `SMTP_*` (email).

## Architecture

Next.js 16 App Router + React 19, TypeScript strict, Tailwind + shadcn/Radix. Backend is MongoDB via Mongoose, auth via Better Auth. The migration from Strapi/GraphQL/Prisma/PostgreSQL to this stack is already complete — do not reintroduce Apollo, Prisma, or JWT helpers. See `AGENTS.md` for the full data-model reference (Service, Kit, Panel, PriceConfiguration, Quotation).

### Route groups

`app/` uses three parallel groups that share the root `layout.tsx`:

- `app/(public)/` — marketing site and public-facing pages (services, panels, quotation request, etc.).
- `app/(auth)/` — login / register / password flows.
- `app/(dashboard)/dashboard/admin/` — admin console. Sidebar-driven CRUD for services, kits, panels, pricing, quotations, users.

`app/api/` is split into public routes (`services`, `panels`, `pricing`, `quotation`, `contact`, `request-call`) and admin routes under `app/api/admin/*`. Better Auth mounts on the catch-all `app/api/auth/[...all]`.

### Two parallel MongoDB clients

`lib/mongodb.ts` exports **both**:

1. A raw `MongoClient` (`clientPromise` / `dbPromise`) — consumed by Better Auth's `mongodbAdapter` in `lib/auth.ts`.
2. A Mongoose connection via `connectDB()` — used by every model in `lib/models/`.

Both reuse connections across dev HMR via `globalThis` caches. API routes that touch models must `await connectDB()` first; Better Auth does not need it.

### Auth & authorization

- `lib/auth.ts` configures Better Auth (email+password, Google OAuth, user/session/account/verification collection names, `databaseHooks.user.create.before` promotes `ADMIN_EMAIL` signups to `role: "admin"`).
- `lib/auth-client.ts` is the browser-side Better Auth client; use it in React components/hooks rather than hitting `/api/auth` directly.
- **Two independent admin gates** — keep both in sync when adding protected surfaces:
  - `proxy.ts` (Next middleware, matcher `/dashboard/:path*` and `/api/admin/:path*`) redirects non-admins and returns 401 for admin API calls.
  - `lib/api/admin-guard.ts` `requireAdmin(request)` is called at the top of each admin route handler as a defense-in-depth check and also sets CORS.
- Session shape: `session.user.role` is either `"admin"` or `"patient"` (default). Cast through `as any` when reading `role` — the Better Auth types don't know about the additional field.

### API conventions

- All JSON responses follow `{ success: true, data }` / `{ success: false, error, code? }`.
- Wrap responses with `withCors(request, response)` from `lib/api/cors.ts`; implement `OPTIONS` via `handleOptions(request)`.
- `lib/api/` also provides `object-id.ts`, `query.ts`, `rate-limit.ts`, `safe-regex.ts` — prefer these over ad-hoc helpers.
- Zod schemas live in `lib/validation/schemas.ts`.

### Pricing & quotation flow

Pricing is a single `PriceConfiguration` document (singleton-style, filter by `isActive: true`). The calculation pipeline:

1. Admin edits config at `/dashboard/admin/pricing` → `PUT /api/admin/pricing`.
2. Client reads via `usePriceList()` in `lib/price.ts`, which **reshapes** the server payload (snake/camel mismatch: `sequencingPerGb` ↔ `sequencing_per_gb`, `bulkDiscount.categories` ↔ `bulkdiscount.category`). If you change the config schema, update both shapes.
3. `calculateQuotationPrice()` in `lib/services/quotation-service.ts` is the single source of truth for price math — used both client-side (preview) and server-side (`POST /api/quotation`, which also generates the PDF via `@react-pdf/renderer` / `jspdf`, uploads to MinIO, and persists a `Quotation` record).

### Path alias

`@/*` maps to the repo root (`tsconfig.json`). Import as `@/lib/...`, `@/components/...`, etc.

## Repo-specific gotchas

- `lib/minio.ts` hard-codes endpoint `s3.genomicvalley.in:443` and ignores `MINIO_ENDPOINT`/`MINIO_PORT`/`MINIO_USE_SSL`. Only `MINIO_ACCESS_KEY`/`MINIO_SECRET_KEY` are actually read. Fix at the source if you need a different host rather than adding env plumbing around it.
- `lib/auth.ts` uses top-level `await dbPromise` — it runs at module load. Anything that imports `@/lib/auth` pays a DB round-trip on first import.
- The middleware file is named `proxy.ts`, not the Next default `middleware.ts`. Confirm it is wired up (via a re-export or rename) before assuming middleware runs in a given environment.
- Root-level markdown files (`IMPLEMENTATION_STATUS.md`, `OVERHAUL_COMPLETE.md`, `HIGH_PRIORITY_COMPLETE.md`, `CLEANUP_SUMMARY.md`, `AGENTS.md`) are historical overhaul notes. `AGENTS.md` is still useful as a data-model/form-spec reference; the others describe completed work and can drift from the code.
