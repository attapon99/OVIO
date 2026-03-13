/**
 * Small section heading used between OVIO content blocks.
 */
import { Text } from "react-native";

import { styles } from "@/components/ovio/styles";

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}
