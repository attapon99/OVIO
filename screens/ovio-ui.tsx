import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRef, useState, type ReactNode } from "react";
import {
  Easing,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewProps,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { SafeAreaView } from "react-native-safe-area-context";

export type ScreenTab = "library" | "recording" | "settings";

export function OvioScreenShell({
  children,
  activeTab,
  subtitle,
  onTabPress,
  onScrollBeginDrag,
  onMomentumScrollBegin,
  overlay,
}: {
  children: ReactNode;
  activeTab: ScreenTab;
  subtitle: string;
  onTabPress: (tab: ScreenTab) => void;
  onScrollBeginDrag?: ScrollViewProps["onScrollBeginDrag"];
  onMomentumScrollBegin?: ScrollViewProps["onMomentumScrollBegin"];
  overlay?: ReactNode;
}) {
  const [hasCurrentTrack] = useState(true);
  const currentTrack = hasCurrentTrack
    ? {
        title: "Meeting Notes: Project X",
        subtitle: "Audio Captured",
        artwork: require("../assets/images/react-logo.png"),
      }
    : null;

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.phoneFrame}>
        <View style={styles.headerContainer}>
          <OvioHeader subtitle={subtitle} />
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={onScrollBeginDrag}
          onMomentumScrollBegin={onMomentumScrollBegin}
        >
          {children}
        </ScrollView>
        {overlay}
        {activeTab === "library" && currentTrack ? (
          <MiniPlayerBar
            title={currentTrack.title}
            subtitle={currentTrack.subtitle}
            artwork={currentTrack.artwork}
            bottomOffset={86}
          />
        ) : null}
        <BottomNav activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

export function OvioHeader({ subtitle }: { subtitle: string }) {
  return (
    <>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.brand}>OVIO</Text>
          <Text style={styles.subBrand}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function RecordingCard({
  tag,
  title,
  time,
  duration,
  onRequestSwipeStart,
  onRequestWillOpenSwipeable,
  onRequestOpenSwipeable,
  onRequestCloseOpenSwipeable,
  onSwipeableClosed,
}: {
  tag: string;
  title: string;
  time: string;
  duration: string;
  onRequestSwipeStart?: (swipeable: Swipeable | null) => void;
  onRequestWillOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onRequestOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onRequestCloseOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onSwipeableClosed?: (swipeable: Swipeable | null) => void;
}) {
  const swipeableRef = useRef<Swipeable | null>(null);
  const [isSwipedOpen, setIsSwipedOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [minutes = "0", seconds = "0"] = duration.split(":");
  const durationLabel = `${parseInt(minutes, 10) || 0}m ${parseInt(seconds, 10) || 0}s`;
  const closeSwipe = () => {
    swipeableRef.current?.close();
    setIsSwipedOpen(false);
  };
  const toggleFavorite = () => {
    setIsFavorited((currentValue) => !currentValue);
  };

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <Pressable style={styles.swipeActionButtonDelete} onPress={closeSwipe}>
        <Ionicons name="trash-outline" size={18} color="#fff" />
      </Pressable>
      <Pressable
        style={styles.swipeActionButton}
        onPress={() => {
          toggleFavorite();
          closeSwipe();
        }}
      >
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={18}
          color={isFavorited ? "#ff5a5f" : "#f7f7f7"}
        />
      </Pressable>
      <Pressable style={styles.swipeActionButton} onPress={closeSwipe}>
        <Ionicons name="share-outline" size={18} color="#f7f7f7" />
      </Pressable>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={44}
      friction={1.35}
      useNativeAnimations
      animationOptions={{
        duration: 115,
        easing: Easing.out(Easing.quad),
      }}
      onSwipeableOpenStartDrag={() => {
        onRequestSwipeStart?.(swipeableRef.current);
      }}
      onSwipeableWillOpen={() => {
        onRequestWillOpenSwipeable?.(swipeableRef.current);
      }}
      onSwipeableOpen={() => {
        setIsSwipedOpen(true);
        onRequestOpenSwipeable?.(swipeableRef.current);
      }}
      onSwipeableClose={() => {
        setIsSwipedOpen(false);
        onSwipeableClosed?.(swipeableRef.current);
      }}
    >
      <Pressable
        style={[styles.recordCard, isSwipedOpen && styles.recordCardActive]}
        onPress={() => onRequestCloseOpenSwipeable?.(swipeableRef.current)}
      >
        <View style={styles.recordContent}>
          <View style={styles.recordTitleRow}>
            <Text style={styles.recordTitle} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.soundTypeBadge}>
              <Text style={styles.soundTypeText} numberOfLines={1}>
                {tag}
              </Text>
            </View>
          </View>
          <View style={styles.recordMetaRow}>
            <Text style={styles.recordMeta} numberOfLines={1}>
              {time} {durationLabel}
            </Text>
            {isFavorited ? (
              <View style={styles.recordLikeIndicator}>
                <Ionicons name="heart" size={12} color="#ff6a00" />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

export function SettingRow({
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
        <Text style={styles.rowValue}>{value} &gt;</Text>
      )}
    </Pressable>
  );
}

export function PremiumCard() {
  return (
    <Pressable style={styles.premiumCard}>
      <Text style={styles.premiumTitle}>OVIO_PREMIUM</Text>
      <Text style={styles.premiumSubtitle}>ACTIVE UNTIL OCT 2024</Text>
      <View style={styles.premiumButton}>
        <Text style={styles.premiumButtonText}>MANAGE_PLAN</Text>
      </View>
      <View style={styles.premiumOrb} />
    </Pressable>
  );
}

function MiniPlayerBar({
  title,
  subtitle,
  artwork,
  bottomOffset,
}: {
  title: string;
  subtitle?: string;
  artwork: number;
  bottomOffset: number;
}) {
  return (
    <View style={[styles.miniPlayerWrap, { bottom: bottomOffset }]}>
      <BlurView intensity={55} tint="light" style={styles.miniPlayerBlur}>
        <Image source={artwork} style={styles.miniPlayerArtwork} />
        <View style={styles.miniPlayerTextWrap}>
          <Text style={styles.miniPlayerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.miniPlayerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Pressable style={styles.miniPlayerButton} accessibilityRole="button">
          <Ionicons name="play" size={18} color="#111111" />
        </Pressable>
      </BlurView>
    </View>
  );
}

function BottomNav({
  activeTab,
  onTabPress,
}: {
  activeTab: ScreenTab;
  onTabPress: (tab: ScreenTab) => void;
}) {
  const isLibrary = activeTab === "library";
  const isRecording = activeTab === "recording";
  const isSettings = activeTab === "settings";

  return (
    <View style={styles.bottomNav}>
      <Pressable
        style={isRecording ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("recording")}
      >
        <Text style={isRecording ? styles.navIconActive : styles.navIcon}>
          REC
        </Text>
      </Pressable>
      <Pressable
        style={isLibrary ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("library")}
      >
        <Text style={isLibrary ? styles.navIconActive : styles.navIcon}>
          LIB
        </Text>
      </Pressable>
      <Pressable
        style={isSettings ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("settings")}
      >
        <Text style={isSettings ? styles.navIconActive : styles.navIcon}>
          SET
        </Text>
      </Pressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ececec",
  },
  phoneFrame: {
    flex: 1,
    backgroundColor: "#ececec",
  },
  headerContainer: {
    paddingTop: 26,
    paddingHorizontal: 16,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 206,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  brand: {
    fontSize: 39,
    letterSpacing: -1,
    fontWeight: "900",
    color: "#0d0d0d",
  },
  subBrand: {
    marginTop: 1,
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "700",
    color: "#626262",
  },
  divider: {
    height: 1,
    backgroundColor: "#d5d5d5",
    marginTop: 10,
    marginBottom: 12,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: "800",
    color: "#7f7f7f",
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
    backgroundColor: "#f6f6f6",
    borderRadius: 18,
    minHeight: 75,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 14,
    marginBottom: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ececec",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  recordCardActive: {
    backgroundColor: "#e4e4e4",
  },
  recordContent: {
    gap: 12,
  },
  recordTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  recordTitle: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: -0.5,
    fontWeight: "900",
    color: "#0c0c0c",
  },
  soundTypeBadge: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#d2d2d2",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  soundTypeText: {
    fontSize: 8,
    lineHeight: 8,
    includeFontPadding: false,
    letterSpacing: 0.6,
    fontWeight: "800",
    color: "#666666",
  },
  recordMeta: {
    fontSize: 12,
    letterSpacing: 0.6,
    fontWeight: "600",
    color: "#8b8b8b",
  },
  recordMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recordLikeIndicator: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeActions: {
    width: 182,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },
  swipeActionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
  },
  swipeActionButtonDelete: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d13d3d",
    alignItems: "center",
    justifyContent: "center",
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
  miniPlayerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  miniPlayerBlur: {
    minHeight: 74,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  miniPlayerArtwork: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
  },
  miniPlayerTextWrap: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    gap: 2,
  },
  miniPlayerTitle: {
    fontSize: 14,
    letterSpacing: -0.2,
    fontWeight: "800",
    color: "#101010",
  },
  miniPlayerSubtitle: {
    fontSize: 11,
    letterSpacing: 0.2,
    fontWeight: "600",
    color: "rgba(17, 17, 17, 0.56)",
  },
  miniPlayerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.34)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.42)",
  },
  bottomNav: {
    position: "absolute",
    left: 16,
    right: 16,
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
    fontSize: 12,
    letterSpacing: 0.8,
    color: "#050505",
    fontWeight: "800",
  },
  navIcon: {
    fontSize: 12,
    letterSpacing: 0.8,
    color: "#6a6a6a",
    fontWeight: "700",
  },
});
