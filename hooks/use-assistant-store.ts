import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ActivityEvent,
  AssistantSettings,
  AssistantStore,
  Conversation,
  Message,
  Routine,
} from "@/shared/assistant-types";

const STORAGE_KEY = "my-ai-assistant.store.v1";

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const defaultSettings: AssistantSettings = {
  memoryEnabled: true,
  speechEnabled: true,
  themePreference: "system",
  providerMode: "managed",
  language: "hi-IN",
};

const initialRoutines: Routine[] = [
  {
    id: "daily-reflection",
    name: "Daily reflection",
    description: "A private checklist that helps you close the day with your assistant.",
    enabled: false,
    riskLevel: "low",
    nextStep: "Enable when you want to use the reflection template.",
    updatedAt: now(),
  },
  {
    id: "focus-plan",
    name: "Focus plan",
    description: "A local routine template for planning your next focused work block.",
    enabled: true,
    riskLevel: "low",
    nextStep: "Open Assistant and ask: Help me plan my next focus block.",
    updatedAt: now(),
  },
  {
    id: "github-sync",
    name: "GitHub project update",
    description: "Prepare a review checklist before a future GitHub integration is configured.",
    enabled: false,
    riskLevel: "medium",
    nextStep: "Requires a server-side integration and your approval before it can access a repository.",
    updatedAt: now(),
  },
];

export const createInitialStore = (): AssistantStore => ({
  version: 1,
  conversations: [],
  messages: [],
  tasks: [],
  routines: initialRoutines,
  activity: [
    {
      id: "welcome",
      kind: "system",
      status: "success",
      title: "Private-by-default workspace ready",
      detail: "Conversation history is stored on this device until you choose to clear it.",
      createdAt: now(),
    },
  ],
  settings: defaultSettings,
});

function hydrate(raw: string | null): AssistantStore {
  if (!raw) return createInitialStore();
  try {
    const parsed = JSON.parse(raw) as Partial<AssistantStore>;
    if (parsed.version !== 1) return createInitialStore();
    return {
      ...createInitialStore(),
      ...parsed,
      routines: parsed.routines?.length ? parsed.routines : initialRoutines,
      settings: { ...defaultSettings, ...parsed.settings },
    };
  } catch {
    return createInitialStore();
  }
}

export function useAssistantStore() {
  const storeRef = useRef<AssistantStore>(createInitialStore());
  const [store, setStore] = useState<AssistantStore>(storeRef.current);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        const hydrated = hydrate(value);
        storeRef.current = hydrated;
        setStore(hydrated);
      })
      .finally(() => setIsReady(true));
  }, []);

  const commit = useCallback(async (next: AssistantStore) => {
    storeRef.current = next;
    setStore(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }, []);

  const createConversation = useCallback(
    async (title = "New conversation") => {
      const current = storeRef.current;
      const timestamp = now();
      const conversation: Conversation = {
        id: id("conversation"),
        title,
        createdAt: timestamp,
        updatedAt: timestamp,
        pinned: false,
      };
      await commit({ ...current, conversations: [conversation, ...current.conversations] });
      return conversation;
    },
    [commit],
  );

  const addMessage = useCallback(
    async (message: Omit<Message, "id" | "createdAt">) => {
      const current = storeRef.current;
      const createdAt = now();
      const nextMessage: Message = { ...message, id: id("message"), createdAt };
      const conversation = current.conversations.find((item) => item.id === message.conversationId);
      const nextStore: AssistantStore = {
        ...current,
        messages: [...current.messages, nextMessage],
        conversations: current.conversations.map((item) =>
          item.id === message.conversationId
            ? {
                ...item,
                title:
                  item.title === "New conversation" && message.role === "user"
                    ? message.content.trim().slice(0, 48) || item.title
                    : item.title,
                updatedAt: createdAt,
              }
            : item,
        ),
        activity:
          message.role === "user"
            ? [
                {
                  id: id("activity"),
                  kind: "chat",
                  status: "pending",
                  title: "Assistant request started",
                  detail: conversation?.title ?? "New conversation",
                  createdAt,
                },
                ...current.activity,
              ]
            : current.activity,
      };
      await commit(nextStore);
      return nextMessage;
    },
    [commit],
  );

  const addActivity = useCallback(
    async (event: Omit<ActivityEvent, "id" | "createdAt">) => {
      const current = storeRef.current;
      await commit({
        ...current,
        activity: [{ ...event, id: id("activity"), createdAt: now() }, ...current.activity].slice(0, 60),
      });
    },
    [commit],
  );

  const updateRoutine = useCallback(
    async (routineId: string, enabled: boolean) => {
      const current = storeRef.current;
      const routine = current.routines.find((item) => item.id === routineId);
      if (!routine || routine.riskLevel !== "low") return false;
      const timestamp = now();
      await commit({
        ...current,
        routines: current.routines.map((item) =>
          item.id === routineId ? { ...item, enabled, updatedAt: timestamp } : item,
        ),
        activity: [
          {
            id: id("activity"),
            kind: "routine",
            status: "success",
            title: `${routine.name} ${enabled ? "enabled" : "paused"}`,
            detail: "This local template does not access external accounts or run background actions.",
            createdAt: timestamp,
          },
          ...current.activity,
        ],
      });
      return true;
    },
    [commit],
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      const current = storeRef.current;
      await commit({
        ...current,
        conversations: current.conversations.filter((item) => item.id !== conversationId),
        messages: current.messages.filter((item) => item.conversationId !== conversationId),
      });
    },
    [commit],
  );

  const renameConversation = useCallback(
    async (conversationId: string, title: string) => {
      const cleanTitle = title.trim().slice(0, 80);
      if (!cleanTitle) return false;
      const current = storeRef.current;
      await commit({
        ...current,
        conversations: current.conversations.map((item) =>
          item.id === conversationId ? { ...item, title: cleanTitle, updatedAt: now() } : item,
        ),
      });
      return true;
    },
    [commit],
  );

  const updateSettings = useCallback(
    async (patch: Partial<AssistantSettings>) => {
      const current = storeRef.current;
      await commit({ ...current, settings: { ...current.settings, ...patch } });
    },
    [commit],
  );

  const clearLocalData = useCallback(async () => {
    const current = storeRef.current;
    const reset = createInitialStore();
    await commit({
      ...reset,
      settings: { ...reset.settings, themePreference: current.settings.themePreference },
      activity: [
        {
          id: id("activity"),
          kind: "privacy",
          status: "success",
          title: "Local assistant data cleared",
          detail: "Conversations, messages, tasks, routines, and activity history were removed from this device.",
          createdAt: now(),
        },
      ],
    });
  }, [commit]);

  return {
    store,
    isReady,
    createConversation,
    addMessage,
    addActivity,
    updateRoutine,
    deleteConversation,
    renameConversation,
    updateSettings,
    clearLocalData,
  };
}
