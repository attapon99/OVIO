import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LibraryScreen from "./screens/LibraryScreen";
import RecordingScreen from "./screens/RecordingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import type { ScreenTab } from "./screens/ovio-ui";

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>("library");

  let content = <LibraryScreen onTabPress={setActiveTab} />;

  if (activeTab === "recording") {
    content = <RecordingScreen onTabPress={setActiveTab} />;
  }

  if (activeTab === "settings") {
    content = <SettingsScreen onTabPress={setActiveTab} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>{content}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
