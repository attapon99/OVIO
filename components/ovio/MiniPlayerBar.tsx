/**
 * Floating mini player shown above the bottom navigation.
 */
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image, Pressable, Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";
import { ovioColors } from "@/design/tokens/colors";

// Shows the current mock track without changing screen layout.
export function MiniPlayerBar({
  title,
  subtitle,
  artwork,
  bottomOffset,
}: {
  title: string;
  subtitle?: string;
  artwork: number;
  bottomOffset: number;
}) {
  return (
    <View style={[styles.miniPlayerWrap, { bottom: bottomOffset }]}>
      <BlurView intensity={55} tint="light" style={styles.miniPlayerBlur}>
        <Image source={artwork} style={styles.miniPlayerArtwork} />
        <View style={styles.miniPlayerTextWrap}>
          <Text style={styles.miniPlayerTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.miniPlayerSubtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Pressable style={styles.miniPlayerButton} accessibilityRole="button">
          <Ionicons name="play" size={18} color={ovioColors.textStrong} />
        </Pressable>
      </BlurView>
    </View>
  );
}
