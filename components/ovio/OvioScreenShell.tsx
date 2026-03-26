/**
 * Shared page shell for OVIO screens.
 * It renders the header, scroll area, optional mini player, and bottom nav.
 */
import { useState, type ReactNode } from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExpandedPlayerSheet } from "@/components/ovio/ExpandedPlayerSheet";
import { HeaderBar } from "@/components/HeaderBar";
import { MiniPlayerBar } from "@/components/ovio/MiniPlayerBar";
import { OvioBottomNav } from "@/components/ovio/OvioBottomNav";
import { styles } from "@/components/ovio/styles";
import type { ScreenTab } from "@/components/ovio/types";
import type { PlayableRecording } from "@/utils/playable-recordings";
import { formatRecordingDurationLabel } from "@/utils/playable-recordings";

// Wraps each OVIO screen in the shared header, scroll area, and bottom controls.
export function OvioScreenShell({
  children,
  activeTab,
  subtitle,
  onTabPress,
  currentTrack,
  isMiniPlayerPlaying,
  playbackCurrentTimeSeconds,
  playbackDurationSeconds,
  onToggleMiniPlayerPlayback,
  onSeekBackward,
  onSeekForward,
  onSeekToProgress,
  onPreviousTrack,
  onNextTrack,
  hasPreviousTrack,
  hasNextTrack,
  onScrollBeginDrag,
  onMomentumScrollBegin,
  overlay,
}: {
  children: ReactNode;
  activeTab: ScreenTab;
  subtitle: string;
  onTabPress: (tab: ScreenTab) => void;
  currentTrack?: PlayableRecording | null;
  isMiniPlayerPlaying?: boolean;
  playbackCurrentTimeSeconds?: number;
  playbackDurationSeconds?: number;
  onToggleMiniPlayerPlayback?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
  onSeekToProgress?: (progress: number) => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
  hasPreviousTrack?: boolean;
  hasNextTrack?: boolean;
  onScrollBeginDrag?: ScrollViewProps["onScrollBeginDrag"];
  onMomentumScrollBegin?: ScrollViewProps["onMomentumScrollBegin"];
  overlay?: ReactNode;
}) {
  const [isExpandedPlayerVisible, setIsExpandedPlayerVisible] = useState(false);
  const miniPlayerSubtitle = currentTrack
    ? formatRecordingDurationLabel(currentTrack.durationMillis)
    : undefined;
  const durationSeconds = playbackDurationSeconds ?? 0;
  const currentTimeSeconds = clamp(playbackCurrentTimeSeconds ?? 0, 0, durationSeconds || 0);
  const playbackProgress =
    durationSeconds > 0 ? clamp(currentTimeSeconds / durationSeconds, 0, 1) : 0;

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
            tag={currentTrack.type}
            title={currentTrack.title}
            subtitle={miniPlayerSubtitle}
            isPlaying={Boolean(isMiniPlayerPlaying)}
            bottomOffset={86}
            onPress={() => setIsExpandedPlayerVisible(true)}
            onTogglePlay={onToggleMiniPlayerPlayback}
          />
        ) : null}
        {activeTab === "library" && currentTrack ? (
          <ExpandedPlayerSheet
            visible={isExpandedPlayerVisible}
            title={currentTrack.title}
            subtitle={miniPlayerSubtitle}
            isPlaying={Boolean(isMiniPlayerPlaying)}
            currentTimeSeconds={currentTimeSeconds}
            durationSeconds={durationSeconds}
            progress={playbackProgress}
            onDismiss={() => setIsExpandedPlayerVisible(false)}
            onTogglePlay={() => onToggleMiniPlayerPlayback?.()}
            onSeekBackward={() => onSeekBackward?.()}
            onSeekForward={() => onSeekForward?.()}
            onSeekToProgress={(progress) => onSeekToProgress?.(progress)}
            onPreviousTrack={() => onPreviousTrack?.()}
            onNextTrack={() => onNextTrack?.()}
            hasPreviousTrack={Boolean(hasPreviousTrack)}
            hasNextTrack={Boolean(hasNextTrack)}
          />
        ) : null}
        <OvioBottomNav activeTab={activeTab} onTabPress={onTabPress} />
      </View>
    </SafeAreaView>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
