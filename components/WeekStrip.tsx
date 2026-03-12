import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/design/theme";
import type { WeekStripProps } from "@/design/types";

export function WeekStrip({ days, activeKey, onSelect }: WeekStripProps) {
  const t = useAppTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: t.colors.surface }]}>
      {days.map((day) => {
        const active = day.key === activeKey;

        return (
          <Pressable
            key={day.key}
            style={[
              styles.day,
              {
                backgroundColor: active ? t.colors.text : t.colors.transparent,
              },
            ]}
            onPress={() => onSelect?.(day.key)}
          >
            <Text
              style={[
                styles.label,
                { color: active ? t.colors.textInverted : t.colors.textMuted },
              ]}
            >
              {day.label}
            </Text>
            <Text
              style={[
                styles.number,
                { color: active ? t.colors.textInverted : t.colors.text },
              ]}
            >
              {day.day}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 30,
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
  },
  day: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 8,
    minHeight: 66,
    justifyContent: "center",
  },
  label: {
    textTransform: "uppercase",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
  },
  number: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "800",
  },
});
