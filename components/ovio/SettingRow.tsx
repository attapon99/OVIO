/**
 * Settings row with either a value label or a static toggle preview.
 */
import { Pressable, Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";

// Shows one settings line in the shared OVIO settings style.
export function SettingRow({
  label,
  value,
  toggle,
}: {
  label: string;
  value?: string;
  toggle?: boolean;
}) {
  return (
    <Pressable style={styles.rowCard}>
      <Text style={styles.rowLabel}>{label}</Text>
      {toggle ? (
        <View style={styles.toggleTrack}>
          <View style={styles.toggleThumb} />
        </View>
      ) : (
        <Text style={styles.rowValue}>{value} &gt;</Text>
      )}
    </Pressable>
  );
}
