---
name: GitHub publishing readiness
description: Guardrail for using the GitHub API to publish this project from Replit.
---

Only perform GitHub API operations once the integration API row reports `ready`. In this workspace, the GitHub connection card completed and `addIntegration` returned `attached: true`, but the API row remained `connect` and no callable connection was available.

**Why:** A successful authorization/attachment response did not establish that the GitHub API could be called, so proceeding could expose files or leave a partially created public repository.

**How to apply:** Check `searchIntegrations` again after a connection change. If the API row remains `connect`, do not repeat `addIntegration`, extract credentials, or attempt a write. Ask the user to reconnect and continue only after the row becomes ready.
