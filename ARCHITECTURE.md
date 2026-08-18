# My AI Assistant — MVP Architecture

## Scope Decision

This release is a **local-first, mobile AI assistant MVP**. It provides real server-mediated chat when the managed model capability is available, while conversations, task state, preferences, and activity records stay on the device by default. It does not claim to crawl every site, connect every free API, train on private data, run unattended high-risk actions, or provide a limitless no-cost model service.

| Area | MVP implementation | Deferred boundary |
| --- | --- | --- |
| Conversation | Local `AsyncStorage` state plus a server-side AI completion endpoint | Cross-device sync and account-bound history require an authenticated database phase. |
| AI routing | Runtime model discovery, a preferred economical model family, bounded prompt/history, no silent external fallback | Per-user provider connections and paid provider routing require explicit configuration and billing consent. |
| Memory | User-visible local conversation and preference memory with deletion/export controls | Retrieval-augmented document memory needs authenticated storage, ingestion, citations, and retention controls. |
| Automation | Local low-risk routine templates and activity records; high-risk/external modes remain unavailable | Webhooks, background jobs, third-party OAuth, queues, and remote actions need a dedicated server workflow service. |
| Voice | Device text-to-speech for answers and a clear voice-input readiness state | Microphone recording, transcription uploads, language selection, and usage disclosure are a later opt-in capability. |
| Files and media | Honest attachment-intake capability state, without pretending a file was analysed | Server-side file upload, type validation, malware policy, extraction, and multimodal prompts. |

## Domain Model

The mobile client persists a single `AssistantStore` envelope in device storage. It contains a schema version, `Conversation` records, `Message` records, `Task` records, `Routine` records, `ActivityEvent` records, and user `AssistantSettings`. Each collection is typed and has a stable identifier, ISO timestamp, and explicit status. The design makes deletion deterministic: removing a conversation removes its messages; clearing all data replaces the local store with the initial state.

| Entity | Purpose | Important properties |
| --- | --- | --- |
| Conversation | A user-owned assistant thread | `id`, `title`, `createdAt`, `updatedAt`, `pinned` |
| Message | One user or assistant turn | `id`, `conversationId`, `role`, `content`, `createdAt`, `state` |
| Task | A manual, inspectable plan item | `id`, `title`, `summary`, `status`, `riskLevel`, `createdAt` |
| Routine | A local safe template, not an external action | `id`, `name`, `enabled`, `riskLevel`, `nextStep`, `updatedAt` |
| ActivityEvent | An honest audit record of user-visible outcomes | `id`, `kind`, `status`, `title`, `detail`, `createdAt` |
| AssistantSettings | Privacy and UX controls | `memoryEnabled`, `speechEnabled`, `themePreference`, `providerMode`, `language` |

## AI Provider Boundary

The server owns all managed-model credentials. The client sends a bounded recent message history and never receives provider keys. At runtime, the server asks the managed catalog for available models, selects the configured economical preference only if present, and otherwise chooses a safe available alternative. The route validates text and message counts, rejects unsupported mode choices, removes or avoids secrets from errors, and returns a typed failure state.

The `FREE_ONLY` policy means that the app never silently falls back to a user-billed external provider. The managed server model may consume project quota or credits, so its availability is explicitly communicated in-app and it is not represented as unlimited or cost-free.

## Risk and Permission Model

| Risk level | Examples | Default behaviour |
| --- | --- | --- |
| Low | Draft a plan, manage local conversation, toggle a local routine template, use on-device speech | May run after direct user interaction. |
| Medium | Send a document for AI analysis, call an approved read-only integration, create a cloud task | Not included in the MVP; must show configuration and approval requirements. |
| High | Send email, alter GitHub data, delete files, deploy, purchase, publish, or alter credentials | Disabled by default; a future server-side integration needs a scoped authorization, review UI, audit log, and direct confirmation. |

## Security Controls

The client does not store model API keys. The server validates message length and count, uses a constrained system instruction, does not expose raw upstream errors, and returns an explicit error state. External tool invocation is absent from the initial route, preventing prompt text from producing a side effect. Local privacy controls allow the user to turn memory off, delete one thread, or clear all local app data. The app avoids optional contact, location, camera, background, and account permissions in the first release.

## Product Constraints

Android publication is prepared but cannot be completed autonomously. The store account owner must provide the final application identity, signing and Play Console configuration, accurate privacy/data-safety declarations, testing participants, and submission approval. The release plan therefore documents those steps rather than implying that a public Play Store launch has happened.

