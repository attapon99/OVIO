/**
 * Static mock data used by the current settings screen.
 * Keep section content here so the screen file stays easy to scan.
 */
import type { ComponentProps } from "react";

import type { SettingRow } from "@/screens/ovio-ui";

// Describes one settings row rendered by the shared SettingRow component.
type SettingsRowItem = Pick<ComponentProps<typeof SettingRow>, "label" | "value" | "toggle">;

// Describes one labeled group of settings rows.
export type SettingsSection = {
  title: string;
  rows: SettingsRowItem[];
};

// These stats fill the small summary cards at the top of the settings screen.
export const settingsStats = [
  { id: "total-hours", label: "TOTAL HOURS", value: "124.5" },
  { id: "events-captured", label: "EVENTS CAPTURED", value: "892" },
] as const;

// These section groups are mapped into the shared settings row UI.
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
