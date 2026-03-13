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

export default function LibraryScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(() => libraryInitialSelectedDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const openSwipeableRef = useRef<Swipeable | null>(null);
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const [selectedChip, setSelectedChip] = useState<LibraryFilterChip>("All");

  // Keep swipe coordination in the screen so only one row can stay open at a time.
  const closeOpenSwipeable = () => {
    openSwipeableRef.current?.close();
    openSwipeableRef.current = null;
    setIsSwipeOpen(false);
  };

  const handleRequestOpenSwipeable = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
    }

    openSwipeableRef.current = swipeable;
    setIsSwipeOpen(true);
  };

  const handleRequestCloseOpenSwipeable = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeable) {
      openSwipeableRef.current.close();
      openSwipeableRef.current = null;
    }
  };

  const handleSwipeableClosed = (swipeable: Swipeable | null) => {
    if (openSwipeableRef.current === swipeable) {
      openSwipeableRef.current = null;
    }
    setIsSwipeOpen(false);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNavigateWeek = (direction: "previous" | "next") => {
    const dayOffset = direction === "next" ? 7 : -7;

    handleSelectDate(addDays(selectedDate, dayOffset));
  };

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
  swipeDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    right: ovioLayout.swipeActionsWidth,
  },
});
