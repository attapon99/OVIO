import { useState } from "react";
import { File } from "expo-file-system";
import {
  RecordingPresets,
  setAudioModeAsync,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import {
  createRecordingTitle,
  ensureRecordingsDirectory,
  getPersistentRecordingFile,
  saveRecordingMetadata,
} from "@/utils/local-recordings";

type StartResult =
  | { ok: true }
  | { ok: false; reason: "permissionMissing" | "microphoneUnavailable" };

type ResumeResult =
  | { ok: true }
  | { ok: false; reason: "microphoneUnavailable" };

type StopResult =
  | { ok: true; uri: string | null; durationMillis: number }
  | { ok: false; reason: "microphoneUnavailable" };

export function useLocalAudioRecorder() {
  const [savedUri, setSavedUri] = useState<string | null>(null);
  const [savedDurationMillis, setSavedDurationMillis] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY, (status) => {
    if (status.hasError) {
      setLastError(status.error ?? "Recording failed");
    }
  });
  const recorderState = useAudioRecorderState(recorder);

  const start = async (): Promise<StartResult> => {
    try {
      setLastError(null);

      const permission = await requestRecordingPermissionsAsync();

      if (!permission.granted) {
        return { ok: false, reason: "permissionMissing" };
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      return { ok: true };
    } catch (error) {
      console.error("Failed to start recording", error);
      setLastError("Failed to start recording");
      return { ok: false, reason: "microphoneUnavailable" };
    }
  };

  const pause = async (): Promise<ResumeResult> => {
    try {
      recorder.pause();
      return { ok: true };
    } catch (error) {
      console.error("Failed to pause recording", error);
      setLastError("Failed to pause recording");
      return { ok: false, reason: "microphoneUnavailable" };
    }
  };

  const resume = async (): Promise<ResumeResult> => {
    try {
      recorder.record();
      return { ok: true };
    } catch (error) {
      console.error("Failed to resume recording", error);
      setLastError("Failed to resume recording");
      return { ok: false, reason: "microphoneUnavailable" };
    }
  };

  const stop = async (): Promise<StopResult> => {
    try {
      await recorder.stop();

      const originalUri = recorder.uri ?? recorderState.url;
      const durationMillis = recorderState.durationMillis;
      const persistentUri = originalUri ? persistRecordingFile(originalUri) : null;

      setSavedUri(persistentUri);
      setSavedDurationMillis(durationMillis);

      console.log("Original recording URI:", originalUri);
      console.log("Persistent recording URI:", persistentUri);

      if (persistentUri) {
        const filename = new File(persistentUri).name;
        const savedEntry = await saveRecordingMetadata({
          uri: persistentUri,
          filename,
          title: createRecordingTitle(filename),
          type: "voice",
          durationMillis,
        });

        console.log("Saved recording metadata:", savedEntry);
      }

      return {
        ok: true,
        uri: persistentUri,
        durationMillis,
      };
    } catch (error) {
      console.error("Failed to stop recording", error);
      setLastError("Failed to stop recording");
      return { ok: false, reason: "microphoneUnavailable" };
    }
  };

  const clearError = () => {
    setLastError(null);
  };

  return {
    clearError,
    lastError,
    pause,
    recorderState,
    resume,
    savedDurationMillis,
    savedUri,
    start,
    stop,
  };
}

function persistRecordingFile(uri: string) {
  ensureRecordingsDirectory();

  const sourceFile = new File(uri);
  const extension = getRecordingExtension(sourceFile);
  const filename = `recording-${new Date().toISOString().replace(/[:.]/g, "-")}${extension}`;
  const destinationFile = getPersistentRecordingFile(filename);

  sourceFile.move(destinationFile);

  return destinationFile.uri;
}

function getRecordingExtension(file: File) {
  return file.extension || ".m4a";
}
