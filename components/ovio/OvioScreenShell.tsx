/**
 * Shared page shell for OVIO screens.
 * It renders the header, scroll area, optional mini player, and bottom nav.
 */
import { useState, type ReactNode } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HeaderBar } from "@/components/HeaderBar";
import { MiniPlayerBar } from "@/components/ovio/MiniPlayerBar";
import { OvioBottomNav } from "@/components/ovio/OvioBottomNav";
import { styles } from "@/components/ovio/styles";
import type { RecordingTag, ScreenTab } from "@/components/ovio/types";

// Wraps each OVIO screen in the shared header, scroll area, and bottom controls.
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
  // This mock player state stays in the shell because it belongs to the shared layout.
  const [hasCurrentTrack] = useState(true);
  // This local mock state decides whether the mini player shows active playback UI.
  const [isMiniPlayerPlaying] = useState(true);
  // The mini player uses this mock track only on the library tab.
  const currentTrack = hasCurrentTrack
    ? {
        tag: "voice" as RecordingTag,
        title: "Meeting Notes: Project X",
        subtitle: "Audio Captured",
        artwork: require("../../assets/images/react-logo.png"),
      }
    : null;

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.phoneFrame}>
        <View style={styles.headerContainer}>
          <HeaderBar title="OVIO" subtitle={subtitle} />
          <View style={styles.divider} />
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
            tag={currentTrack.tag}
            title={currentTrack.title}
            subtitle={currentTrack.subtitle}
            artwork={currentTrack.artwork}
            isPlaying={isMiniPlayerPlaying}
            bottomOffset={86}
          />
        ) : null}
        <OvioBottomNav activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}
