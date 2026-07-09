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

## The fix (updated)
`scripts/web-serve.js` expects a `dist/index.html` that `scripts/build.js` never produces (build.js writes to `static-build/<platform>/manifest.json`, no web index.html). The correct server for build.js output is `server/serve.js` (serves manifests + landing page from `static-build/`). Both the `.replit` workflow command and `artifacts/trustpoint-bank/package.json`'s `dev`/`serve` scripts must point at `node server/serve.js`, not `scripts/web-serve.js`, or the page 502s after a fresh build.

**Why:** The artifact URL (`.expo.` subdomain) and the regular workflow webview both need valid HTML with Content-Length headers; `web-serve.js` was leftover from an older build approach and is incompatible with the current `build.js`.
