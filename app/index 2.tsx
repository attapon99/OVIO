import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function SettingRow({
  label,
  value,
  toggle,
}: {
  label: string;
  value?: string;
  toggle?: boolean;
}) {
  return (
    <Pressable style={styles.rowCard}>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <View style={styles.toggleTrack}>
          <View style={styles.toggleThumb} />
        </View>
      ) : (
        <Text style={styles.rowValue}>
          {value} {">"}
        </Text>
      )}
    </Pressable>
  );
}

function RecordingCard({
  tag,
  title,
  time,
  duration,
}: {
  tag: string;
  title: string;
  time: string;
  duration: string;
}) {
  return (
    <Pressable style={styles.recordCard}>
      <Text style={styles.recordTag}>{tag}</Text>
      <Text style={styles.recordTitle}>{title}</Text>
      <View style={styles.recordMetaRow}>
        <Text style={styles.recordMeta}>{time}</Text>
        <Text style={styles.recordMeta}>{duration}</Text>
      </View>
      <View style={styles.recordActions}>
        <View style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>FAV</Text>
        </View>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
    </Pressable>
  );
}

function BottomNav() {
  return (
    <View style={styles.bottomNav}>
      <Pressable style={styles.navButtonActive}>
        <Text style={styles.navIconActive}>◧</Text>
      </Pressable>
      <Pressable style={styles.navButton}>
        <Text style={styles.navIcon}>◉</Text>
      </Pressable>
      <Pressable style={styles.navButton}>
        <Text style={styles.navIcon}>◍</Text>
      </Pressable>
    </View>
  );
}

export default function OvioStaticPrototype() {
  return (
    <View style={styles.screen}>
      <View style={styles.phoneFrame}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>OVIO</Text>
              <Text style={styles.subBrand}>BIBLIOTHEK</Text>
            </View>
            <Pressable style={styles.modeBadge}>
              <Text style={styles.modeText}>DARK_MODE</Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <SectionLabel>OBSERVATION_STATS</SectionLabel>
          <View style={styles.statsRow}>
            <StatCard label="TOTAL HOURS" value="124.5" />
            <StatCard label="EVENTS CAPTURED" value="892" />
          </View>

          <SectionLabel>AUDIO_CAPTURED</SectionLabel>
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

          <SectionLabel>CAPTURE_PARAMETERS</SectionLabel>
          <SettingRow label="SENSITIVITY THRESHOLD" value="HIGH FIDELITY" />
          <SettingRow label="CLOUD SYNCHRONIZATION" toggle />
          <SettingRow label="VOICE DETECTION" toggle />

          <SectionLabel>SYSTEM_PREFERENCES</SectionLabel>
          <SettingRow label="NOTIFICATIONS" value="ENABLED" />
          <SettingRow label="APPEARANCE" value="LIGHT" />
          <SettingRow label="STORAGE MANAGEMENT" value="12 GB USED" />

          <SectionLabel>ACCOUNT_&_BILLING</SectionLabel>
          <Pressable style={styles.premiumCard}>
            <Text style={styles.premiumTitle}>OVIO_PREMIUM</Text>
            <Text style={styles.premiumSubtitle}>ACTIVE UNTIL OCT 2024</Text>
            <View style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>MANAGE_PLAN</Text>
            </View>
            <View style={styles.premiumOrb} />
          </Pressable>
        </ScrollView>

        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#1c1c1e",
    justifyContent: "center",
    padding: 14,
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#ececec",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#f7f7f7",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 42,
    letterSpacing: -1,
    fontWeight: "900",
    color: "#0d0d0d",
  },
  subBrand: {
    marginTop: 2,
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "700",
    color: "#626262",
  },
  modeBadge: {
    borderWidth: 2,
    borderColor: "#111",
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#efefef",
  },
  modeText: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: "800",
    color: "#0d0d0d",
  },
  divider: {
    height: 1,
    backgroundColor: "#d8d8d8",
    marginTop: 16,
    marginBottom: 18,
  },
  sectionLabel: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    color: "#7f7f7f",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    fontWeight: "700",
    color: "#9c9c9c",
  },
  statValue: {
    marginTop: 8,
    fontSize: 42,
    letterSpacing: -1.5,
    fontWeight: "900",
    color: "#070707",
  },
  recordCard: {
    backgroundColor: "#f4f4f4",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    position: "relative",
  },
  recordTag: {
    alignSelf: "flex-start",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.8,
    color: "#8b8b8b",
    backgroundColor: "#ebebeb",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recordTitle: {
    marginTop: 8,
    marginRight: 78,
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: -0.9,
    fontWeight: "900",
    color: "#0c0c0c",
  },
  recordMetaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  recordMeta: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8a8a8a",
  },
  recordActions: {
    position: "absolute",
    right: 12,
    top: 38,
    gap: 8,
    alignItems: "center",
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#ececec",
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteIcon: {
    color: "#0c0c0c",
    fontSize: 12,
  },
  playButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#070707",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 2,
  },
  rowCard: {
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
  toggleTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#101010",
    justifyContent: "center",
    paddingHorizontal: 3,
    alignItems: "flex-end",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  premiumCard: {
    marginTop: 2,
    backgroundColor: "#070707",
    borderRadius: 24,
    padding: 18,
    minHeight: 148,
    overflow: "hidden",
  },
  premiumTitle: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.2,
    color: "#fff",
  },
  premiumSubtitle: {
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: "700",
    color: "#8f8f8f",
  },
  premiumButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    backgroundColor: "#f5f5f5",
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  premiumButtonText: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "800",
    color: "#101010",
  },
  premiumOrb: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    right: -22,
    bottom: -32,
    backgroundColor: "#16181b",
  },
  bottomNav: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 16,
    backgroundColor: "#060606",
    borderRadius: 28,
    minHeight: 56,
    padding: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButtonActive: {
    width: 60,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    width: 60,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconActive: {
    fontSize: 20,
    color: "#050505",
    fontWeight: "800",
  },
  navIcon: {
    fontSize: 18,
    color: "#6a6a6a",
    fontWeight: "700",
  },
});
