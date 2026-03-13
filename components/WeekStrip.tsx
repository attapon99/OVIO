import { useEffect, useMemo, useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/design/theme";
import type { WeekStripProps } from "@/design/types";
import { addDays, buildTimelineWeek, isSameCalendarDay } from "@/utils/date";

const SWIPE_TRIGGER = 52;
const SWIPE_VELOCITY_TRIGGER = 560;
const SNAP_DURATION = 240;

export function WeekStrip({
  selectedDate,
  onSelectDate,
  onNavigateWeek,
}: WeekStripProps) {
  const t = useAppTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isTransitioning = useSharedValue(false);
  const navigationRef = useRef(onNavigateWeek);

  useEffect(() => {
    navigationRef.current = onNavigateWeek;
  }, [onNavigateWeek]);

  const navigateWeek = (direction: "previous" | "next") => {
    navigationRef.current?.(direction);
  };

  const previousWeekDays = useMemo(
    () => buildTimelineWeek(addDays(selectedDate, -7)),
    [selectedDate]
  );
  const currentWeekDays = useMemo(() => buildTimelineWeek(selectedDate), [selectedDate]);
  const nextWeekDays = useMemo(
    () => buildTimelineWeek(addDays(selectedDate, 7)),
    [selectedDate]
  );
  const pages = useMemo(
    () => [
      { key: "previous", days: previousWeekDays, selectedDate: addDays(selectedDate, -7) },
      { key: "current", days: currentWeekDays, selectedDate },
      { key: "next", days: nextWeekDays, selectedDate: addDays(selectedDate, 7) },
    ],
    [currentWeekDays, nextWeekDays, previousWeekDays, selectedDate]
  );

  useEffect(() => {
    if (!containerWidth || isTransitioning.value) {
      return;
    }

    translateX.value = -containerWidth;
  }, [containerWidth, pages, translateX, isTransitioning]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const snapToCenter = () => {
    "worklet";
    translateX.value = withTiming(-containerWidth, { duration: 220 });
  };

  const commitWeekNavigation = (direction: "previous" | "next") => {
    navigationRef.current?.(direction);
    translateX.value = -containerWidth;
  };

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-12, 12])
        .failOffsetY([-16, 16])
        .onBegin(() => {
          cancelAnimation(translateX);
        })
        .onUpdate((event) => {
          if (isTransitioning.value || containerWidth <= 0) {
            return;
          }

          translateX.value = clamp(
            -containerWidth + event.translationX,
            -containerWidth * 2,
            0
          );
        })
        .onEnd((event) => {
          if (isTransitioning.value || containerWidth <= 0) {
            return;
          }

          const shouldGoNext =
            event.translationX < -SWIPE_TRIGGER ||
            event.velocityX < -SWIPE_VELOCITY_TRIGGER;
          const shouldGoPrevious =
            event.translationX > SWIPE_TRIGGER ||
            event.velocityX > SWIPE_VELOCITY_TRIGGER;

          if (shouldGoNext) {
            isTransitioning.value = true;
            translateX.value = withTiming(-containerWidth * 2, { duration: SNAP_DURATION }, (finished) => {
              if (!finished) {
                isTransitioning.value = false;
                return;
              }

              runOnJS(commitWeekNavigation)("next");
              isTransitioning.value = false;
            });
            return;
          }

          if (shouldGoPrevious) {
            isTransitioning.value = true;
            translateX.value = withTiming(0, { duration: SNAP_DURATION }, (finished) => {
              if (!finished) {
                isTransitioning.value = false;
                return;
              }

              runOnJS(commitWeekNavigation)("previous");
              isTransitioning.value = false;
            });
            return;
          }

          snapToCenter();
        }),
    [containerWidth, isTransitioning, snapToCenter, translateX]
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setContainerWidth(nextWidth);
    translateX.value = -nextWidth;
  };

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.wrap, { backgroundColor: t.colors.surface }]}>
        <View onLayout={handleLayout} style={styles.viewport}>
          <Animated.View style={[styles.pagesRow, animatedStyle]}>
            {pages.map((page) => (
              <View key={page.key} style={[styles.page, { width: containerWidth || undefined }]}>
                <View style={styles.row}>
                  {page.days.map((day) => {
                    const active = isSameCalendarDay(day.date, page.selectedDate);

                    return (
                      <Pressable
                        key={day.key}
                        style={[
                          styles.day,
                          {
                            backgroundColor: active ? t.colors.text : t.colors.transparent,
                          },
                        ]}
                        onPress={() => onSelectDate?.(day.date)}
                      >
                        <Text
                          style={[
                            styles.label,
                            { color: active ? t.colors.textInverted : t.colors.textMuted },
                          ]}
                        >
                          {day.label}
                        </Text>
                        <Text
                          style={[
                            styles.number,
                            { color: active ? t.colors.textInverted : t.colors.text },
                          ]}
                        >
                          {day.day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 30,
    overflow: "hidden",
    padding: 8,
  },
  viewport: {
    overflow: "hidden",
  },
  pagesRow: {
    flexDirection: "row",
  },
  page: {
    flexShrink: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  day: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 8,
    minHeight: 66,
    justifyContent: "center",
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
  },
  number: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "800",
  },
});
