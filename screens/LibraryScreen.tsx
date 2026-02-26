import { Pressable, StyleSheet, Text, View } from "react-native";
import { OvioHeader, OvioScreenShell, RecordingCard } from "@/screens/ovio-ui";

export default function LibraryScreen() {
  return (
    <OvioScreenShell activeTab="library">
      <OvioHeader subtitle="BIBLIOTHEK" />

      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>TIMELINE RANGE</Text>
        <Text style={styles.sectionMeta}>OCT 2023</Text>
      </View>
      <View style={styles.timelineRow}>
        <Pressable style={styles.activeDateTile}>
          <Text style={styles.activeDateWeekday}>M</Text>
          <Text style={styles.activeDateNumber}>23</Text>
        </Pressable>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>T</Text>
          <Text style={styles.inactiveDateNumber}>24</Text>
        </View>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>W</Text>
          <Text style={styles.inactiveDateNumber}>25</Text>
        </View>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>T</Text>
          <Text style={styles.inactiveDateNumber}>26</Text>
        </View>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>F</Text>
          <Text style={styles.inactiveDateNumber}>27</Text>
        </View>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>S</Text>
          <Text style={styles.inactiveDateNumber}>28</Text>
        </View>
        <View style={styles.inactiveDateTile}>
          <Text style={styles.inactiveDateWeekday}>S</Text>
          <Text style={styles.inactiveDateNumber}>29</Text>
        </View>
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>AUDIO CAPTURED</Text>
        <Text style={styles.sectionMeta}>3 ITEMS</Text>
      </View>
      <RecordingCard
        tag="WORK"
        title="MEETING NOTES: PROJECT X"
        time="09:30"
        duration="05:24"
      />
      <RecordingCard
        tag="MUSIC"
        title="GUITAR PRACTICE_SESSION"
        time="14:10"
        duration="18:02"
      />
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: "#8a8a8a",
  },
  sectionMeta: {
    fontSize: 10,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: "#909090",
  },
  timelineRow: {
    marginBottom: 18,
    backgroundColor: "#f4f4f4",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 2,
  },
  activeDateTile: {
    width: 38,
    borderRadius: 14,
    backgroundColor: "#060606",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeDateWeekday: {
    fontSize: 8,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "#a0a0a0",
  },
  activeDateNumber: {
    marginTop: 2,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.8,
    fontWeight: "900",
    color: "#fff",
  },
  inactiveDateTile: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  inactiveDateWeekday: {
    fontSize: 8,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "#b0b0b0",
  },
  inactiveDateNumber: {
    marginTop: 2,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.8,
    fontWeight: "800",
    color: "#7e7e7e",
  },
});
