import { useEffect, useState } from "react";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LibraryScreen from "./screens/LibraryScreen";
import RecordingScreen from "./screens/RecordingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import type { ScreenTab } from "./screens/ovio-ui";
import type { RecordingMetadata } from "./utils/local-recordings";

const PLAYBACK_END_TOLERANCE_SECONDS = 0.25;
const SEEK_INTERVAL_SECONDS = 5;

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>("library");
  const [selectedRecording, setSelectedRecording] = useState<RecordingMetadata | null>(null);
  const [shouldAutoplaySelection, setShouldAutoplaySelection] = useState(false);
  const player = useAudioPlayer(selectedRecording?.uri ?? null);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: false,
    });
  }, []);

  useEffect(() => {
    if (!selectedRecording || !shouldAutoplaySelection || !playerStatus.isLoaded) {
      return;
    }

    player.play();
    setShouldAutoplaySelection(false);
  }, [player, playerStatus.isLoaded, selectedRecording, shouldAutoplaySelection]);

  const handleSelectRecording = async (
    recording: RecordingMetadata,
    options?: { autoplay?: boolean }
  ) => {
    const shouldAutoplay = Boolean(options?.autoplay);

    if (selectedRecording?.id === recording.id) {
      if (shouldAutoplay) {
        if (playerStatus.isLoaded) {
          await player.seekTo(0);
          player.play();
        } else {
          setShouldAutoplaySelection(true);
        }
      }

      setSelectedRecording(recording);
      return;
    }

    setSelectedRecording(recording);
    setShouldAutoplaySelection(shouldAutoplay);
  };

  const handleTogglePlayback = async () => {
    if (!selectedRecording) {
      return;
    }

    if (playerStatus.playing) {
      player.pause();
      return;
    }

    if (hasPlaybackEnded(playerStatus)) {
      await player.seekTo(0);
    }

    player.play();
  };

  const handleSeekBy = async (seconds: number) => {
    if (!selectedRecording) {
      return;
    }

    const durationSeconds = getPlaybackDurationSeconds(selectedRecording, playerStatus);

    if (durationSeconds <= 0) {
      return;
    }

    const nextTime = clamp(playerStatus.currentTime + seconds, 0, durationSeconds);
    await player.seekTo(nextTime);
  };

  const handleSeekToProgress = async (progress: number) => {
    if (!selectedRecording) {
      return;
    }

    const durationSeconds = getPlaybackDurationSeconds(selectedRecording, playerStatus);

    if (durationSeconds <= 0) {
      return;
    }

    const nextTime = clamp(progress, 0, 1) * durationSeconds;
    await player.seekTo(nextTime);
  };

  let content = (
    <LibraryScreen
      onTabPress={setActiveTab}
      currentTrack={selectedRecording}
      isMiniPlayerPlaying={playerStatus.playing}
      playerCurrentTimeSeconds={playerStatus.currentTime}
      playerDurationSeconds={getPlaybackDurationSeconds(selectedRecording, playerStatus)}
      onSelectRecording={handleSelectRecording}
      onToggleMiniPlayerPlayback={handleTogglePlayback}
      onSeekBackward={() => void handleSeekBy(-SEEK_INTERVAL_SECONDS)}
      onSeekForward={() => void handleSeekBy(SEEK_INTERVAL_SECONDS)}
      onSeekToProgress={(progress) => void handleSeekToProgress(progress)}
    />
  );

  if (activeTab === "recording") {
    content = <RecordingScreen onTabPress={setActiveTab} />;
  }

  if (activeTab === "settings") {
    content = <SettingsScreen onTabPress={setActiveTab} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>{content}</SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function hasPlaybackEnded(playerStatus: ReturnType<typeof useAudioPlayerStatus>) {
  if (playerStatus.didJustFinish) {
    return true;
  }

  if (playerStatus.duration <= 0) {
    return false;
  }

  return playerStatus.currentTime >= playerStatus.duration - PLAYBACK_END_TOLERANCE_SECONDS;
}

function getPlaybackDurationSeconds(
  selectedRecording: RecordingMetadata | null,
  playerStatus: ReturnType<typeof useAudioPlayerStatus>
) {
  if (playerStatus.duration > 0) {
    return playerStatus.duration;
  }

  return selectedRecording ? selectedRecording.durationMillis / 1000 : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
