/**
 * Floating mini player shown above the bottom navigation.
 */
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Pressable, Text, View } from "react-native";

import { AudioActivityBars } from "@/components/ovio/AudioActivityBars";
import { RecordingTagBadge } from "@/components/ovio/RecordingTagBadge";
import { styles } from "@/components/ovio/styles";
import type { RecordingTag } from "@/components/ovio/types";
import { ovioColors } from "@/design/tokens/colors";

// Shows the current mock track without changing screen layout.
export function MiniPlayerBar({
  tag,
  title,
  subtitle,
  artwork,
  isPlaying,
  bottomOffset,
}: {
  tag: RecordingTag;
  title: string;
  subtitle?: string;
  artwork?: number;
  isPlaying: boolean;
  bottomOffset: number;
}) {
  return (
    <View style={[styles.miniPlayerWrap, { bottom: bottomOffset }]}>
      <BlurView intensity={55} tint="light" style={styles.miniPlayerBlur}>
        <View style={styles.miniPlayerContentRow}>
          <View style={styles.miniPlayerTextBlock}>
            <View style={styles.miniPlayerTitleRow}>
              <Text style={styles.miniPlayerTitle} numberOfLines={1}>
                {title}
              </Text>
              <RecordingTagBadge
                tag={tag}
                containerStyle={styles.miniPlayerTagBadge}
                textStyle={styles.miniPlayerTagText}
              />
            </View>
            {subtitle ? (
              <Text style={styles.miniPlayerSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={styles.miniPlayerRightGroup}>
            {isPlaying ? <AudioActivityBars /> : null}
          </View>
        </View>
        <Pressable style={styles.miniPlayerButton} accessibilityRole="button">
          <Ionicons name="play" size={18} color={ovioColors.textStrong} />
        </Pressable>
      </BlurView>
    </View>
  );
}
