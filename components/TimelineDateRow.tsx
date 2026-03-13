import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/design/theme";
import { ovioColors } from "@/design/tokens/colors";
import { ovioRadius } from "@/design/tokens/radius";
import { ovioSpacing } from "@/design/tokens/spacing";
import { formatTimelineDate } from "@/utils/date";

export function TimelineDateRow({
  selectedDate,
  onCalendarPress,
  style,
}: {
  selectedDate: Date;
  onCalendarPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.dateBlock}>
        <Text style={[styles.dateLabel, { color: t.colors.text }]} numberOfLines={1}>
          {formatTimelineDate(selectedDate)}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open calendar"
        hitSlop={8}
        onPress={onCalendarPress}
        style={({ pressed }) => [
          styles.calendarButton,
          {
            backgroundColor: pressed ? "#e9e9e9" : t.colors.surface,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={18} color={t.colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: ovioSpacing[14],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: ovioSpacing[14],
  },
  dateBlock: {
    flex: 1,
    gap: 4,
  },
  kicker: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "800",
    letterSpacing: 1.7,
    color: "#8b8d96",
  },
  dateLabel: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
  calendarButton: {
    width: 36,
    height: 36,
    borderRadius: ovioRadius[12],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ovioColors.shadowBase,
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#dedede",
  },
});
