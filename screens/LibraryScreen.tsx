/**
 * Library screen for browsing mock recordings.
 * This file keeps the screen state and swipe coordination logic together.
 */
import { useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CalendarModal } from "@/components/CalendarModal";
import { FilterChipRow, type LibraryFilterChip } from "@/components/FilterChipRow";
import { TimelineDateRow } from "@/components/TimelineDateRow";
import { ovioLayout } from "@/design/tokens/layout";
import {
  libraryInitialSelectedDate,
  libraryRecordingItems,
} from "@/data/library/library-screen-data";
import { OvioScreenShell, RecordingCard, type ScreenTab } from "@/screens/ovio-ui";
import { WeekStrip } from "@/components/WeekStrip";
import { addDays } from "@/utils/date";
import Swipeable from "react-native-gesture-handler/Swipeable";

// This screen owns the library-specific state and interactions.
export default function LibraryScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  // The currently focused day in the timeline and calendar.
  const [selectedDate, setSelectedDate] = useState(() => libraryInitialSelectedDate);
  // Controls whether the calendar sheet is visible.
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Tracks the one swipe row that is currently open.
  const openSwipeableRef = useRef<Swipeable | null>(null);
  // Controls the tap overlay that closes an open swipe row.
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  // Stores the selected filter chip in the library filter bar.
  const [selectedChip, setSelectedChip] = useState<LibraryFilterChip>("All");

  // Keep swipe coordination in the screen so only one row can stay open at a time.
  const closeOpenSwipeable = () => {
    openSwipeableRef.current?.close();
    openSwipeableRef.current = null;
    setIsSwipeOpen(false);
  };

  // When a row opens, close any other open row first.
  const handleRequestOpenSwipeable = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }

    openSwipeableRef.current = swipeable;
    setIsSwipeOpen(true);
  };

  // Tapping another row should close the currently open one.
  const handleRequestCloseOpenSwipeable = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  // Reset the screen state after a swipe row fully closes.
  const handleSwipeableClosed = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current === swipeable) {
      openSwipeableRef.current = null;
    }
    setIsSwipeOpen(false);
  };

  // Updates both the timeline and calendar selection.
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Moves the selected date by one week at a time.
  const handleNavigateWeek = (direction: "previous" | "next") => {
    const dayOffset = direction === "next" ? 7 : -7;

    handleSelectDate(addDays(selectedDate, dayOffset));
  };

  // Stores the currently highlighted filter chip.
  const handleSelectChip = (chip: LibraryFilterChip) => {
    setSelectedChip(chip);
  };

  return (
    <OvioScreenShell
      activeTab="library"
      subtitle="BIBLIOTHEK"
      onTabPress={onTabPress}
      onScrollBeginDrag={closeOpenSwipeable}
      onMomentumScrollBegin={closeOpenSwipeable}
      overlay={
        isSwipeOpen ? (
          <Pressable
            style={styles.swipeDismissOverlay}
            onPressIn={closeOpenSwipeable}
          />
        ) : null
      }
    >
      <TimelineDateRow
        selectedDate={selectedDate}
        onCalendarPress={() => setIsCalendarOpen(true)}
      />
      <WeekStrip
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onNavigateWeek={handleNavigateWeek}
      />
      <FilterChipRow selectedChip={selectedChip} onSelectChip={handleSelectChip} />
      <CalendarModal
        visible={isCalendarOpen}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={handleSelectDate}
      />
      {libraryRecordingItems.map((recording) => (
        <RecordingCard
          key={recording.id}
          tag={recording.tag}
          title={recording.title}
          time={recording.time}
          duration={recording.duration}
          onRequestSwipeStart={handleRequestCloseOpenSwipeable}
          onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
          onRequestOpenSwipeable={handleRequestOpenSwipeable}
          onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
          onSwipeableClosed={handleSwipeableClosed}
        />
      ))}
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  // Leaves the swipe action buttons clickable while the overlay covers the rest.
  swipeDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    right: ovioLayout.swipeActionsWidth,
  },
});
