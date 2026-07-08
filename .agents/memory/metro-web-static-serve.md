---
name: Metro web port-check workaround
description: expo start --web never passes Replit's port-5000 HTTP-200 check; use export + static serve instead.
---

## Rule
Never use `expo start --web --port 5000` as the TrustPoint Bank workflow command — it prints "Web is waiting on http://localhost:5000" but the Replit port checker (which requires HTTP 200 from outside the container) never detects it as open, even at 180-second timeout.

**Why:** Metro's lazy web bundle compilation means port 5000 doesn't serve a proper HTTP 200 during the startup window. The Replit proxy checks the external URL, not localhost, and Metro's first bundle compile can take 90+ seconds. `expo export --platform web` confirms the code is fine; it's purely a timing/serve issue.

**How to apply:**
1. Run: `cd artifacts/trustpoint-bank && pnpm exec expo export --platform web --output-dir dist` (takes ~90s, only needed after code changes)
2. Workflow command: `cd artifacts/trustpoint-bank && PORT=5000 node scripts/web-serve.js` — binds port 5000 in <1s
3. The serve script is at `artifacts/trustpoint-bank/scripts/web-serve.js` (zero-dep Node http server serving `dist/`)
4. After any code change to the auth screens or other files, re-run the export before restarting the workflow

## Missing packages that caused bundling to fail
- `expo-image-picker` and `expo-haptics` were missing from `package.json`; added with `pnpm exec expo install expo-image-picker expo-haptics`
- Always run `expo install` (not plain `pnpm add`) for Expo packages to get SDK-compatible versions
