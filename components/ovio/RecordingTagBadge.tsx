/**
 * Small badge used to show a recording tag in OVIO.
 */
import { Text, View } from "react-native";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { styles } from "@/components/ovio/styles";
import type { RecordingTag } from "@/components/ovio/types";

// Keeps the tag badge consistent anywhere a recording tag is shown.
export function RecordingTagBadge({
  tag,
  containerStyle,
  textStyle,
}: {
  tag: RecordingTag;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={[styles.soundTypeBadge, containerStyle]}>
      <Text style={[styles.soundTypeText, textStyle]} numberOfLines={1}>
        {tag.toUpperCase()}
      </Text>
    </View>
  );
}
