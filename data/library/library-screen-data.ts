/**
 * Static mock data used only by the current library screen.
 * Keep display-only values here so the screen can focus on UI state and interactions.
 */
import { createLocalDate } from "@/utils/date";

// Describes one recording row shown in the library list.
export type LibraryRecordingItem = {
  id: string;
  tag: string;
  title: string;
  time: string;
  duration: string;
};

// This is the first date shown when the library screen opens.
export const libraryInitialSelectedDate = createLocalDate(2023, 9, 23);

// These mock rows are rendered into the swipeable recording list.
export const libraryRecordingItems: LibraryRecordingItem[] = [
  {
    id: "meeting-notes-project-x",
    tag: "WORK",
    title: "MEETING NOTES: PROJECT X",
    time: "09:30",
    duration: "05:24",
  },
  {
    id: "guitar-practice-session",
    tag: "MUSIC",
    title: "GUITAR PRACTICE_SESSION",
    time: "14:10",
    duration: "18:02",
  },
  {
    id: "night-01-soft-snoring-check",
    tag: "SLEEP",
    title: "NIGHT 01: SOFT SNORING CHECK",
    time: "23:42",
    duration: "42:18",
  },
  {
    id: "talking-detected-0213-am",
    tag: "VOICE",
    title: "TALKING DETECTED: 02:13 AM",
    time: "02:13",
    duration: "01:06",
  },
  {
    id: "fart-event-bedroom-mic",
    tag: "EVENT",
    title: "FART EVENT CLIP: BEDROOM MIC",
    time: "03:27",
    duration: "00:12",
  },
  {
    id: "night-02-heavy-snoring-block",
    tag: "SLEEP",
    title: "NIGHT 02: HEAVY SNORING BLOCK",
    time: "00:58",
    duration: "17:40",
  },
  {
    id: "room-noise-baseline-sample",
    tag: "AMBIENT",
    title: "ROOM NOISE BASELINE SAMPLE",
    time: "01:35",
    duration: "08:21",
  },
  {
    id: "mumbling-segment-0442-am",
    tag: "VOICE",
    title: "MUMBLING SEGMENT: 04:42 AM",
    time: "04:42",
    duration: "00:48",
  },
];
