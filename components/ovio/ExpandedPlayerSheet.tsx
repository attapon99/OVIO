/**
 * Full-screen player sheet that expands from the mini player and dismisses with a swipe-down gesture.
 */
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { styles } from "@/components/ovio/styles";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ovioColors } from "@/design/tokens/colors";
import { formatPlaybackTimeLabel } from "@/utils/playable-recordings";

const DISMISS_DISTANCE = 140;
const DISMISS_VELOCITY = 1.05;

export function ExpandedPlayerSheet({
  visible,
  title,
  subtitle,
  isPlaying,
  currentTimeSeconds,
  durationSeconds,
  progress,
  onDismiss,
  onTogglePlay,
  onSeekBackward,
  onSeekForward,
  onSeekToProgress,
  onPreviousTrack,
  onNextTrack,
  hasPreviousTrack,
  hasNextTrack,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  isPlaying: boolean;
  currentTimeSeconds: number;
  durationSeconds: number;
  progress: number;
  onDismiss: () => void;
  onTogglePlay: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onSeekToProgress: (progress: number) => void;
  onPreviousTrack: () => void;
  onNextTrack: () => void;
  hasPreviousTrack: boolean;
  hasNextTrack: boolean;
}) {
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(windowHeight)).current;
  const [progressTrackWidth, setProgressTrackWidth] = useState(0);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        tension: 72,
        friction: 13,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(translateY, {
      toValue: windowHeight,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [translateY, visible, windowHeight]);

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, windowHeight],
    outputRange: [0.24, 0],
    extrapolate: "clamp",
  });

  const sheetScale = translateY.interpolate({
    inputRange: [0, windowHeight],
    outputRange: [1, 0.985],
    extrapolate: "clamp",
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          visible &&
          gestureState.dy > 6 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy <= 0) {
            translateY.setValue(0);
            return;
          }

          translateY.setValue(gestureState.dy);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (
            gestureState.dy > DISMISS_DISTANCE ||
            gestureState.vy > DISMISS_VELOCITY
          ) {
            onDismiss();
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            tension: 82,
            friction: 12,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 82,
            friction: 12,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onDismiss, translateY, visible],
  );

  const progressPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => visible && durationSeconds > 0,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          visible &&
          durationSeconds > 0 &&
          Math.abs(gestureState.dx) >= Math.abs(gestureState.dy),
        onPanResponderGrant: (event) => {
          updateScrubProgress(event.nativeEvent.locationX);
        },
        onPanResponderMove: (event) => {
          updateScrubProgress(event.nativeEvent.locationX);
        },
        onPanResponderRelease: (event) => {
          commitScrubProgress(event.nativeEvent.locationX);
        },
        onPanResponderTerminate: () => {
          setScrubProgress(null);
        },
      }),
    [commitScrubProgress, durationSeconds, updateScrubProgress, visible]
  );

  const displayedProgress = scrubProgress ?? progress;
  const displayedCurrentTimeSeconds =
    scrubProgress !== null ? scrubProgress * durationSeconds : currentTimeSeconds;
  const displayedRemainingTimeSeconds = Math.max(durationSeconds - displayedCurrentTimeSeconds, 0);
  const currentTimeLabel = formatPlaybackTimeLabel(displayedCurrentTimeSeconds * 1000);
  const remainingTimeLabel = `-${formatPlaybackTimeLabel(displayedRemainingTimeSeconds * 1000)}`;

  function handleProgressTrackLayout(event: LayoutChangeEvent) {
    setProgressTrackWidth(event.nativeEvent.layout.width);
  }

  function updateScrubProgress(locationX: number) {
    if (progressTrackWidth <= 0 || durationSeconds <= 0) {
      return;
    }

    setScrubProgress(clamp(locationX / progressTrackWidth, 0, 1));
  }

  function commitScrubProgress(locationX: number) {
    if (progressTrackWidth <= 0 || durationSeconds <= 0) {
      setScrubProgress(null);
      return;
    }

    const nextProgress = clamp(locationX / progressTrackWidth, 0, 1);
    setScrubProgress(null);
    onSeekToProgress(nextProgress);
  }

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      style={styles.expandedPlayerOverlay}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.expandedPlayerBackdrop, { opacity: backdropOpacity }]}
      />
      <Animated.View
        style={[
          styles.expandedPlayerSheet,
          {
            transform: [{ translateY }, { scale: sheetScale }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.expandedPlayerHandleArea}>
          <View style={styles.expandedPlayerHandle} />
          <Ionicons
            name="chevron-down"
            size={22}
            color="rgba(255, 255, 255, 0.82)"
          />
        </View>

        <View style={styles.expandedPlayerCenterBlock}>
          <View style={styles.expandedPlayerTitleGroup}>
            <Text style={styles.expandedPlayerTitle} numberOfLines={2}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.expandedPlayerSubtitle} numberOfLines={2}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.expandedPlayerProgressSection}>
            <View
              style={styles.expandedPlayerProgressTrack}
              onLayout={handleProgressTrackLayout}
              {...progressPanResponder.panHandlers}
            >
              <View
                style={[
                  styles.expandedPlayerProgressFill,
                  { width: `${displayedProgress * 100}%` },
                ]}
              />
            </View>
            <View style={styles.expandedPlayerTimeRow}>
              <Text style={styles.expandedPlayerTimeText}>{currentTimeLabel}</Text>
              <Text style={styles.expandedPlayerTimeText}>{remainingTimeLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.expandedPlayerControlsBlock}>
          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
            disabled={!hasPreviousTrack}
            onPress={onPreviousTrack}
          >
            <Ionicons
              name="play-skip-back"
              size={40}
              color={hasPreviousTrack ? ovioColors.white : "rgba(255, 255, 255, 0.35)"}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
            onPress={onSeekBackward}
          >
            <IconSymbol
              name="gobackward.5"
              size={40}
              color={ovioColors.white}
              weight="medium"
              style={styles.expandedPlayerSeekSymbol}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onTogglePlay}
            style={styles.expandedPlayerPlayButton}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={45}
              color={ovioColors.textStrong}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
            onPress={onSeekForward}
          >
            <IconSymbol
              name="goforward.5"
              size={40}
              color={ovioColors.white}
              weight="medium"
              style={styles.expandedPlayerSeekSymbol}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
            disabled={!hasNextTrack}
            onPress={onNextTrack}
          >
            <Ionicons
              name="play-skip-forward"
              size={40}
              color={hasNextTrack ? ovioColors.white : "rgba(255, 255, 255, 0.35)"}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
