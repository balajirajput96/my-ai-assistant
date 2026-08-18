export type MessageRole = "user" | "assistant" | "system";
export type MessageState = "complete" | "sending" | "failed";
export type TaskStatus = "planned" | "in_progress" | "completed" | "blocked";
export type RiskLevel = "low" | "medium" | "high";
export type ActivityStatus = "success" | "pending" | "blocked" | "failed";
export type ThemePreference = "system" | "light" | "dark";
export type ProviderMode = "managed" | "offline";

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  state: MessageState;
}

export interface Task {
  id: string;
  title: string;
  summary: string;
  status: TaskStatus;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  riskLevel: RiskLevel;
  nextStep: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  kind: "chat" | "routine" | "privacy" | "system";
  status: ActivityStatus;
  title: string;
  detail: string;
  createdAt: string;
}

export interface AssistantSettings {
  memoryEnabled: boolean;
  speechEnabled: boolean;
  themePreference: ThemePreference;
  providerMode: ProviderMode;
  language: "en-IN" | "hi-IN";
}

export interface AssistantStore {
  version: 1;
  conversations: Conversation[];
  messages: Message[];
  tasks: Task[];
  routines: Routine[];
  activity: ActivityEvent[];
  settings: AssistantSettings;
}

export interface ChatRequest {
  messages: Array<Pick<Message, "role" | "content">>;
  language: AssistantSettings["language"];
}

export interface ChatResponse {
  content: string;
  provider: "managed";
  model: string;
}

