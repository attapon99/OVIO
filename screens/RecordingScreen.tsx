import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  OvioScreenShell,
  SectionLabel,
  SettingRow,
  type ScreenTab,
} from "@/screens/ovio-ui";

const waveformHeights = [14, 20, 28, 18, 32, 22, 30, 16, 26, 19, 31, 17, 24];

export default function RecordingScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  return (
    <OvioScreenShell
      activeTab="recording"
      subtitle="CAPTURE"
      onTabPress={onTabPress}
    >
      <SectionLabel>RECORDER_INTERFACE</SectionLabel>

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroEyebrow}>LIVE SESSION</Text>
            <Text style={styles.heroTitle}>RECORD</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>READY</Text>
          </View>
        </View>

        <Text style={styles.timerLabel}>00:12</Text>
        <Text style={styles.timerHint}>AWAITING CAPTURE START</Text>

        <View style={styles.waveformCard}>
          <View style={styles.waveformRow}>
            {waveformHeights.map((height, index) => (
              <View
                key={`${height}-${index}`}
                style={[
                  styles.waveformBar,
                  { height, opacity: index % 3 === 0 ? 0.9 : 0.62 },
                ]}
              />
            ))}
          </View>
          <View style={styles.waveformFooter}>
            <Text style={styles.waveformLabel}>SIGNAL PREVIEW</Text>
            <Text style={styles.waveformMeta}>UI PLACEHOLDER</Text>
          </View>
        </View>
      </View>

      <View style={styles.recordButtonBlock}>
        <Pressable style={styles.recordButton}>
          <View style={styles.recordButtonInner}>
            <View style={styles.recordButtonCore} />
          </View>
        </Pressable>
        <Text style={styles.recordButtonLabel}>TAP_TO_RECORD</Text>
      </View>

      <View style={styles.controlRow}>
        <Pressable style={[styles.controlPill, styles.controlPillMuted]}>
          <Text style={[styles.controlPillText, styles.controlPillTextMuted]}>
            PAUSE
          </Text>
        </Pressable>
        <Pressable style={styles.controlPill}>
          <Text style={styles.controlPillText}>MARK</Text>
        </Pressable>
        <Pressable style={styles.controlPill}>
          <Text style={styles.controlPillText}>CANCEL</Text>
        </Pressable>
      </View>

      <SectionLabel>CAPTURE_PARAMETERS</SectionLabel>
      <SettingRow label="QUALITY" value="HIGH" />
      <SettingRow label="SOURCE" value="MICROPHONE" />
      <SettingRow label="NOISE FILTER" value="BALANCED" />
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#f6f6f6",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroEyebrow: {
    fontSize: 9,
    letterSpacing: 1.8,
    fontWeight: "800",
    color: "#8f8f8f",
  },
  heroTitle: {
    marginTop: 8,
    fontSize: 42,
    lineHeight: 42,
    letterSpacing: -1.6,
    fontWeight: "900",
    color: "#080808",
  },
  statusBadge: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#efefef",
    borderWidth: 1,
    borderColor: "#e2e2e2",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#8f8f8f",
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: "800",
    color: "#5e5e5e",
  },
  timerLabel: {
    marginTop: 28,
    fontSize: 62,
    lineHeight: 62,
    letterSpacing: -2.6,
    fontWeight: "900",
    color: "#0a0a0a",
    textAlign: "center",
  },
  timerHint: {
    marginTop: 8,
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: "#898989",
    textAlign: "center",
  },
  waveformCard: {
    marginTop: 22,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e7e7e7",
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 12,
  },
  waveformRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  waveformBar: {
    width: 8,
    borderRadius: 999,
    backgroundColor: "#171717",
  },
  waveformFooter: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  waveformLabel: {
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: "800",
    color: "#8d8d8d",
  },
  waveformMeta: {
    fontSize: 10,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: "#6e6e6e",
  },
  recordButtonBlock: {
    marginTop: 26,
    marginBottom: 12,
    alignItems: "center",
  },
  recordButton: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: "#0e0e0e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  recordButtonInner: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    backgroundColor: "#1b1b1b",
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f3f3f3",
  },
  recordButtonLabel: {
    marginTop: 12,
    fontSize: 10,
    letterSpacing: 2.1,
    fontWeight: "800",
    color: "#777777",
  },
  controlRow: {
    marginBottom: 12,
    flexDirection: "row",
    gap: 8,
  },
  controlPill: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#e7e7e7",
    alignItems: "center",
    justifyContent: "center",
  },
  controlPillMuted: {
    backgroundColor: "#ededed",
  },
  controlPillText: {
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: "800",
    color: "#111111",
  },
  controlPillTextMuted: {
    color: "#9a9a9a",
  },
});
