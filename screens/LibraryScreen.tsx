import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CalendarModal } from "@/components/CalendarModal";
import { TimelineDateRow } from "@/components/TimelineDateRow";
import { OvioScreenShell, RecordingCard, type ScreenTab } from "@/screens/ovio-ui";
import { WeekStrip } from "@/components/WeekStrip";
import {
  addDays,
  createLocalDate,
} from "@/utils/date";
import Swipeable from "react-native-gesture-handler/Swipeable";

const SWIPE_ACTIONS_WIDTH = 182;

export default function LibraryScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  const [selectedDate, setSelectedDate] = useState(() =>
    createLocalDate(2023, 9, 23)
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const openSwipeableRef = useRef<Swipeable | null>(null);
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);

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
      <CalendarModal
        visible={isCalendarOpen}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={handleSelectDate}
      />

      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>AUDIO CAPTURED</Text>
        <Text style={styles.sectionMeta}>8 ITEMS</Text>
      </View>
      <RecordingCard
        tag="WORK"
        title="MEETING NOTES: PROJECT X"
        time="09:30"
        duration="05:24"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="MUSIC"
        title="GUITAR PRACTICE_SESSION"
        time="14:10"
        duration="18:02"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="SLEEP"
        title="NIGHT 01: SOFT SNORING CHECK"
        time="23:42"
        duration="42:18"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="VOICE"
        title="TALKING DETECTED: 02:13 AM"
        time="02:13"
        duration="01:06"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="EVENT"
        title="FART EVENT CLIP: BEDROOM MIC"
        time="03:27"
        duration="00:12"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="SLEEP"
        title="NIGHT 02: HEAVY SNORING BLOCK"
        time="00:58"
        duration="17:40"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="AMBIENT"
        title="ROOM NOISE BASELINE SAMPLE"
        time="01:35"
        duration="08:21"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
      <RecordingCard
        tag="VOICE"
        title="MUMBLING SEGMENT: 04:42 AM"
        time="04:42"
        duration="00:48"
        onRequestSwipeStart={handleRequestCloseOpenSwipeable}
        onRequestWillOpenSwipeable={handleRequestOpenSwipeable}
        onRequestOpenSwipeable={handleRequestOpenSwipeable}
        onRequestCloseOpenSwipeable={handleRequestCloseOpenSwipeable}
        onSwipeableClosed={handleSwipeableClosed}
      />
    </OvioScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: "#8a8a8a",
  },
  sectionHead: {
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionMeta: {
    fontSize: 10,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: "#909090",
  },
  swipeDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    right: SWIPE_ACTIONS_WIDTH,
  },
});
