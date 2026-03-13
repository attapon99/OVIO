import type { ComponentProps } from "react";

import type { SettingRow } from "@/screens/ovio-ui";

type SettingsRowItem = Pick<ComponentProps<typeof SettingRow>, "label" | "value" | "toggle">;

export type SettingsSection = {
  title: string;
  rows: SettingsRowItem[];
};

export const settingsStats = [
  { id: "total-hours", label: "TOTAL HOURS", value: "124.5" },
  { id: "events-captured", label: "EVENTS CAPTURED", value: "892" },
] as const;

export const settingsSections: SettingsSection[] = [
  {
    title: "CAPTURE_PARAMETERS",
    rows: [
      { label: "SENSITIVITY THRESHOLD", value: "HIGH FIDELITY" },
      { label: "VOICE DETECTION", toggle: true },
      { label: "SNORING ANALYSIS", toggle: true },
      { label: "FART DETECTION", toggle: true },
    ],
  },
  {
    title: "SYSTEM_PREFERENCES",
    rows: [
      { label: "NOTIFICATIONS", toggle: true },
      { label: "DARK MODE", toggle: true },
      { label: "STORAGE USED", value: "12 GB USED" },
      { label: "EXPORT RECORDINGS", value: "EXPORT" },
      { label: "PRIVACY", value: "SETTINGS" },
    ],
  },
];
