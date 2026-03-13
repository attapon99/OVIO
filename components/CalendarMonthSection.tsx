import { StyleSheet, Text, View } from "react-native";

import { CalendarDayCell } from "@/components/CalendarDayCell";
import type { CalendarMonthSection as CalendarMonthSectionData } from "@/utils/date";
import { isSameCalendarDay } from "@/utils/date";

export const CALENDAR_MONTH_SECTION_HEIGHT = 386;

export function CalendarMonthSection({
  section,
  selectedDate,
  onSelectDate,
}: {
  section: CalendarMonthSectionData;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{section.title}</Text>
      <View style={styles.grid}>
        {section.weeks.map((week) => (
          <View key={week[0]?.key} style={styles.weekRow}>
            {week.map((day) => (
              <CalendarDayCell
                key={day.key}
                dayNumber={day.dayNumber}
                isCurrentMonth={day.isCurrentMonth}
                isSelected={
                  day.isCurrentMonth && isSameCalendarDay(day.date, selectedDate)
                }
                onPress={() => onSelectDate(day.date)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    height: CALENDAR_MONTH_SECTION_HEIGHT,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
    color: "#0d0d0d",
    textAlign: "left",
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  grid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: "row",
  },
});
