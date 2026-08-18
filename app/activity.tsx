import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useAssistantStore } from "@/hooks/use-assistant-store";

const colors = { success: "#168563", pending: "#C97700", blocked: "#C97700", failed: "#C13B4A" } as const;

export default function ActivityScreen() {
  const { store, isReady } = useAssistantStore();
  if (!isReady) return <ScreenContainer className="items-center justify-center"><ActivityIndicator color="#246BFD" /></ScreenContainer>;

  return (
    <ScreenContainer className="px-4">
      <View className="flex-row items-center gap-3 pt-2 pb-4">
        <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })} className="h-10 w-10 items-center justify-center rounded-full bg-surface border border-border">
          <MaterialIcons name="arrow-back" size={22} color="#12213B" />
        </Pressable>
        <View><Text className="text-2xl font-bold text-foreground">Activity</Text><Text className="mt-1 text-sm text-muted">An honest record of local and managed actions.</Text></View>
      </View>
      <FlatList
        data={store.activity}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row rounded-2xl bg-surface border border-border p-4">
            <View style={{ backgroundColor: `${colors[item.status]}1A` }} className="mr-3 h-10 w-10 items-center justify-center rounded-xl">
              <MaterialIcons name={item.status === "success" ? "check-circle" : item.status === "failed" ? "error-outline" : "schedule"} size={21} color={colors[item.status]} />
            </View>
            <View className="flex-1"><Text className="text-[15px] font-semibold text-foreground">{item.title}</Text><Text className="mt-1 text-sm leading-5 text-muted">{item.detail}</Text><Text className="mt-2 text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</Text></View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
