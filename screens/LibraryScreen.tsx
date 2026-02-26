import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { OvioScreenShell, RecordingCard, type ScreenTab } from "@/screens/ovio-ui";

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
    { weekday: "M", day: 23 },
    { weekday: "T", day: 24 },
    { weekday: "W", day: 25 },
    { weekday: "T", day: 26 },
    { weekday: "F", day: 27 },
    { weekday: "S", day: 28 },
    { weekday: "S", day: 29 },
  ];
  const [selectedDay, setSelectedDay] = useState(23);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <OvioScreenShell
      activeTab="library"
      subtitle="BIBLIOTHEK"
      onTabPress={onTabPress}
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
      <View style={styles.timelineRow}>
        {days.map((entry) => {
          const isSelected = selectedDay === entry.day;

          return (
            <Pressable
              key={`${entry.weekday}-${entry.day}`}
              style={isSelected ? styles.activeDateTile : styles.inactiveDateTile}
              onPress={() => setSelectedDay(entry.day)}
            >
              <Text
                style={
                  isSelected
                    ? styles.activeDateWeekday
                    : styles.inactiveDateWeekday
                }
              >
                {entry.weekday}
              </Text>
              <Text
                style={
                  isSelected ? styles.activeDateNumber : styles.inactiveDateNumber
                }
              >
                {entry.day}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionLabel}>AUDIO CAPTURED</Text>
        <Text style={styles.sectionMeta}>8 ITEMS</Text>
      </View>
      <RecordingCard
        tag="WORK"
        title="MEETING NOTES: PROJECT X"
        time="09:30"
        duration="05:24"
      />
      <RecordingCard
        tag="MUSIC"
        title="GUITAR PRACTICE_SESSION"
        time="14:10"
        duration="18:02"
      />
      <RecordingCard
        tag="SLEEP"
        title="NIGHT 01: SOFT SNORING CHECK"
        time="23:42"
        duration="42:18"
      />
      <RecordingCard
        tag="VOICE"
        title="TALKING DETECTED: 02:13 AM"
        time="02:13"
        duration="01:06"
      />
      <RecordingCard
        tag="EVENT"
        title="FART EVENT CLIP: BEDROOM MIC"
        time="03:27"
        duration="00:12"
      />
      <RecordingCard
        tag="SLEEP"
        title="NIGHT 02: HEAVY SNORING BLOCK"
        time="00:58"
        duration="17:40"
      />
      <RecordingCard
        tag="AMBIENT"
        title="ROOM NOISE BASELINE SAMPLE"
        time="01:35"
        duration="08:21"
      />
      <RecordingCard
        tag="VOICE"
        title="MUMBLING SEGMENT: 04:42 AM"
        time="04:42"
        duration="00:48"
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
  pickerLabel: {
    fontSize: 9,
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
  timelineRow: {
    marginBottom: 18,
    backgroundColor: "#f4f4f4",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 6,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 2,
  },
  activeDateTile: {
    width: 38,
    borderRadius: 14,
    backgroundColor: "#060606",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  activeDateWeekday: {
    fontSize: 8,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "#a0a0a0",
  },
  activeDateNumber: {
    marginTop: 2,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.8,
    fontWeight: "900",
    color: "#fff",
  },
  inactiveDateTile: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  inactiveDateWeekday: {
    fontSize: 8,
    letterSpacing: 0.5,
    fontWeight: "700",
    color: "#b0b0b0",
  },
  inactiveDateNumber: {
    marginTop: 2,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.8,
    fontWeight: "800",
    color: "#7e7e7e",
  },
});
