/**
 * Bottom tab bar for switching between the three OVIO screens.
 */
import { Pressable, Text, View } from "react-native";

import { styles } from "@/components/ovio/styles";
import type { ScreenTab } from "@/components/ovio/types";

export function OvioBottomNav({
  activeTab,
  onTabPress,
}: {
  activeTab: ScreenTab;
  onTabPress: (tab: ScreenTab) => void;
}) {
  const isLibrary = activeTab === "library";
  const isRecording = activeTab === "recording";
  const isSettings = activeTab === "settings";

  return (
    <View style={styles.bottomNav}>
      <Pressable
        style={isRecording ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("recording")}
      >
        <Text style={isRecording ? styles.navIconActive : styles.navIcon}>
          REC
        </Text>
      </Pressable>
      <Pressable
        style={isLibrary ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("library")}
      >
        <Text style={isLibrary ? styles.navIconActive : styles.navIcon}>
          LIB
        </Text>
      </Pressable>
      <Pressable
        style={isSettings ? styles.navButtonActive : styles.navButton}
        onPress={() => onTabPress("settings")}
      >
        <Text style={isSettings ? styles.navIconActive : styles.navIcon}>
          SET
        </Text>
      </Pressable>
    </View>
  );
}
