/**
 * Compact mock waveform shown inside the mini player while playback is active.
 */
import { View } from "react-native";

import { styles } from "@/components/ovio/styles";

const MOCK_BAR_HEIGHTS = [6, 10, 14, 18, 13, 8, 12, 17, 11, 7] as const;

// Keeps the mini player waveform simple and presentational for now.
export function AudioActivityBars() {
  return (
    <View
      style={styles.miniPlayerWaveform}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {MOCK_BAR_HEIGHTS.map((height, index) => (
        <View
          key={`${height}-${index}`}
          style={[
            styles.miniPlayerWaveformBar,
            { height, opacity: index % 3 === 0 ? 0.92 : 0.58 },
          ]}
        />
      ))}
    </View>
  );
}
