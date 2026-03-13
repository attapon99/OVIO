import { ovioColors } from "@/design/tokens/colors";

export function useAppTheme() {
  return {
    colors: {
      surface: ovioColors.backgroundSurface,
      text: ovioColors.textPrimary,
      textMuted: ovioColors.textMuted,
      textInverted: ovioColors.white,
      transparent: "transparent",
      rangeTrack: "#474750",
      selectionFill: ovioColors.white,
    },
  };
}
