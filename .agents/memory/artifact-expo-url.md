---
name: Artifact expo URL fix
description: Why the .expo. subdomain URL was 502ing and how it was fixed.
---

## The problem
The TrustPoint Bank mobile artifact has two preview URLs:
1. The `TrustPoint Bank (Mobile)` workflow webview → regular riker.replit.dev domain → port 5000
2. The `artifacts/trustpoint-bank: expo` managed workflow → `.expo.riker.replit.dev` subdomain → whatever port the artifact system assigns

The artifact-managed workflow runs whatever `pnpm --filter @workspace/trustpoint-bank run dev` executes.
Originally that was `expo start --web ...` which fails Replit's HTTP-200 port check (see metro-web-static-serve.md).

## The fix
Changed the `dev` script in `artifacts/trustpoint-bank/package.json` to:
```json
"dev": "node scripts/web-serve.js"
```

The artifact system injects `$PORT` automatically; web-serve.js respects it. Now the `.expo.` URL also serves the static export.

**Why:** The artifact URL is what users see when clicking the mobile artifact preview; it must serve valid HTML with Content-Length headers.
