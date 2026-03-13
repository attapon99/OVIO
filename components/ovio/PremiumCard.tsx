/**
 * Premium status card shown in the account section.
 */
import { Pressable, Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";

// Displays the mock premium plan summary card.
export function PremiumCard() {
  return (
    <Pressable style={styles.premiumCard}>
      <Text style={styles.premiumTitle}>OVIO_PREMIUM</Text>
      <Text style={styles.premiumSubtitle}>ACTIVE UNTIL OCT 2024</Text>
      <View style={styles.premiumButton}>
        <Text style={styles.premiumButtonText}>MANAGE_PLAN</Text>
      </View>
      <View style={styles.premiumOrb} />
    </Pressable>
  );
}
