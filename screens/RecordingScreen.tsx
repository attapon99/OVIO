import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  OvioScreenShell,
  SectionLabel,
  type ScreenTab,
} from "@/screens/ovio-ui";

export default function RecordingScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  return (
    <OvioScreenShell activeTab="recording" subtitle="RECORDER" onTabPress={onTabPress}>
      <SectionLabel>RECORDING_PANEL</SectionLabel>
      <View style={styles.card}>
        <Text style={styles.title}>REC SCREEN PLACEHOLDER</Text>
        <Text style={styles.meta}>
          UI ONLY. RECORDING CONTROLS WILL BE ADDED LATER.
        </Text>
      </View>

      <SectionLabel>QUICK_ACTIONS</SectionLabel>
      <Pressable style={styles.row}>
        <Text style={styles.rowLabel}>START NIGHT SESSION</Text>
        <Text style={styles.rowValue}>SOON &gt;</Text>
      </Pressable>
      <Pressable style={styles.row}>
        <Text style={styles.rowLabel}>MIC CHECK</Text>
        <Text style={styles.rowValue}>SOON &gt;</Text>
      </Pressable>
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f4f4f4",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    lineHeight: 24,
    letterSpacing: -0.6,
    fontWeight: "900",
    color: "#0d0d0d",
  },
  meta: {
    marginTop: 8,
    fontSize: 11,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: "#777",
  },
  row: {
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
    fontWeight: "800",
    color: "#111",
  },
  rowValue: {
    fontSize: 12,
    letterSpacing: 0.2,
    fontWeight: "800",
    color: "#315ee9",
  },
});
