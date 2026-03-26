/**
 * Library screen for browsing locally saved recordings.
 * This file keeps the screen state and swipe coordination logic together.
 */
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CalendarModal } from "@/components/CalendarModal";
import { FilterChipRow, type LibraryFilterChip } from "@/components/FilterChipRow";
import { TimelineDateRow } from "@/components/TimelineDateRow";
import { ovioLayout } from "@/design/tokens/layout";
import { OvioScreenShell, RecordingCard, type ScreenTab } from "@/screens/ovio-ui";
import { WeekStrip } from "@/components/WeekStrip";
import { addDays, createLocalDate, isSameCalendarDay } from "@/utils/date";
import {
  deleteRecordingMetadata,
  loadRecordingMetadata,
  type RecordingMetadata,
} from "@/utils/local-recordings";
import {
  formatRecordingClockTime,
  formatRecordingDurationTimestamp,
  type PlayableRecording,
} from "@/utils/playable-recordings";
import Swipeable from "react-native-gesture-handler/Swipeable";

// This screen owns the library-specific state and interactions.
export default function LibraryScreen({
  onTabPress,
  currentTrack,
  isMiniPlayerPlaying,
  playerCurrentTimeSeconds,
  playerDurationSeconds,
  onSelectRecording,
  onToggleMiniPlayerPlayback,
  onSeekBackward,
  onSeekForward,
  onSeekToProgress,
}: {
  onTabPress: (tab: ScreenTab) => void;
  currentTrack?: PlayableRecording | null;
  isMiniPlayerPlaying?: boolean;
  playerCurrentTimeSeconds: number;
  playerDurationSeconds: number;
  onSelectRecording: (recording: RecordingMetadata, options?: { autoplay?: boolean }) => void;
  onToggleMiniPlayerPlayback: () => void;
  onSeekBackward: () => void;
  onSeekForward: () => void;
  onSeekToProgress: (progress: number) => void;
}) {
  const today = getToday();
  // The currently focused day in the timeline and calendar.
  const [selectedDate, setSelectedDate] = useState(() => today);
  // Controls whether the calendar sheet is visible.
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Tracks the one swipe row that is currently open.
  const openSwipeableRef = useRef<Swipeable | null>(null);
  // Controls the tap overlay that closes an open swipe row.
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  // Stores the selected filter chip in the library filter bar.
  const [selectedChip, setSelectedChip] = useState<LibraryFilterChip>("All");
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadRecordings = async () => {
      const savedRecordings = await loadRecordingMetadata();

      if (isMounted) {
        setRecordings(savedRecordings);

        if (savedRecordings.length > 0) {
          setSelectedDate(getDateFromCreatedAt(savedRecordings[0].createdAt));
        }
      }
    };

    void loadRecordings();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleDeleteRecording = async (id: string) => {
    try {
      const { remainingEntries } = await deleteRecordingMetadata(id);
      closeOpenSwipeable();
      setRecordings(remainingEntries);
    } catch (error) {
      console.error(`Failed to delete recording ${id}`, error);
    }
  };

  const visibleRecordings = recordings.filter((recording) =>
    isSameCalendarDay(getDateFromCreatedAt(recording.createdAt), selectedDate)
  );
  const currentTrackIndex = currentTrack
    ? visibleRecordings.findIndex((recording) => recording.id === currentTrack.id)
    : -1;
  const hasPreviousTrack = currentTrackIndex > 0;
  const hasNextTrack =
    currentTrackIndex >= 0 && currentTrackIndex < visibleRecordings.length - 1;

  const handleSelectPreviousTrack = () => {
    if (!hasPreviousTrack) {
      return;
    }

    const previousRecording = visibleRecordings[currentTrackIndex - 1];
    onSelectRecording(previousRecording, { autoplay: Boolean(isMiniPlayerPlaying) });
  };

  const handleSelectNextTrack = () => {
    if (!hasNextTrack) {
      return;
    }

    const nextRecording = visibleRecordings[currentTrackIndex + 1];
    onSelectRecording(nextRecording, { autoplay: Boolean(isMiniPlayerPlaying) });
  };

  return (
    <OvioScreenShell
      activeTab="library"
      subtitle="BIBLIOTHEK"
      onTabPress={onTabPress}
      currentTrack={currentTrack}
      isMiniPlayerPlaying={isMiniPlayerPlaying}
      playbackCurrentTimeSeconds={playerCurrentTimeSeconds}
      playbackDurationSeconds={playerDurationSeconds}
      onToggleMiniPlayerPlayback={onToggleMiniPlayerPlayback}
      onSeekBackward={onSeekBackward}
      onSeekForward={onSeekForward}
      onSeekToProgress={onSeekToProgress}
      onPreviousTrack={handleSelectPreviousTrack}
      onNextTrack={handleSelectNextTrack}
      hasPreviousTrack={hasPreviousTrack}
      hasNextTrack={hasNextTrack}
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
      {visibleRecordings.map((recording) => (
        <RecordingCard
          key={recording.id}
          tag={recording.type}
          title={recording.title}
          time={formatRecordingClockTime(recording.createdAt)}
          duration={formatRecordingDurationTimestamp(recording.durationMillis)}
          onPress={() => void onSelectRecording(recording, { autoplay: true })}
          onDelete={() => handleDeleteRecording(recording.id)}
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

function getDateFromCreatedAt(createdAt: string) {
  const date = new Date(createdAt);
  return createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
}

function getToday() {
  const now = new Date();
  return createLocalDate(now.getFullYear(), now.getMonth(), now.getDate());
}
