import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Speech from "expo-speech";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useAssistantStore } from "@/hooks/use-assistant-store";
import { trpc } from "@/lib/trpc";
import type { Message } from "@/shared/assistant-types";

const quickPrompts = [
  "मेरे आज के काम को प्राथमिकता देने में मदद करो",
  "Help me turn an idea into a small plan",
  "Explain a technical concept simply",
];

function MessageBubble({ message, onSpeak, speechEnabled }: { message: Message; onSpeak: (message: Message) => void; speechEnabled: boolean }) {
  const isUser = message.role === "user";
  return (
    <View className={`mb-3 max-w-[88%] rounded-3xl px-4 py-3 ${isUser ? "self-end bg-primary" : "self-start bg-surface border border-border"}`}>
      <Text className={`text-[15px] leading-6 ${isUser ? "text-white" : "text-foreground"}`}>{message.content}</Text>
      {message.state === "failed" ? <Text className="mt-2 text-xs text-error">Not sent. Try again.</Text> : null}
      {!isUser ? (
        <Pressable
          accessibilityLabel="Speak assistant response"
          disabled={!speechEnabled}
          onPress={() => onSpeak(message)}
          style={({ pressed }) => ({ opacity: speechEnabled ? (pressed ? 0.58 : 1) : 0.4 })}
          className="mt-3 flex-row items-center self-start rounded-full bg-[#E8F0FF] px-3 py-2"
        >
          <MaterialIcons name="volume-up" size={17} color="#246BFD" />
          <Text className="ml-1.5 text-xs font-semibold text-primary">Speak</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function AssistantScreen() {
  const { store, isReady, createConversation, addActivity, addMessage } = useAssistantStore();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<Message>>(null);
  const chat = trpc.assistant.chat.useMutation();

  const activeConversation = useMemo(
    () => store.conversations.find((item) => item.id === activeConversationId) ?? store.conversations[0],
    [activeConversationId, store.conversations],
  );
  const messages = useMemo(
    () => (activeConversation ? store.messages.filter((item) => item.conversationId === activeConversation.id) : []),
    [activeConversation, store.messages],
  );

  const send = async (rawText = draft) => {
    const content = rawText.trim();
    if (!content || chat.isPending) return;
    setDraft("");
    let conversation = activeConversation;
    if (!conversation) {
      conversation = await createConversation();
      setActiveConversationId(conversation.id);
    }
    await addMessage({ conversationId: conversation.id, role: "user", content, state: "complete" });

    try {
      const history = [...messages, { role: "user" as const, content }]
        .filter((message) => message.role !== "system")
        .slice(-10)
        .map((message) => ({ role: message.role as "user" | "assistant", content: message.content }));
      const response = await chat.mutateAsync({ messages: history, language: store.settings.language });
      await addMessage({ conversationId: conversation.id, role: "assistant", content: response.content, state: "complete" });
      await addActivity({
        kind: "chat",
        status: "success",
        title: "Assistant response ready",
        detail: `Managed model: ${response.model}`,
      });
    } catch {
      await addMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: "I could not reach the managed assistant service right now. Your local conversation is still saved. Please try again shortly.",
        state: "failed",
      });
      await addActivity({
        kind: "chat",
        status: "failed",
        title: "Assistant request could not be completed",
        detail: "The managed provider was unavailable or the request could not be validated.",
      });
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setDraft("");
  };

  const speakResponse = async (message: Message) => {
    if (!store.settings.speechEnabled) {
      Alert.alert("Spoken answers are off", "Enable Spoken answers in Settings to use your device’s text-to-speech voice.");
      return;
    }
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) {
      await Speech.stop();
      return;
    }
    Speech.speak(message.content, {
      language: store.settings.language,
      rate: 0.92,
      onError: () => Alert.alert("Speech could not start", "Your device does not currently have a compatible text-to-speech voice available."),
    });
  };

  if (!isReady) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator color="#246BFD" />
        <Text className="mt-3 text-muted">Preparing your local workspace…</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="px-4" containerClassName="bg-background">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="flex-row items-center justify-between pt-2 pb-4">
          <View>
            <Text className="text-2xl font-bold text-foreground">Assistant</Text>
            <Text className="mt-1 text-sm text-muted">Private workspace · free-first mode</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              accessibilityLabel="View activity"
              onPress={() => router.push("/activity" as never)}
              style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
              className="h-11 w-11 items-center justify-center rounded-full bg-surface border border-border"
            >
              <MaterialIcons name="history" size={21} color="#246BFD" />
            </Pressable>
            <Pressable
              accessibilityLabel="Start a new conversation"
              onPress={startNewConversation}
              style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
              className="h-11 w-11 items-center justify-center rounded-full bg-primary"
            >
              <MaterialIcons name="add" size={23} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {messages.length === 0 ? (
          <View className="flex-1 pt-8">
            <View className="rounded-[28px] bg-surface border border-border p-6">
              <View className="mb-4 h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0FF]">
                <MaterialIcons name="auto-awesome" size={23} color="#246BFD" />
              </View>
              <Text className="text-2xl font-bold text-foreground">How can I help?</Text>
              <Text className="mt-2 text-[15px] leading-6 text-muted">
                Ask for a plan, explanation, draft, or idea. External actions stay off until you explicitly configure and approve them.
              </Text>
            </View>
            <Text className="mt-7 mb-3 text-sm font-semibold text-foreground">Try a starting point</Text>
            {quickPrompts.map((prompt) => (
              <Pressable
                key={prompt}
                onPress={() => send(prompt)}
                style={({ pressed }) => ({ opacity: pressed ? 0.68 : 1 })}
                className="mb-3 flex-row items-center justify-between rounded-2xl bg-surface border border-border px-4 py-4"
              >
                <Text className="mr-4 flex-1 text-[15px] leading-5 text-foreground">{prompt}</Text>
                <MaterialIcons name="arrow-forward" size={19} color="#64748B" />
              </Pressable>
            ))}
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} onSpeak={(message) => void speakResponse(message)} speechEnabled={store.settings.speechEnabled} />}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ paddingVertical: 8 }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        )}

        {chat.isPending ? (
          <View className="mb-2 flex-row items-center gap-2 px-2">
            <ActivityIndicator size="small" color="#246BFD" />
            <Text className="text-sm text-muted">Thinking with the managed provider…</Text>
          </View>
        ) : null}
        <View className="mb-3 flex-row items-end rounded-[24px] bg-surface border border-border px-3 py-2">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message your assistant"
            placeholderTextColor="#7C8AA0"
            multiline
            maxLength={4000}
            returnKeyType="send"
            onSubmitEditing={() => send()}
            className="max-h-28 flex-1 px-2 py-2 text-[16px] text-foreground"
            accessibilityLabel="Assistant message"
          />
          <Pressable
            accessibilityLabel="Voice input will be available after optional setup"
            onPress={() => Alert.alert("Voice input is not active", "This release supports spoken answers. Microphone transcription needs a separate opt-in setup and is currently off.")}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            className="mb-0.5 h-10 w-10 items-center justify-center rounded-full"
          >
            <MaterialIcons name="mic-none" size={22} color="#64748B" />
          </Pressable>
          <Pressable
            accessibilityLabel="Send message"
            disabled={!draft.trim() || chat.isPending}
            onPress={() => send()}
            style={({ pressed }) => ({ opacity: !draft.trim() || chat.isPending ? 0.4 : pressed ? 0.75 : 1 })}
            className="mb-0.5 h-10 w-10 items-center justify-center rounded-full bg-primary"
          >
            <MaterialIcons name="arrow-upward" size={21} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
