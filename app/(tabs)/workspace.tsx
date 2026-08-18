import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, Share, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useAssistantStore } from "@/hooks/use-assistant-store";

export default function WorkspaceScreen() {
  const { store, isReady, deleteConversation, renameConversation } = useAssistantStore();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState("");

  const conversations = useMemo(
    () => store.conversations.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase())),
    [query, store.conversations],
  );
  const editingConversation = store.conversations.find((item) => item.id === editingId);

  const exportConversation = async (conversationId: string) => {
    const conversation = store.conversations.find((item) => item.id === conversationId);
    if (!conversation) return;
    const transcript = store.messages
      .filter((item) => item.conversationId === conversationId)
      .map((item) => `${item.role === "user" ? "You" : "Assistant"}: ${item.content}`)
      .join("\n\n");
    await Share.share({ title: conversation.title, message: `${conversation.title}\n\n${transcript}` });
  };

  if (!isReady) {
    return <ScreenContainer className="items-center justify-center"><ActivityIndicator color="#246BFD" /></ScreenContainer>;
  }

  return (
    <ScreenContainer className="px-4">
      <View className="pt-2 pb-4">
        <Text className="text-2xl font-bold text-foreground">Workspace</Text>
        <Text className="mt-1 text-sm text-muted">Your conversations stay on this device by default.</Text>
      </View>
      <View className="mb-4 flex-row items-center rounded-2xl bg-surface border border-border px-3">
        <MaterialIcons name="search" size={20} color="#64748B" />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search conversations" placeholderTextColor="#7C8AA0" className="flex-1 px-3 py-3 text-[15px] text-foreground" accessibilityLabel="Search conversations" />
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="mt-12 items-center rounded-[28px] bg-surface border border-border px-7 py-10">
            <MaterialIcons name="folder-open" size={34} color="#246BFD" />
            <Text className="mt-4 text-lg font-semibold text-foreground">Your workspace is ready</Text>
            <Text className="mt-2 text-center text-[15px] leading-6 text-muted">Start a conversation and it will appear here for you to reopen or delete.</Text>
            <Pressable onPress={() => router.navigate("/(tabs)")} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })} className="mt-5 rounded-full bg-primary px-5 py-3">
              <Text className="font-semibold text-white">Open Assistant</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl bg-surface border border-border p-4">
            <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><MaterialIcons name="chat-bubble-outline" size={20} color="#246BFD" /></View>
            <View className="flex-1">
              <Text numberOfLines={1} className="text-[15px] font-semibold text-foreground">{item.title}</Text>
              <Text className="mt-1 text-xs text-muted">Updated {new Date(item.updatedAt).toLocaleDateString()}</Text>
            </View>
            </View>
            <View className="mt-4 flex-row gap-2">
              <Pressable onPress={() => { setEditingId(item.id); setTitleDraft(item.title); }} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })} className="rounded-full border border-border px-3 py-2"><Text className="text-xs font-semibold text-foreground">Rename</Text></Pressable>
              <Pressable onPress={() => void exportConversation(item.id)} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })} className="rounded-full border border-border px-3 py-2"><Text className="text-xs font-semibold text-foreground">Export</Text></Pressable>
            <Pressable
              accessibilityLabel={`Delete ${item.title}`}
              onPress={() => Alert.alert("Delete conversation?", "This removes this conversation from this device.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteConversation(item.id) },
              ])}
              style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
              className="h-9 w-9 items-center justify-center rounded-full"
            >
              <MaterialIcons name="delete-outline" size={21} color="#C13B4A" />
            </Pressable>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 28, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={Boolean(editingConversation)} transparent animationType="fade" onRequestClose={() => setEditingId(null)}>
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-3xl bg-surface p-5">
            <Text className="text-lg font-bold text-foreground">Rename conversation</Text>
            <TextInput value={titleDraft} onChangeText={setTitleDraft} maxLength={80} autoFocus className="mt-4 rounded-xl border border-border px-3 py-3 text-[16px] text-foreground" accessibilityLabel="Conversation title" />
            <View className="mt-5 flex-row justify-end gap-3">
              <Pressable onPress={() => setEditingId(null)} className="px-4 py-3"><Text className="font-semibold text-muted">Cancel</Text></Pressable>
              <Pressable onPress={async () => { if (editingId) await renameConversation(editingId, titleDraft); setEditingId(null); }} className="rounded-full bg-primary px-5 py-3"><Text className="font-semibold text-white">Save</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
