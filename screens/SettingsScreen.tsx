import {
  OvioHeader,
  OvioScreenShell,
  PremiumCard,
  SectionLabel,
  SettingRow,
  StatCard,
} from "@/screens/ovio-ui";
import { View } from "react-native";

export default function SettingsScreen() {
  return (
    <OvioScreenShell activeTab="settings">
      <OvioHeader subtitle="ACCOUNT" />

      <SectionLabel>OBSERVATION_STATS</SectionLabel>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <StatCard label="TOTAL HOURS" value="124.5" />
        <StatCard label="EVENTS CAPTURED" value="892" />
      </View>

      <SectionLabel>CAPTURE_PARAMETERS</SectionLabel>
      <SettingRow label="SENSITIVITY THRESHOLD" value="HIGH FIDELITY" />
      <SettingRow label="CLOUD SYNCHRONIZATION" toggle />
      <SettingRow label="VOICE DETECTION" toggle />
      <SettingRow label="SNORING ANALYSIS" toggle />

      <SectionLabel>SYSTEM_PREFERENCES</SectionLabel>
      <SettingRow label="NOTIFICATIONS" value="ENABLED" />
      <SettingRow label="APPEARANCE" value="LIGHT" />
      <SettingRow label="STORAGE MANAGEMENT" value="12 GB USED" />

      <SectionLabel>ACCOUNT_&_BILLING</SectionLabel>
      <PremiumCard />
    </OvioScreenShell>
  );
}
