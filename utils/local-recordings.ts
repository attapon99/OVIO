import { Directory, File, Paths } from "expo-file-system";
import type { RecordingTag } from "@/components/ovio/types";

export type RecordingMetadata = {
  id: string;
  uri: string;
  filename: string;
  title: string;
  type: RecordingTag;
  durationMillis: number;
  createdAt: string;
};

const recordingsDirectory = new Directory(Paths.document, "recordings");
const recordingsMetadataFile = new File(recordingsDirectory, "metadata.json");

export function ensureRecordingsDirectory() {
  recordingsDirectory.create({ idempotent: true, intermediates: true });
}

export function getPersistentRecordingFile(filename: string) {
  ensureRecordingsDirectory();
  return new File(recordingsDirectory, filename);
}

export async function saveRecordingMetadata({
  uri,
  filename,
  title,
  type,
  durationMillis,
}: {
  uri: string;
  filename: string;
  title: string;
  type: RecordingTag;
  durationMillis: number;
}) {
  ensureRecordingsDirectory();

  const existingEntries = await loadRecordingMetadata();
  const entry: RecordingMetadata = {
    id: createRecordingId(),
    uri,
    filename,
    title,
    type,
    durationMillis,
    createdAt: new Date().toISOString(),
  };

  const nextEntries = [entry, ...existingEntries];

  if (!recordingsMetadataFile.exists) {
    recordingsMetadataFile.create({ intermediates: true });
  }

  recordingsMetadataFile.write(JSON.stringify(nextEntries, null, 2));

  return entry;
}

export async function loadRecordingMetadata() {
  ensureRecordingsDirectory();

  if (!recordingsMetadataFile.exists) {
    return [] as RecordingMetadata[];
  }

  try {
    const content = await recordingsMetadataFile.text();

    if (!content.trim()) {
      return [] as RecordingMetadata[];
    }

    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as RecordingMetadata[];
    }

    return parsed.map(normalizeRecordingMetadata);
  } catch (error) {
    console.error("Failed to load recording metadata", error);
    return [] as RecordingMetadata[];
  }
}

export async function deleteRecordingMetadata(id: string) {
  ensureRecordingsDirectory();

  const existingEntries = await loadRecordingMetadata();
  const entryToDelete = existingEntries.find((entry) => entry.id === id) ?? null;
  const nextEntries = existingEntries.filter((entry) => entry.id !== id);

  if (!recordingsMetadataFile.exists) {
    recordingsMetadataFile.create({ intermediates: true });
  }

  recordingsMetadataFile.write(JSON.stringify(nextEntries, null, 2));

  if (!entryToDelete) {
    return {
      deletedEntry: null,
      remainingEntries: nextEntries,
    };
  }

  if (entryToDelete.uri) {
    try {
      const recordingFile = new File(entryToDelete.uri);

      if (recordingFile.exists) {
        recordingFile.delete();
      }
    } catch (error) {
      console.error(`Failed to delete recording file for ${id}`, error);
    }
  }

  return {
    deletedEntry: entryToDelete,
    remainingEntries: nextEntries,
  };
}

function createRecordingId() {
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createRecordingTitle(filename: string) {
  const nameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
  return nameWithoutExtension.replace(/[-_]+/g, " ").toUpperCase();
}

function normalizeRecordingMetadata(entry: unknown): RecordingMetadata {
  const record = (entry ?? {}) as Partial<RecordingMetadata>;
  const filename = getSafeFilename(record);

  return {
    id: record.id ?? createRecordingId(),
    uri: record.uri ?? "",
    filename,
    title: record.title ?? createRecordingTitle(filename),
    type: record.type ?? "voice",
    durationMillis: record.durationMillis ?? 0,
    createdAt: record.createdAt ?? new Date().toISOString(),
  };
}

function getSafeFilename(record: Partial<RecordingMetadata>) {
  if (record.filename) {
    return record.filename;
  }

  if (record.uri) {
    const uriSegments = record.uri.split("/");
    return uriSegments[uriSegments.length - 1] || "recording";
  }

  return "recording";
}
