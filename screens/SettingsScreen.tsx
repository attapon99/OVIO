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
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
});
