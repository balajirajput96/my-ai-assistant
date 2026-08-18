# Competitor and Pattern Matrix

This matrix compares public implementation patterns and community feedback, not copied source code or proprietary product assets. The recommendation for this release is a narrow, local-first mobile assistant that earns trust through visible boundaries.

| Product or pattern | Strength | Weakness or constraint | Evidence | Response in My AI Assistant | Priority |
| --- | --- | --- | --- | --- | --- |
| OpenAI Codex public repository | Publicly documented coding-agent project with explicit licence, security, and contribution files. | It is a coding-agent codebase, not an embeddable mobile assistant backend. | [Codex repository](https://github.com/openai/codex) | Keep project documentation, tests, and source-control hygiene; do not reuse source or product identity. | Medium |
| LangGraph | Its framing emphasizes durable state, memory, human oversight, and inspectable agent runs. | Adds operational complexity beyond a local mobile MVP. | [LangGraph repository](https://github.com/langchain-ai/langgraph) | Use typed local state and activity history now; defer durable multi-agent orchestration to a server-side future phase. | High |
| n8n | Demonstrates workflow composition, integrations, approvals, and observability. | The Sustainable Use License requires a separate legal review for any reuse, and a workflow engine is too heavy for a first mobile release. | [n8n repository](https://github.com/n8n-io/n8n) | Offer safe routine templates and clear integration placeholders, not a copied visual workflow engine. | High |
| MCP reference servers | Illustrate scoped tools such as memory, files, fetch, and Git. | Authors explicitly position them as references, not production-ready services. | [MCP servers repository](https://github.com/modelcontextprotocol/servers) | Use a server-side capability registry and approval design; never execute arbitrary device or web tools from a chat prompt. | High |
| Community feedback on personal assistants | Trust, reliability, privacy, and useful deep integrations are repeatedly valued. | The source is qualitative and may not represent all users. | [r/AI_Agents discussion](https://www.reddit.com/r/AI_Agents/comments/1nw8k5o/tons_of_ai_personal_assistants_being_built_why/) | Make local privacy controls, honest availability states, and a small dependable feature set central to the initial UX. | Critical |

