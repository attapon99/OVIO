/**
 * Compact stats card for the settings summary area.
 */
import { Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";

// Shows one small summary metric in the settings screen.
export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}
