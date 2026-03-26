/**
 * Swipeable library card for one recording item.
 */
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Easing, Pressable, Text, View, type GestureResponderEvent } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { RecordingTagBadge } from "@/components/ovio/RecordingTagBadge";
import { styles } from "@/components/ovio/styles";
import type { RecordingTag } from "@/components/ovio/types";
import { ovioColors } from "@/design/tokens/colors";

// Renders one recording row and keeps its local swipe/favorite UI state.
export function RecordingCard({
  tag,
  title,
  time,
  duration,
  onDelete,
  onPress,
  onRequestSwipeStart,
  onRequestWillOpenSwipeable,
  onRequestOpenSwipeable,
  onRequestCloseOpenSwipeable,
  onSwipeableClosed,
}: {
  tag: RecordingTag;
  title: string;
  time: string;
  duration: string;
  onDelete?: () => void | Promise<void>;
  onPress?: () => void;
  onRequestSwipeStart?: (swipeable: Swipeable | null) => void;
  onRequestWillOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onRequestOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onRequestCloseOpenSwipeable?: (swipeable: Swipeable | null) => void;
  onSwipeableClosed?: (swipeable: Swipeable | null) => void;
}) {
  // Holds the swipe row instance so the parent screen can coordinate open rows.
  const swipeableRef = useRef<Swipeable | null>(null);
  // Used only to tint the card while the swipe actions are open.
  const [isSwipedOpen, setIsSwipedOpen] = useState(false);
  // Local favorite state only changes this card's icon.
  const [isFavorited, setIsFavorited] = useState(false);
  // Converts the time string into the label shown under the title.
  const durationParts = duration.split(":").map((value) => parseInt(value, 10) || 0);
  const durationLabel = formatDurationLabel(durationParts);

  // Closes the swipe row and resets the active style.
  const closeSwipe = () => {
    swipeableRef.current?.close();
    setIsSwipedOpen(false);
  };

  // Keeps the favorite action simple and local to this card.
  const toggleFavorite = () => {
    setIsFavorited((currentValue) => !currentValue);
  };

  // These are the buttons revealed when the user swipes left.
  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <Pressable
        style={styles.swipeActionButtonDelete}
        onPress={() => {
          closeSwipe();
          void onDelete?.();
        }}
      >
        <Ionicons name="trash-outline" size={18} color={ovioColors.white} />
      </Pressable>
      <Pressable
        style={styles.swipeActionButton}
        onPress={() => {
          toggleFavorite();
          closeSwipe();
        }}
      >
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={18}
          color={isFavorited ? "#ff5a5f" : "#f7f7f7"}
        />
      </Pressable>
      <Pressable style={styles.swipeActionButton} onPress={closeSwipe}>
        <Ionicons name="share-outline" size={18} color="#f7f7f7" />
      </Pressable>
    </View>
  );

  // Tell the parent screen when this row starts opening or finishes closing.
  // Tapping the row asks the screen to close any different row that is still open.
  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      rightThreshold={44}
      friction={1.35}
      useNativeAnimations
      animationOptions={{
        duration: 115,
        easing: Easing.out(Easing.quad),
      }}
      onSwipeableOpenStartDrag={() => {
        onRequestSwipeStart?.(swipeableRef.current);
      }}
      onSwipeableWillOpen={() => {
        onRequestWillOpenSwipeable?.(swipeableRef.current);
      }}
      onSwipeableOpen={() => {
        setIsSwipedOpen(true);
        onRequestOpenSwipeable?.(swipeableRef.current);
      }}
      onSwipeableClose={() => {
        setIsSwipedOpen(false);
        onSwipeableClosed?.(swipeableRef.current);
      }}
    >
      <Pressable
        style={[styles.recordCard, isSwipedOpen && styles.recordCardActive]}
        onPress={(_event: GestureResponderEvent) => {
          onRequestCloseOpenSwipeable?.(swipeableRef.current);
          onPress?.();
        }}
      >
        <View style={styles.recordContent}>
          <View style={styles.recordTitleRow}>
            <Text style={styles.recordTitle} numberOfLines={1}>
              {title}
            </Text>
            <RecordingTagBadge tag={tag} />
          </View>
          <View style={styles.recordMetaRow}>
            <Text style={styles.recordMeta} numberOfLines={1}>
              {time} {durationLabel}
            </Text>
            {isFavorited ? (
              <View style={styles.recordLikeIndicator}>
                <Ionicons name="heart" size={12} color="#ff6a00" />
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
}

function formatDurationLabel(durationParts: number[]) {
  if (durationParts.length === 3) {
    const [hours, minutes, seconds] = durationParts;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  }

  const [minutes = 0, seconds = 0] = durationParts;
  return `${minutes}m ${seconds}s`;
}
