# Runtime Configuration Reference

The platform injects managed server credentials and they must never be copied into the repository, a `.env` file, or the mobile client. The app’s feature policy is expressed in `config.yaml`; production environment values must be configured through the project’s secure settings interface.

| Setting | Recommended MVP value | Reason |
| --- | --- | --- |
| `APP_ENV` | `development` locally; `production` only for a release build | Separates local development from a published build. |
| `FREE_ONLY` | `true` | Prevents silent external paid-provider fallback. |
| `ALLOW_EXTERNAL_PAID_PROVIDERS` | `false` | Requires a future explicit product decision and user consent. |
| `AUTO_LOW_RISK` | `true` | Allows only direct, local interactions such as storing a chat or changing a local routine toggle. |
| `AUTO_HIGH_RISK` | `false` | Blocks publishing, deletion, purchases, credential changes, external communication, and deployments. |
| `VOICE_OUTPUT_ENABLED` | `true` | Enables device text-to-speech when supported. |
| `VOICE_INPUT_ENABLED` | `false` | Defers recording/transcription until an opt-in workflow and data disclosure are implemented. |
| `GITHUB_ENABLED` | `false` | Defers GitHub OAuth, least-privilege scopes, and external side effects. |
| `MCP_ENABLED` | `false` | Defers server-side tool registry, review, and approval controls. |
| `SCHEDULER_ENABLED` | `false` | Defers durable server jobs and recurrence management. |

> **Security note:** The managed model endpoint and its credential are server-only platform values. They are never requested from an end user and must not be exposed through an Expo public variable.
