# My AI Assistant

My AI Assistant is a **local-first mobile AI assistant MVP** for Android and iOS. It combines managed AI chat with local conversation storage, workspace tools, safe routine templates, activity records, device text-to-speech, and privacy controls.

## What Is Implemented

| Capability | Status |
| --- | --- |
| Managed server-side AI chat | Implemented with runtime model discovery and bounded message validation. |
| Local workspace | Implemented with persistent chat history, search, rename, export, and delete controls. |
| Automation | Local low-risk routine templates only; external and high-risk actions are deliberately unavailable. |
| Voice | Device text-to-speech for assistant replies; microphone transcription is off pending an opt-in implementation. |
| Privacy | Local data clear action, memory control, no client-side model credentials, and no silent paid-provider fallback. |
| GitHub, MCP, scheduled jobs, file analysis | Documented future capabilities; not enabled in this MVP. |

## Development

```bash
pnpm dev
pnpm check
pnpm lint
pnpm test
```

The private GitHub repository includes a CI workflow that runs type-checking, linting, and tests on main-branch pushes and pull requests.

The server discovers the available managed model catalog at runtime and selects an economical managed model when available. Model credentials stay server-side. The client intentionally does not accept or persist provider API keys.

## Architecture and Research

Read [ARCHITECTURE.md](./ARCHITECTURE.md) for data ownership, security boundaries, and feature scope. Public-source research and licence considerations are recorded in [RESEARCH_NOTES.md](./RESEARCH_NOTES.md) and [COMPETITOR_MATRIX.md](./COMPETITOR_MATRIX.md). Play Store preparations are in [PLAY_STORE_RELEASE.md](./PLAY_STORE_RELEASE.md).

## Important Boundaries

This repository does not copy code from public AI assistant repositories. It does not promise unlimited free model inference, unrestricted website access, autonomous external actions, or automatic public Play Store publication. External integrations require separate, least-privilege, server-side implementation and direct user approval.
