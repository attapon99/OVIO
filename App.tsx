import { useState } from "react";
import LibraryScreen from "./screens/LibraryScreen";
import RecordingScreen from "./screens/RecordingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import type { ScreenTab } from "./screens/ovio-ui";

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>("library");

  if (activeTab === "recording") {
    return <RecordingScreen onTabPress={setActiveTab} />;
  }

  if (activeTab === "settings") {
    return <SettingsScreen onTabPress={setActiveTab} />;
  }

  return <LibraryScreen onTabPress={setActiveTab} />;
}
