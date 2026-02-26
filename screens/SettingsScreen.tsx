import {
  OvioScreenShell,
  PremiumCard,
  SectionLabel,
  SettingRow,
  StatCard,
  type ScreenTab,
} from "@/screens/ovio-ui";
import { View } from "react-native";

export default function SettingsScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  return (
    <OvioScreenShell activeTab="settings" subtitle="ACCOUNT" onTabPress={onTabPress}>
      <SectionLabel>OBSERVATION_STATS</SectionLabel>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <StatCard label="TOTAL HOURS" value="124.5" />
        <StatCard label="EVENTS CAPTURED" value="892" />
      </View>

      <SectionLabel>CAPTURE_PARAMETERS</SectionLabel>
      <SettingRow label="SENSITIVITY THRESHOLD" value="HIGH FIDELITY" />
      <SettingRow label="VOICE DETECTION" toggle />
      <SettingRow label="SNORING ANALYSIS" toggle />
      <SettingRow label="FART DETECTION" toggle />

      <SectionLabel>SYSTEM_PREFERENCES</SectionLabel>
      <SettingRow label="NOTIFICATIONS" toggle />
      <SettingRow label="DARK MODE" toggle />
      <SettingRow label="STORAGE USED" value="12 GB USED" />
      <SettingRow label="EXPORT RECORDINGS" value="EXPORT" />
      <SettingRow label="PRIVACY" value="SETTINGS" />

      <SectionLabel>ACCOUNT_&_BILLING</SectionLabel>
      <PremiumCard />
    </OvioScreenShell>
  );
}
