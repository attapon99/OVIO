import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OvioScreenShell, RecordingCard, type ScreenTab } from "@/screens/ovio-ui";
import { WeekStrip } from "@/components/WeekStrip";
import Swipeable from "react-native-gesture-handler/Swipeable";

const SWIPE_ACTIONS_WIDTH = 182;

export default function LibraryScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const years = [2022, 2023, 2024, 2025];
  const days = [
    { key: "m-23", label: "M", day: 23 },
    { key: "t-24", label: "T", day: 24 },
    { key: "w-25", label: "W", day: 25 },
    { key: "t-26", label: "T", day: 26 },
    { key: "f-27", label: "F", day: 27 },
    { key: "s-28", label: "S", day: 28 },
    { key: "s-29", label: "S", day: 29 },
  ];
  const [activeDayKey, setActiveDayKey] = useState(days[0].key);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [pickerOpen, setPickerOpen] = useState(false);
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

  const handleSelectDay = (dayKey: string) => {
    setActiveDayKey(dayKey);
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
      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>TIMELINE RANGE</Text>
        <Pressable
          style={styles.monthChip}
          onPress={() => setPickerOpen((open) => !open)}
        >
          <Text style={styles.sectionMeta}>
            {months[selectedMonthIndex]} {selectedYear}
          </Text>
        </Pressable>
      </View>
      {pickerOpen ? (
        <View style={styles.pickerPanel}>
          <Text style={styles.pickerLabel}>SELECT MONTH</Text>
          <View style={styles.monthGrid}>
            {months.map((month, index) => {
              const isActive = selectedMonthIndex === index;
              return (
                <Pressable
                  key={month}
                  style={isActive ? styles.activePickerCell : styles.pickerCell}
                  onPress={() => setSelectedMonthIndex(index)}
                >
                  <Text
                    style={
                      isActive ? styles.activePickerText : styles.pickerCellText
                    }
                  >
                    {month}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.pickerLabel}>SELECT YEAR</Text>
          <View style={styles.yearRow}>
            {years.map((year) => {
              const isActive = selectedYear === year;
              return (
                <Pressable
                  key={year}
                  style={isActive ? styles.activePickerCell : styles.pickerCell}
                  onPress={() => setSelectedYear(year)}
                >
                  <Text
                    style={
                      isActive ? styles.activePickerText : styles.pickerCellText
                    }
                  >
                    {year}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
      <WeekStrip
        days={days}
        activeKey={activeDayKey}
        onSelect={handleSelectDay}
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
  sectionHead: {
    marginTop: 2,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: "#8a8a8a",
  },
  sectionMeta: {
    fontSize: 10,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: "#909090",
  },
  monthChip: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "#efefef",
  },
  pickerPanel: {
    backgroundColor: "#f4f4f4",
    borderRadius: 14,
    padding: 10,
    marginTop: -2,
    marginBottom: 10,
    gap: 8,
  },
  swipeDismissOverlay: {
    ...StyleSheet.absoluteFillObject,
    right: SWIPE_ACTIONS_WIDTH,
  },
  pickerLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: "800",
    color: "#878787",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  yearRow: {
    flexDirection: "row",
    gap: 6,
  },
  pickerCell: {
    borderRadius: 10,
    backgroundColor: "#ebebeb",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  activePickerCell: {
    borderRadius: 10,
    backgroundColor: "#070707",
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  pickerCellText: {
    fontSize: 10,
    letterSpacing: 0.6,
    fontWeight: "700",
    color: "#717171",
  },
  activePickerText: {
    fontSize: 10,
    letterSpacing: 0.6,
    fontWeight: "800",
    color: "#fff",
  },
});
