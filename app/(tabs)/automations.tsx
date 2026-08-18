import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Alert, FlatList, Pressable, Switch, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useAssistantStore } from "@/hooks/use-assistant-store";

export default function AutomationsScreen() {
  const { store, isReady, updateRoutine } = useAssistantStore();

  if (!isReady) {
    return <ScreenContainer className="items-center justify-center"><ActivityIndicator color="#246BFD" /></ScreenContainer>;
  }

  return (
    <ScreenContainer className="px-4">
      <View className="pt-2 pb-4">
        <Text className="text-2xl font-bold text-foreground">Automations</Text>
        <Text className="mt-1 text-sm text-muted">Only low-risk local routine templates can be enabled here.</Text>
      </View>
      <View className="mb-4 flex-row gap-3 rounded-2xl border border-[#F1C879] bg-[#FFF8E6] p-4">
        <MaterialIcons name="verified-user" size={22} color="#A76700" />
        <Text className="flex-1 text-sm leading-5 text-[#805200]">External accounts, background jobs, publishing, and payments are disabled until a secure integration and your direct approval are available.</Text>
      </View>
      <FlatList
        data={store.routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isLowRisk = item.riskLevel === "low";
          return (
            <View className="mb-3 rounded-2xl bg-surface border border-border p-4">
              <View className="flex-row items-start">
                <View className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${isLowRisk ? "bg-[#E8F7F1]" : "bg-[#FFF3E1]"}`}>
                  <MaterialIcons name={isLowRisk ? "bolt" : "lock-outline"} size={20} color={isLowRisk ? "#168563" : "#C97700"} />
                </View>
                <View className="flex-1 pr-2">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="flex-1 text-[15px] font-semibold text-foreground">{item.name}</Text>
                    <Text className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${isLowRisk ? "bg-[#E8F7F1] text-[#168563]" : "bg-[#FFF3E1] text-[#A76700]"}`}>{item.riskLevel}</Text>
                  </View>
                  <Text className="mt-2 text-sm leading-5 text-muted">{item.description}</Text>
                </View>
              </View>
              <View className="mt-4 border-t border-border pt-3">
                <Text className="text-xs leading-5 text-muted">{item.nextStep}</Text>
                <View className="mt-3 flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-foreground">{isLowRisk ? (item.enabled ? "Enabled" : "Paused") : "Setup required"}</Text>
                  <Switch
                    value={item.enabled}
                    disabled={!isLowRisk}
                    onValueChange={(value) => {
                      void updateRoutine(item.id, value);
                    }}
                    trackColor={{ false: "#CBD5E1", true: "#246BFD" }}
                  />
                </View>
              </View>
              {!isLowRisk ? (
                <Pressable
                  onPress={() => Alert.alert("Integration is not configured", "This action needs a server-side connection, least-privilege access, a review screen, and your confirmation. It is intentionally unavailable in this release.")}
                  style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1 })}
                  className="mt-3 self-start rounded-full border border-border px-4 py-2"
                >
                  <Text className="text-sm font-semibold text-foreground">Why is this unavailable?</Text>
                </Pressable>
              ) : null}
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}
