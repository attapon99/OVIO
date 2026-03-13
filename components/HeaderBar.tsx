import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/design/theme";
import { ovioColors } from "@/design/tokens/colors";
import { ovioRadius } from "@/design/tokens/radius";
import { ovioSpacing } from "@/design/tokens/spacing";

type Props = {
  title: string;
  subtitle?: string;
  modeTag?: string;
};

export function HeaderBar({ title, subtitle, modeTag }: Props) {
  const t = useAppTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.titleWrap}>
          <Text style={[styles.title, { color: t.colors.text }]}>{title}</Text>
          {subtitle ? (
            <View style={styles.subtitleRow}>
              <View style={styles.marker} />
              <Text style={[styles.subtitle, { color: t.colors.textMuted }]}>
                {subtitle}
              </Text>
            </View>
          ) : null}
        </View>
        {modeTag ? (
          <View style={styles.modeTag}>
            <Text style={[styles.modeTagText, { color: t.colors.text }]}>
              {modeTag}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleWrap: {
    flex: 1,
  },
  title: {
    textTransform: "uppercase",
    fontSize: 39,
    lineHeight: 42,
    letterSpacing: -1,
    fontWeight: "900",
  },
  subtitle: {
    textTransform: "uppercase",
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2.2,
    fontWeight: "700",
  },
  subtitleRow: {
    marginTop: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: ovioSpacing[10],
  },
  marker: {
    width: 36,
    height: 3,
    backgroundColor: "#141414",
  },
  modeTag: {
    borderRadius: ovioRadius[10],
    paddingHorizontal: ovioSpacing[10],
    paddingVertical: 6,
    backgroundColor: "#efefef",
    borderWidth: 1,
    borderColor: ovioColors.borderSubtle,
  },
  modeTagText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 0.6,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
