import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
  type ViewToken,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/design/theme";
import {
  buildCalendarMonthSections,
  formatCalendarMonthYear,
  getCalendarWeekdayLabels,
  getMonthSectionIndex,
} from "@/utils/date";
import type { CalendarMonthSection as CalendarMonthSectionData } from "@/utils/date";
import {
  CALENDAR_MONTH_SECTION_HEIGHT,
  CalendarMonthSection,
} from "@/components/CalendarMonthSection";

const SHEET_PRESENTATION_EXTRA_OFFSET = 56;
const SHEET_BACKDROP_FADE_DURATION = 280;
const SHEET_SPRING_CONFIG = {
  damping: 24,
  mass: 1.05,
  stiffness: 185,
  restDisplacementThreshold: 0.5,
  restSpeedThreshold: 0.5,
  useNativeDriver: true as const,
};

export function CalendarModal({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}) {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const topOffset = insets.top + 18;
  const sheetHeight = Math.max(height - topOffset, 420);
  const hiddenTranslateY = sheetHeight + SHEET_PRESENTATION_EXTRA_OFFSET;
  const [isRendered, setIsRendered] = useState(visible);
  const [isPresented, setIsPresented] = useState(false);
  const [calendarAnchorDate, setCalendarAnchorDate] = useState(selectedDate);
  const isClosingRef = useRef(false);
  const didNotifyCloseRef = useRef(false);
  const sheetTranslateY = useRef(new Animated.Value(hiddenTranslateY)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const monthSections = useMemo(
    () =>
      buildCalendarMonthSections(calendarAnchorDate, {
        monthsBefore: 12,
        monthsAfter: 24,
      }),
    [calendarAnchorDate]
  );
  const initialMonthIndex = useMemo(
    () =>
      getMonthSectionIndex(calendarAnchorDate, {
        monthsBefore: 12,
      }),
    [calendarAnchorDate]
  );
  const weekdayLabels = getCalendarWeekdayLabels();
  const [visibleMonthTitle, setVisibleMonthTitle] = useState(
    monthSections[initialMonthIndex]?.headerTitle ?? ""
  );
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 55,
    minimumViewTime: 80,
  }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: Array<ViewToken<CalendarMonthSectionData>> }) => {
      const firstVisibleSection = [...viewableItems]
        .filter((item) => item.isViewable && item.item)
        .sort((left, right) => (left.index ?? 0) - (right.index ?? 0))[0];

      if (firstVisibleSection?.item?.headerTitle) {
        setVisibleMonthTitle(firstVisibleSection.item.headerTitle);
      }
    }
  ).current;

  useEffect(() => {
    sheetTranslateY.setValue(hiddenTranslateY);
  }, [hiddenTranslateY, sheetTranslateY]);

  const animateSheetIn = () => {
    isClosingRef.current = false;
    sheetTranslateY.setValue(hiddenTranslateY);
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: SHEET_BACKDROP_FADE_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: 0,
        ...SHEET_SPRING_CONFIG,
      }),
    ]).start();
  };

  const dismissCalendarSheet = (notifyParentOnFinish: boolean) => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    setIsPresented(false);
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: SHEET_BACKDROP_FADE_DURATION,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(sheetTranslateY, {
        toValue: hiddenTranslateY,
        ...SHEET_SPRING_CONFIG,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }

      isClosingRef.current = false;
      setIsRendered(false);

      if (notifyParentOnFinish && !didNotifyCloseRef.current) {
        didNotifyCloseRef.current = true;
        onClose();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      didNotifyCloseRef.current = false;
      setCalendarAnchorDate(selectedDate);
      setVisibleMonthTitle(formatCalendarMonthYear(selectedDate));

      if (!isRendered) {
        setIsRendered(true);
        return;
      }

      if (!isPresented && !isClosingRef.current) {
        const frame = requestAnimationFrame(() => {
          setIsPresented(true);
          animateSheetIn();
        });

        return () => cancelAnimationFrame(frame);
      }

      return;
    }

    if (isRendered && isPresented && !isClosingRef.current) {
      dismissCalendarSheet(false);
    }
  }, [initialMonthIndex, isPresented, isRendered, monthSections, visible]);

  const requestClose = () => dismissCalendarSheet(true);

  const renderMonthSection: ListRenderItem<CalendarMonthSectionData> = ({
    item,
  }) => (
    <CalendarMonthSection
      section={item}
      selectedDate={selectedDate}
      onSelectDate={(date) => {
        onSelectDate(date);
        dismissCalendarSheet(true);
      }}
    />
  );

  if (!isRendered) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isRendered}
      onRequestClose={requestClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={requestClose} />
        <Animated.View
          style={[
            styles.sheet,
            {
              top: topOffset,
              height: sheetHeight,
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.topGlow} />
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text style={[styles.headerTitle, { color: t.colors.text }]}>
              {visibleMonthTitle}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close calendar"
              hitSlop={8}
              onPress={requestClose}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={18} color={t.colors.text} />
            </Pressable>
          </View>
          <View style={styles.weekdayRow}>
            {weekdayLabels.map((label, index) => (
              <Text key={`${label}-${index}`} style={styles.weekdayLabel}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.scrollArea}>
            <FlatList
              data={monthSections}
              keyExtractor={(item) => item.key}
              renderItem={renderMonthSection}
              initialScrollIndex={initialMonthIndex}
              getItemLayout={(_, index) => ({
                length: CALENDAR_MONTH_SECTION_HEIGHT,
                offset: CALENDAR_MONTH_SECTION_HEIGHT * index,
                index,
              })}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              initialNumToRender={4}
              maxToRenderPerBatch={6}
              windowSize={7}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              style={styles.list}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(13, 13, 13, 0.28)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#f4f4f4",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    elevation: 8,
    overflow: "hidden",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
    borderTopColor: "#e2e2e2",
    borderLeftColor: "#e2e2e2",
    borderRightColor: "#e2e2e2",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 0,
  },
  topGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 104,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 42,
    marginBottom: 10,
  },
  headerSpacer: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
    letterSpacing: -0.85,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ececec",
    borderWidth: 1,
    borderColor: "#dfdfdf",
    marginTop: 2,
    marginRight: 2,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "700",
    color: "#8a8a8a",
    letterSpacing: 1.5,
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
