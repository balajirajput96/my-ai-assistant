# Research Notes — My AI Assistant

## Verified Findings

| Source | License or authority | Important idea | MVP use | Legal and technical constraint |
| --- | --- | --- | --- | --- |
| [Model Context Protocol specification](https://modelcontextprotocol.io/specification/2026-07-28) | Official open protocol specification | Tool and resource access should be explicit, permissioned, and understandable to the user. | Model any future integration as a named capability with a clear description, risk state, and approval boundary. | The current mobile client will not execute arbitrary MCP tools. It will surface unconfigured integrations as unavailable and delegate future tool execution to a controlled server. |
| [OpenAI Codex repository](https://github.com/openai/codex) | Apache-2.0 | A public coding agent is organised as a product repository with security and contribution documentation rather than a copied, embedded component. | Adopt the general practice of clear documentation, testable boundaries, and a no-secrets-in-source policy. | Do not copy source code, product identity, or proprietary services; retain notices if any Apache-licensed code is ever intentionally reused. |
| [LangGraph repository](https://github.com/langchain-ai/langgraph) | MIT | Stateful agent systems benefit from explicit execution state, durable recovery, human oversight, and inspectable history. | Treat conversations, local tasks, and future workflow runs as typed state with visible statuses. | The MVP implements lightweight local state, not an unbounded autonomous agent runtime or a copied framework. |
| [n8n repository](https://github.com/n8n-io/n8n) | Sustainable Use License / fair-code | Automation products need explicit workflow steps, human approvals, observability, and a provider-neutral integration model. | Provide routine templates, activity history, and disabled integration states rather than silently execute web actions. | The Sustainable Use License is not treated as a permissive code-reuse license; no n8n source or branded UI is copied. |
| [MCP reference servers](https://github.com/modelcontextprotocol/servers) | Apache-2.0 for new contributions, MIT for existing code | Reference implementations demonstrate controlled access to filesystem, Git, memory, and fetch capabilities, but they are not production-ready solutions. | Maintain a future server-side tool registry with scoped capability definitions and user approvals. | Do not run a third-party server from the mobile client; independently review each tool and its threat model. |
| [Google Play closed-testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) | Google Play Console Help | Personal developer accounts created after 13 November 2023 need a closed test with at least 12 testers continuously opted in for 14 days before applying for production access. | Add a release-plan checklist rather than claim automatic public deployment. | A Play Console account, signing credentials, testing participants, policy declarations, and Google approval remain user-owned, external steps. |
| [Google Play Data safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) | Google Play Console Help | Developers must accurately declare data handling, including data handled by third-party SDKs, and explain relevant security practices. | Include a privacy/data-safety release checklist and avoid optional data collection in the initial local-first release. | Only the developer can complete accurate declarations for the deployed app; every later provider or SDK needs a fresh review. |
| [Community discussion: AI personal assistants](https://www.reddit.com/r/AI_Agents/comments/1nw8k5o/tons_of_ai_personal_assistants_being_built_why/) | Public user discussion, non-authoritative | Participants repeatedly identify reliability, privacy, security, deep integrations, and trust as adoption blockers. | Prefer fewer dependable flows, honest unavailable states, and visible privacy controls over a broad but unreliable feature list. | Treat discussion as directional qualitative feedback, not representative market research or factual evidence. |

## Product Consequences

The first release is a **local-first, controlled assistant**, not an unlimited autonomous browser or universal API collector. External actions must be designed around an explicit permission review, server-side secrets, audit information, a limited allow-list, timeout and retry bounds, and an accurate failure state. This mirrors the MCP security guidance that users must consent to data access and tool invocation and should understand the action before authorizing it.[1]

“Free” is treated as a provider policy, not a promise of unlimited model capacity. The app will prevent automatic paid-provider fallback, display when a capability is unavailable, and avoid storing keys in client conversation data. Future integrations require independently verified terms, permitted authentication, and a server-side configuration path.

Public repositories reinforce the same boundary. Codex is Apache-2.0, LangGraph is MIT, and the MCP reference-server repository contains a mix of Apache-2.0 and existing MIT code, but this project uses only high-level design learnings and does not embed or copy their code.[3] [4] [6] The n8n project uses a Sustainable Use License, so it is used solely as an architectural comparison rather than a source for reuse.[5]

The public community discussion is consistent with the core design choice: build a small, trustworthy assistant with clear scope rather than an “everything on the internet” agent.[8] This is qualitative feedback, so it guides priorities rather than serving as a statistical claim.

## References

[1] [Model Context Protocol, “Specification — Security and Trust & Safety”](https://modelcontextprotocol.io/specification/2026-07-28)

[2] [Google Play Console Help, “App testing requirements for new personal developer accounts”](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)

[3] [OpenAI Codex GitHub repository](https://github.com/openai/codex)

[4] [LangGraph GitHub repository](https://github.com/langchain-ai/langgraph)

[5] [n8n GitHub repository](https://github.com/n8n-io/n8n)

[6] [Model Context Protocol reference servers](https://github.com/modelcontextprotocol/servers)

[7] [Google Play Console Help, “Provide information for Google Play’s Data safety section”](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)

[8] [Reddit, “Tons of AI personal assistants being built, why isn’t there one everyone actually uses?”](https://www.reddit.com/r/AI_Agents/comments/1nw8k5o/tons_of_ai_personal_assistants_being_built_why/)
