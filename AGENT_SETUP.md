# TrustPoint Bank — Agent Setup Guide

> **Read this first whenever this repo is imported into a new Replit.**
> Follow every step in order. Do not skip steps or assume things are already done.

---

## 0. What this project is

A Nigerian fintech mobile banking app (Expo / React Native, web-exported) with an Express + PostgreSQL API backend. It runs as a static web export served by a Node HTTP server, not the Expo dev server.

Monorepo layout (pnpm workspaces):
```
artifacts/trustpoint-bank/   ← Expo mobile app (web-exported)
artifacts/api-server/        ← Express 5 REST API
lib/db/                      ← Drizzle ORM schema + client
lib/api-spec/                ← OpenAPI spec
lib/api-zod/                 ← Generated Zod schemas + API client hooks
scripts/                     ← post-merge.sh, web-serve.js, etc.
```

---

## 1. Install dependencies

```bash
pnpm install
```

> If pnpm is not available: `npm install -g pnpm@9` first.

---

## 2. Build TypeScript declaration files

The API server uses project references. Before anything else, emit the `.d.ts` files for shared libraries:

```bash
pnpm exec tsc --build lib/db lib/api-zod
```

Without this step `pnpm run typecheck` inside `api-server` will report missing `.d.ts` files.

---

## 3. Add the DATABASE_URL secret

Go to **Secrets** in the Replit sidebar (or use the environment-secrets skill) and add:

| Key            | Value                                      |
|----------------|--------------------------------------------|
| `DATABASE_URL` | A PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/dbname` |

**Replit PostgreSQL**: Click **+ Create a database** in the Database tab. Replit injects `DATABASE_URL` automatically — no manual entry needed in that case.

The mobile app works without a database (uses mock data). The API server will crash on startup without `DATABASE_URL`.

---

## 4. Push the database schema

This runs Drizzle's schema-push (creates all tables, no migration files needed):

```bash
pnpm --filter @workspace/db run push
```

Expected output: lists the tables created (`users`, `transactions`, `beneficiaries`, `cards`). Re-running is safe — it is idempotent.

---

## 5. Build the Expo web export

The app is served as a pre-built static site, not a live dev server:

```bash
cd artifacts/trustpoint-bank && pnpm exec expo export --platform web --output-dir dist
```

This produces `artifacts/trustpoint-bank/dist/`. **Repeat this step after every code change to the mobile app.** The API server does NOT need a rebuild — it hot-reloads via `pnpm run dev`.

---

## 6. Configure workflows in .replit

The `.replit` file should already contain these workflows. If they are missing or broken, recreate them exactly:

### TrustPoint Bank (Mobile) — port 5000, outputType webview
```
cd artifacts/trustpoint-bank && PORT=5000 node scripts/web-serve.js
```
`waitForPort = 5000`

### API Server — port 8080
```
PORT=8080 DATABASE_URL=$DATABASE_URL pnpm --filter @workspace/api-server run dev
```

### artifacts/trustpoint-bank: expo (the artifact-managed preview URL)
The `dev` script in `artifacts/trustpoint-bank/package.json` must point to the static server, NOT the Expo dev server (the Expo dev server fails Replit's port-200 check):
```json
"dev": "node scripts/web-serve.js"
```

---

## 7. Start everything

```bash
# In Replit: click Run, or start workflows individually:
# 1. API Server
# 2. TrustPoint Bank (Mobile)
```

Verify:
- `curl -si http://localhost:5000/ | head -5` → `HTTP/1.1 200 OK`
- `curl -si http://localhost:8080/health | head -5` → `HTTP/1.1 200 OK`

---

## 8. Port conflict resolution

If any workflow fails with `EADDRINUSE`:

```bash
fuser -k 5000/tcp 8080/tcp 2>/dev/null
# then restart the workflow
```

---

## 9. Verify the database

```bash
pnpm --filter @workspace/db run push   # safe to re-run
```

Or connect directly:
```bash
psql "$DATABASE_URL" -c "\dt"
```

Expected tables: `users`, `transactions`, `beneficiaries`, `cards`.

---

## 10. Common failure modes and fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| API server: `Cannot find module '../../lib/db/dist/...'` | TypeScript declarations not built | Run step 2 |
| API server: `EADDRINUSE :8080` | Previous process still running | `fuser -k 8080/tcp` |
| Mobile app: HTTP 502 on the public URL | Server responding without `Content-Length` | `web-serve.js` must set explicit `Content-Length`; do not use chunked encoding |
| Mobile app shows blank / old content | Expo export not rebuilt after code change | Re-run step 5 |
| `pnpm --filter @workspace/db run push` fails | `DATABASE_URL` not set | Add secret (step 3) |
| `expo export` fails with module not found | Dependencies missing | Re-run `pnpm install` |
| Workflows fail after a git merge | Post-merge script did not run | Run `bash scripts/post-merge.sh` manually |

---

## 11. After every code change (quick reference)

| Changed | Command |
|---------|---------|
| Mobile app (`artifacts/trustpoint-bank/`) | `cd artifacts/trustpoint-bank && pnpm exec expo export --platform web --output-dir dist` then restart `TrustPoint Bank (Mobile)` workflow |
| API server (`artifacts/api-server/`) | Workflow auto-reloads; restart if it doesn't |
| DB schema (`lib/db/src/schema/`) | `pnpm --filter @workspace/db run push` |
| API spec (`lib/api-spec/`) | `pnpm --filter @workspace/api-spec run codegen` then rebuild consumers |

---

## Architecture notes (for agents)

- **No Expo dev server in production/preview.** Always use `expo export --platform web` + `node scripts/web-serve.js`. The dev script in `package.json` already points there.
- **Mock data**: `context/AppContext.tsx` seeds transactions, beneficiaries, and cards locally — the app is fully usable without the API for UI work.
- **Active account**: balance and account number always come from `linkedAccounts[activeAccountId]`, never directly from `user`. All screens must respect this.
- **Icon system**: `TpIcon` (SVG strokes) for UI icons; `PackIcon` (`.webp` illustrations) for feature icons. Bank logos use `BankLogo` component with `SvgXml` for real SVGs and initials-fallback for others.
- **Bank logos**: sourced from `attached_assets/bank_logos_*.zip`. Extracted SVGs live in `assets/banks/` and are inlined as string constants in `constants/bank-svgs.ts`. Re-run the expo export after changing them.
- **Session secret**: `SESSION_SECRET` env var is required for any session-based auth middleware added to the API server.
