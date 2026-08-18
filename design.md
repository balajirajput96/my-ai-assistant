# My AI Assistant — Mobile Interface Design

## Product Positioning

My AI Assistant is a **free-first personal work companion** for Android and iOS. The initial release focuses on secure AI chat, local conversation memory, guided task planning, voice-ready interaction, and user-controlled low-risk routines. It does not promise unrestricted access to every website, API, model, or autonomous action. Integrations, online research, and actions that can change external data remain permissioned and visibly scoped.

The interface is designed for **portrait 9:16 screens** and one-handed use. Its primary interaction is a bottom-positioned composer, with primary actions reaching the lower third of the screen. It follows mainstream iOS conventions: familiar tab navigation, readable large headings, high-contrast semantic states, destructive confirmations, and clear empty/offline states.

## Screen List and Functionality

| Screen | Primary content | Main functionality |
| --- | --- | --- |
| Onboarding | Privacy promise, free-first operating mode, capability boundaries | Explains local storage and user approval before actions; starts the app without requiring an account. |
| Assistant | Conversation timeline, suggested prompts, composer, voice entry, attachment affordance, status chips | Send messages, see responses, copy an answer, start a new conversation, and view unavailable provider states. |
| Workspace | Saved conversations, pinned tasks, memory summary, search field | Reopen, rename, delete, and export locally stored conversations; manage local preference memory. |
| Automations | Safe routine cards, execution history, risk explanation, disabled integrations | Create and toggle only local low-risk reminders or templates; clearly labels external automations as requiring a configured integration and approval. |
| Activity | Task states, provider status, rate/usage state, failures | Shows honest progress, completed outcomes, recoverable failures, and no fabricated usage figures. |
| Settings | Appearance, privacy, language, assistant behavior, voice, storage controls, feedback | Change theme, delete local data, disable memory, turn on device text-to-speech, submit feedback, and view configuration limitations. |
| Conversation detail | Single thread with sources/metadata when available | Uses an accessible readable transcript and allows per-conversation deletion. |

## Key User Flows

| Goal | Flow |
| --- | --- |
| Ask for help | Open **Assistant** → type or dictate a request → tap Send → see a progress state → receive an answer or a specific configuration/offline error. |
| Resume work | Open **Workspace** → select a saved conversation → continue from the bottom composer → history persists locally. |
| Create a safe routine | Open **Automations** → select a low-risk template → review the data and action boundary → enable it → later review it in **Activity**. |
| Protect privacy | Open **Settings** → choose Memory and data → delete a conversation, clear all local data, or disable memory → receive a confirmation and visible completion state. |
| Use spoken output | In a response, tap Speak → the device reads the response using on-device/system speech where available → stop playback with the same control. |

## Layout and Interaction Rules

The Assistant screen reserves the lower portion of the viewport for the composer. The composer includes an expanding text field, a contextual microphone button, and a high-emphasis send button. Suggested prompts are rendered above the composer only when a chat is empty and disappear after the first message. Conversation bubbles use distinct but subtle surfaces, never color alone, to differentiate user and assistant text.

The tab bar has four destinations: **Assistant**, **Workspace**, **Automations**, and **Settings**. Activity is reached from a navigation affordance in the Assistant header so the tab bar remains compact and accessible. Every action has pressed feedback, loading state, success or error state, and an accessible label. No control is merely decorative.

## Brand and Color Choices

The brand uses a calm technical blue with a warm signal color. Blue communicates focus and trust without mimicking an existing assistant product; the warm amber is reserved for attention and automation review.

| Token | Light | Dark | Intended use |
| --- | --- | --- | --- |
| Primary | `#246BFD` | `#78A6FF` | Primary buttons, links, active tabs, assistant highlights |
| Background | `#F7F9FC` | `#0B1020` | Full-screen canvas |
| Surface | `#FFFFFF` | `#151C2E` | Cards, composer, input surfaces |
| Foreground | `#12213B` | `#F2F6FF` | Main text |
| Muted | `#64748B` | `#A6B3C7` | Secondary labels and metadata |
| Border | `#DCE3EE` | `#29344C` | Quiet dividers and input outlines |
| Success | `#168563` | `#45C79B` | Completed safe tasks |
| Warning | `#C97700` | `#FFB84C` | Approval/review needed |
| Error | `#C13B4A` | `#FF7C89` | Errors and destructive actions |

## Accessibility and Safety

Text meets legible body sizing, controls meet touch-target expectations, and all status colors have supporting copy and iconography. The app never stores provider API keys in client-side conversation content. It defaults to no external action, requires explicit approval for sensitive operations, and provides clear messaging whenever a feature requires a configured server-side capability or integration.

