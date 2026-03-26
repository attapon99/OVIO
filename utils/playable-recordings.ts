import type { RecordingMetadata } from "@/utils/local-recordings";

export type PlayableRecording = RecordingMetadata;

export function formatRecordingDurationLabel(durationMillis: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMillis / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

export function formatRecordingClockTime(createdAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

export function formatRecordingDurationTimestamp(durationMillis: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMillis / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  return [minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function formatPlaybackTimeLabel(durationMillis: number) {
  const totalSeconds = Math.max(0, Math.floor(durationMillis / 1000));
  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return [totalMinutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}
