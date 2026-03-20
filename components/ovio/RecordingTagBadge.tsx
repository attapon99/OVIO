/**
 * Small badge used to show a recording tag in OVIO.
 */
import { Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";
import type { RecordingTag } from "@/components/ovio/types";

// Keeps the tag badge consistent anywhere a recording tag is shown.
export function RecordingTagBadge({ tag }: { tag: RecordingTag }) {
  return (
    <View style={styles.soundTypeBadge}>
      <Text style={styles.soundTypeText} numberOfLines={1}>
        {tag.toUpperCase()}
      </Text>
    </View>
  );
}
