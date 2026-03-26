/**
 * Full-screen player sheet that expands from the mini player and dismisses with a swipe-down gesture.
 */
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { styles } from "@/components/ovio/styles";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ovioColors } from "@/design/tokens/colors";

const DISMISS_DISTANCE = 140;
const DISMISS_VELOCITY = 1.05;
const MOCK_PROGRESS = 0.18;

export function ExpandedPlayerSheet({
  visible,
  title,
  subtitle,
  isPlaying,
  onDismiss,
  onTogglePlay,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  isPlaying: boolean;
  onDismiss: () => void;
  onTogglePlay: () => void;
}) {
  const { height: windowHeight } = useWindowDimensions();
  const translateY = useRef(new Animated.Value(windowHeight)).current;

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
            <View style={styles.expandedPlayerProgressTrack}>
              <View
                style={[
                  styles.expandedPlayerProgressFill,
                  { width: `${MOCK_PROGRESS * 100}%` },
                ]}
              />
            </View>
            <View style={styles.expandedPlayerTimeRow}>
              <Text style={styles.expandedPlayerTimeText}>00:34</Text>
              <Text style={styles.expandedPlayerTimeText}>-12:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.expandedPlayerControlsBlock}>
          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
          >
            <Ionicons
              name="play-skip-back"
              size={40}
              color={ovioColors.white}
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            style={styles.expandedPlayerIconButton}
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
          >
            <Ionicons
              name="play-skip-forward"
              size={40}
              color={ovioColors.white}
            />
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
