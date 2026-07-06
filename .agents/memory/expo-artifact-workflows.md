---
name: Expo artifact workflows
description: Registered Expo/mobile artifacts already own a dev workflow — don't manually create a duplicate one.
---

When an artifact of kind `mobile` (Expo) already exists in the project, it comes with its own workflow named like `artifacts/<name>: expo`. If you manually register a new workflow to run the same `pnpm --filter ... dev` command, you end up with a duplicate/conflicting workflow.

**Why:** Manually configuring a workflow for an already-registered artifact caused a duplicate `trustpoint-bank` workflow alongside the artifact's own `artifacts/trustpoint-bank: expo` workflow, requiring cleanup (`removeWorkflow`) before the correct one could run cleanly.

**How to apply:** Before creating a new workflow for an app, check `listArtifacts()` / the registered artifacts list first. If the artifact already exists, just restart its existing workflow (e.g. `artifacts/<name>: expo`) rather than hand-rolling a new one.
