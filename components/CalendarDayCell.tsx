import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/design/theme";

export function CalendarDayCell({
  dayNumber,
  isCurrentMonth,
  isSelected,
  onPress,
}: {
  dayNumber: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  onPress: () => void;
}) {
  const t = useAppTheme();

  return (
    <Pressable
      accessibilityRole={isCurrentMonth ? "button" : undefined}
      accessibilityLabel={isCurrentMonth ? `Select day ${dayNumber}` : undefined}
      disabled={!isCurrentMonth}
      onPress={onPress}
      style={styles.pressable}
    >
      {isCurrentMonth ? (
        <View style={[styles.circle, isSelected && styles.selectedCircle]}>
          <Text
            style={[
              styles.label,
              { color: t.colors.text },
              isSelected && styles.selectedLabel,
            ]}
          >
            {dayNumber}
          </Text>
        </View>
      ) : (
        <View style={styles.emptySlot} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  selectedCircle: {
    backgroundColor: "#0d0d0d",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },
  emptySlot: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
  },
  selectedLabel: {
    color: "#ffffff",
    fontWeight: "800",
  },
});
