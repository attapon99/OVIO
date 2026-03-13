/**
 * Settings screen for the mock account and app preferences.
 * This file mostly renders shared OVIO UI from static config data.
 */
import {
  OvioScreenShell,
  PremiumCard,
  SectionLabel,
  SettingRow,
  StatCard,
  type ScreenTab,
} from "@/screens/ovio-ui";
import { settingsSections, settingsStats } from "@/data/settings/settings-screen-data";
import { StyleSheet, View } from "react-native";

// This screen mostly maps static settings data into reusable rows and cards.
export default function SettingsScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  return (
    <OvioScreenShell activeTab="settings" subtitle="ACCOUNT" onTabPress={onTabPress}>
      <SectionLabel>OBSERVATION_STATS</SectionLabel>
      <View style={styles.statsRow}>
        {settingsStats.map((stat) => (
          <StatCard key={stat.id} label={stat.label} value={stat.value} />
        ))}
      </View>

      {settingsSections.map((section) => (
        <View key={section.title}>
          <SectionLabel>{section.title}</SectionLabel>
          {section.rows.map((row) => (
            <SettingRow
              key={row.label}
              label={row.label}
              value={row.value}
              toggle={row.toggle}
            />
          ))}
        </View>
      ))}

      <SectionLabel>ACCOUNT_&_BILLING</SectionLabel>
      <PremiumCard />
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  // Keeps the two stat cards side by side.
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
});
