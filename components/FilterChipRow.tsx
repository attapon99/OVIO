import { memo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/design/theme";

export type LibraryFilterChip = "All" | "Fart" | "Voice" | "Snore";

const CHIP_LABELS: readonly LibraryFilterChip[] = ["All", "Fart", "Voice", "Snore"];

export const FilterChipRow = memo(function FilterChipRow({
  selectedChip,
  onSelectChip,
}: {
  selectedChip: LibraryFilterChip;
  onSelectChip: (chip: LibraryFilterChip) => void;
}) {
  const t = useAppTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {CHIP_LABELS.map((chip) => {
          const isSelected = chip === selectedChip;

          return (
            <Pressable
              key={chip}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelectChip(chip)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected ? t.colors.text : t.colors.surface,
                  borderColor: isSelected ? t.colors.text : "#dddddd",
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  {
                    color: isSelected ? t.colors.textInverted : t.colors.textMuted,
                  },
                ]}
              >
                {chip}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
  content: {
    gap: 10,
    paddingRight: 2,
  },
  chip: {
    minHeight: 28,
    paddingHorizontal: 10,
    borderRadius: 25,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  chipLabel: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "700",
    letterSpacing: -0.15,
  },
});
