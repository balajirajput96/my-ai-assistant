import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useAssistantStore } from "@/hooks/use-assistant-store";

function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <View className="border-b border-border px-4 py-4 last:border-b-0">
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Text className="text-[15px] font-semibold text-foreground">{title}</Text>
          <Text className="mt-1 text-sm leading-5 text-muted">{description}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  const { store, isReady, clearLocalData, updateSettings } = useAssistantStore();

  if (!isReady) {
    return <ScreenContainer className="items-center justify-center"><ActivityIndicator color="#246BFD" /></ScreenContainer>;
  }

  return (
    <ScreenContainer className="px-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 34 }}>
        <View className="pt-2 pb-4">
          <Text className="text-2xl font-bold text-foreground">Settings</Text>
          <Text className="mt-1 text-sm text-muted">Control your experience, privacy, and device features.</Text>
        </View>

        <Text className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Privacy</Text>
        <View className="overflow-hidden rounded-2xl bg-surface border border-border">
          <SettingRow title="Appearance" description="The interface automatically follows your device’s light or dark appearance setting.">
            <MaterialIcons name="brightness-6" size={21} color="#64748B" />
          </SettingRow>
          <SettingRow title="Local memory" description="Keep conversations and routine states on this device.">
            <Switch value={store.settings.memoryEnabled} onValueChange={(value) => updateSettings({ memoryEnabled: value })} trackColor={{ false: "#CBD5E1", true: "#246BFD" }} />
          </SettingRow>
          <SettingRow title="Clear local data" description="Remove conversations, messages, routines, and activity history from this device.">
            <Pressable
              accessibilityLabel="Clear local data"
              onPress={() => Alert.alert("Clear all local data?", "This cannot be undone. Server-side providers do not receive a deletion request because this release does not sync your history.", [
                { text: "Cancel", style: "cancel" },
                { text: "Clear data", style: "destructive", onPress: clearLocalData },
              ])}
              style={({ pressed }) => ({ opacity: pressed ? 0.55 : 1 })}
            >
              <MaterialIcons name="delete-outline" size={23} color="#C13B4A" />
            </Pressable>
          </SettingRow>
        </View>

        <Text className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-muted">Assistant</Text>
        <View className="overflow-hidden rounded-2xl bg-surface border border-border">
          <SettingRow title="Spoken answers" description="Use your device’s text-to-speech voice when you tap Speak on a response.">
            <Switch value={store.settings.speechEnabled} onValueChange={(value) => updateSettings({ speechEnabled: value })} trackColor={{ false: "#CBD5E1", true: "#246BFD" }} />
          </SettingRow>
          <SettingRow title="Hindi-first responses" description="Ask the managed assistant to respond in Hindi unless your request uses another language.">
            <Switch value={store.settings.language === "hi-IN"} onValueChange={(value) => updateSettings({ language: value ? "hi-IN" : "en-IN" })} trackColor={{ false: "#CBD5E1", true: "#246BFD" }} />
          </SettingRow>
          <SettingRow title="Provider mode" description="Managed model calls are server-side. The app never silently switches to a paid external provider.">
            <View className="rounded-full bg-[#E8F0FF] px-3 py-1"><Text className="text-xs font-semibold text-primary">{store.settings.providerMode}</Text></View>
          </SettingRow>
        </View>

        <Text className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-muted">Feedback</Text>
        <Pressable
          onPress={() => Alert.alert("Feedback capture", "In the next server-connected phase, this will create a structured report. For this MVP, please use your project feedback channel and include the screen, expected result, and what happened.")}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="flex-row items-center rounded-2xl bg-surface border border-border px-4 py-4"
        >
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><MaterialIcons name="rate-review" size={21} color="#246BFD" /></View>
          <View className="flex-1"><Text className="text-[15px] font-semibold text-foreground">Share feedback</Text><Text className="mt-1 text-sm text-muted">Report a bug or suggest a feature.</Text></View>
          <MaterialIcons name="chevron-right" size={22} color="#64748B" />
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
