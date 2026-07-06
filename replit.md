# TrustPoint Bank

A Nigerian fintech mobile banking app (Expo / React Native) with an Express + PostgreSQL API backend.

## Run & Operate

- `TrustPoint Bank (Mobile)` workflow — Expo dev server on port 23415 (scan QR with Expo Go or use web preview)
- `pnpm --filter @workspace/api-server run dev` — API server on port 8080 (requires `DATABASE_URL`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes to Postgres (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (needed for API server; mobile app runs with mock data without it)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Mobile: Expo SDK 54, React Native, Expo Router (file-based navigation)
- API: Express 5, pino logger
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/trustpoint-bank/` — Expo mobile app
  - `app/` — Expo Router screens (`(auth)/`, `(main)/`, `transfer/`, `settings/`, etc.)
  - `components/` — shared UI (`TpIcon.tsx` custom SVG icons, `Avatar.tsx`, `BankIcons.tsx`)
  - `constants/colors.ts` — full dark + light theme palette
  - `context/AppContext.tsx` — global state (user, transactions, beneficiaries, cards)
  - `hooks/useColors.ts` — theme-aware color hook
- `artifacts/api-server/` — Express API
  - `src/routes/bank.ts` — `/bank/register`, `/bank/login`, `/bank/user/:phone`
- `lib/` — shared workspace packages (DB schema, API spec, generated client)

## Architecture decisions

- Custom SVG icon system (`TpIcon`) instead of an icon library — full control, no native linking issues with Expo Go
- Mock data in `AppContext` for transactions/beneficiaries/cards — app is usable without the API server running
- Transfer flow entry point is `app/transfer/index.tsx` (the "Start your transfer" screen); old `method.tsx` is preserved but bypassed
- Both `beneficiaryId` (saved recipient) and `accountNumber` (manual entry) params flow through the entire transfer chain: `index → amount → review → pin → success`

## Product

TrustPoint Bank lets users send money to saved beneficiaries or any Nigerian bank account, view transaction history, manage virtual/physical cards, pay bills, and buy airtime — all within a dark-themed mobile-first UI.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `$PORT` is not auto-injected for manually configured workflows — the run command must hardcode or export `PORT`
- The Expo app's dev script uses `REPLIT_EXPO_DEV_DOMAIN` and `REPLIT_DEV_DOMAIN` env vars that are injected automatically at runtime on Replit
- `pnpm-workspace.yaml` enforces a 1440-minute minimum package release age — do not disable this

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See the `expo` skill for Expo / React Native patterns
