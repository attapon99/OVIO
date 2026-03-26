import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

import { ovioColors } from "@/design/tokens/colors";
import { ovioRadius } from "@/design/tokens/radius";
import { ovioSpacing } from "@/design/tokens/spacing";
import { OvioScreenShell, type ScreenTab } from "@/screens/ovio-ui";

type RecordingUiState =
  | "idle"
  | "active"
  | "paused"
  | "finished"
  | "permissionMissing"
  | "microphoneUnavailable";

type RecordingStateConfig = {
  title: string;
  topLabel: string;
  badgeLabel: string;
  timer: string;
  supportingText: string;
  eventCount?: string;
  actionLabel: string;
  actionKind: "start" | "pause" | "resume" | "complete" | "resolve";
  secondaryActionLabel?: string;
  secondaryActionKind?: "stop";
  accentLabel?: string;
  panelLabel?: string;
  showPulse: boolean;
  animateWaveform: boolean;
  showWaveform: boolean;
  waveformOpacity: number;
  panelStyle:
    | "neutral"
    | "live"
    | "paused"
    | "finished"
    | "access"
    | "unavailable";
  centerStyle: "timer" | "message";
};

const waveformHeights = [52, 38, 60, 44, 68, 50, 62, 40, 56];
const permissionRecoveryState: RecordingUiState = "idle";
const microphoneRecoveryState: RecordingUiState = "idle";

const recordingStateConfigs: Record<RecordingUiState, RecordingStateConfig> = {
  idle: {
    title: "Ready to Record",
    topLabel: "Ready to Record",
    badgeLabel: "READY",
    timer: "00:00:00",
    supportingText: "Waiting for capture.",
    actionLabel: "START",
    actionKind: "start",
    accentLabel: "Standby",
    panelLabel: "READY",
    showPulse: false,
    animateWaveform: false,
    showWaveform: true,
    waveformOpacity: 0.18,
    panelStyle: "neutral",
    centerStyle: "timer",
  },
  active: {
    title: "Recording Active",
    topLabel: "Recording Active",
    badgeLabel: "LIVE",
    timer: "00:42:18",
    supportingText: "Listening…",
    eventCount: "12 Events",
    actionLabel: "PAUSE",
    actionKind: "pause",
    secondaryActionLabel: "STOP",
    secondaryActionKind: "stop",
    accentLabel: "Live session",
    panelLabel: "Listening…",
    showPulse: true,
    animateWaveform: true,
    showWaveform: true,
    waveformOpacity: 0.72,
    panelStyle: "live",
    centerStyle: "timer",
  },
  paused: {
    title: "Recording Paused",
    topLabel: "Recording Paused",
    badgeLabel: "PAUSED",
    timer: "00:42:18",
    supportingText: "Session on hold.",
    eventCount: "12 Events",
    actionLabel: "RESUME",
    actionKind: "resume",
    secondaryActionLabel: "STOP",
    secondaryActionKind: "stop",
    accentLabel: "Suspended",
    panelLabel: "Paused",
    showPulse: false,
    animateWaveform: false,
    showWaveform: true,
    waveformOpacity: 0.28,
    panelStyle: "paused",
    centerStyle: "timer",
  },
  finished: {
    title: "Recording Finished",
    topLabel: "Recording Finished",
    badgeLabel: "DONE",
    timer: "00:42:18",
    supportingText: "Session captured.",
    eventCount: "12 Events",
    actionLabel: "LIBRARY",
    actionKind: "complete",
    accentLabel: "Captured",
    panelLabel: "Session saved",
    showPulse: false,
    animateWaveform: false,
    showWaveform: true,
    waveformOpacity: 0.22,
    panelStyle: "finished",
    centerStyle: "timer",
  },
  permissionMissing: {
    title: "Microphone Access Required",
    topLabel: "Permission Required",
    badgeLabel: "ACCESS",
    timer: "Microphone",
    supportingText: "Allow microphone access to start recording.",
    actionLabel: "ALLOW",
    actionKind: "resolve",
    accentLabel: "Access needed",
    panelLabel: "Microphone access",
    showPulse: false,
    animateWaveform: false,
    showWaveform: false,
    waveformOpacity: 0,
    panelStyle: "access",
    centerStyle: "message",
  },
  microphoneUnavailable: {
    title: "Microphone Unavailable",
    topLabel: "Microphone Unavailable",
    badgeLabel: "CHECK",
    timer: "Mic Offline",
    supportingText: "Try again when the microphone is available.",
    actionLabel: "RETRY",
    actionKind: "resolve",
    accentLabel: "Unavailable",
    panelLabel: "Microphone unavailable",
    showPulse: false,
    animateWaveform: false,
    showWaveform: false,
    waveformOpacity: 0,
    panelStyle: "unavailable",
    centerStyle: "message",
  },
};

export default function RecordingScreen({
  onTabPress,
}: {
  onTabPress: (tab: ScreenTab) => void;
}) {
  const [currentState, setCurrentState] = useState<RecordingUiState>("idle");
  const pulseAnim = useRef(new Animated.Value(0.72)).current;
  const waveAnims = useRef(waveformHeights.map(() => new Animated.Value(0.45))).current;
  const stateConfig = recordingStateConfigs[currentState];

  useEffect(() => {
    pulseAnim.setValue(stateConfig.showPulse ? 0.72 : 0);
    waveAnims.forEach((anim) => anim.setValue(stateConfig.animateWaveform ? 0.45 : 0.78));

    if (!stateConfig.showPulse && !stateConfig.animateWaveform) {
      return;
    }

    const pulseLoop = stateConfig.showPulse
      ? Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 0.72,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        )
      : null;

    const waveLoops = stateConfig.animateWaveform
      ? waveAnims.map((anim, index) =>
          Animated.loop(
            Animated.sequence([
              Animated.delay(index * 110),
              Animated.timing(anim, {
                toValue: 1,
                duration: 900,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0.45,
                duration: 1100,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
              }),
            ])
          )
        )
      : [];

    pulseLoop?.start();
    waveLoops.forEach((loop) => loop.start());

    return () => {
      pulseLoop?.stop();
      waveLoops.forEach((loop) => loop.stop());
    };
  }, [pulseAnim, stateConfig, waveAnims]);

  const handlePrimaryAction = () => {
    switch (currentState) {
      case "idle":
        setCurrentState("active");
        return;
      case "active":
        setCurrentState("paused");
        return;
      case "paused":
        setCurrentState("active");
        return;
      case "finished":
        setCurrentState("idle");
        onTabPress("library");
        return;
      case "permissionMissing":
        setCurrentState(permissionRecoveryState);
        return;
      case "microphoneUnavailable":
        setCurrentState(microphoneRecoveryState);
        return;
    }
  };

  const handleSecondaryAction = () => {
    if (currentState === "active" || currentState === "paused") {
      setCurrentState("finished");
    }
  };

  const renderCard = (stateKey: RecordingUiState) => {
    const config = recordingStateConfigs[stateKey];
    const isMessageState =
      stateKey === "permissionMissing" || stateKey === "microphoneUnavailable";
    const cardTitleStyle = [styles.timerText, isMessageState ? styles.messageTitle : null];

    return (
      <View
        key={stateKey}
        style={styles.heroCard}
      >
        <View style={styles.heroTop}>
          <View style={styles.liveTitleRow}>
            {config.showPulse && stateKey === currentState ? (
              <Animated.View
                style={[
                  styles.livePulse,
                  {
                    opacity: pulseAnim,
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
            ) : config.showPulse ? (
              <View style={[styles.livePulse, styles.livePulseStatic]} />
            ) : null}
            <Text style={styles.eyebrow}>{config.topLabel}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>{config.badgeLabel}</Text>
          </View>
        </View>

        <View style={styles.heroCenter}>
          <View style={getCenterMarkerStyle(config.panelStyle)}>
            {renderStateMarker(config.panelStyle)}
          </View>
          {config.accentLabel ? (
            <Text style={styles.centerAccentLabel}>{config.accentLabel}</Text>
          ) : null}
          <Text style={styles.heroTitle}>{config.title}</Text>
          <Text style={cardTitleStyle}>{config.timer}</Text>
          <Text style={styles.heroSubtitle}>{config.supportingText}</Text>
          {config.eventCount ? <Text style={styles.eventCount}>{config.eventCount}</Text> : null}
        </View>

        <View style={[styles.previewPanel, getPanelStyle(config.panelStyle)]}>
          {config.showWaveform ? (
            <>
              <View style={styles.previewBars}>
                {waveformHeights.map((height, index) => {
                  const barStyle = [
                    styles.previewBar,
                    {
                      height,
                      opacity: config.waveformOpacity,
                    },
                  ];

                  if (config.animateWaveform && stateKey === currentState) {
                    return (
                      <Animated.View
                        key={`${stateKey}-${height}-${index}`}
                        style={[
                          barStyle,
                          {
                            transform: [
                              {
                                scaleY: waveAnims[index].interpolate({
                                  inputRange: [0.45, 1],
                                  outputRange: [0.82, 1.04],
                                }),
                              },
                            ],
                          },
                          config.panelStyle === "paused" ? styles.previewBarPaused : null,
                          config.panelStyle === "finished" ? styles.previewBarFinished : null,
                        ]}
                      />
                    );
                  }

                  return (
                    <View
                      key={`${stateKey}-${height}-${index}`}
                      style={[
                        barStyle,
                        config.panelStyle === "paused" ? styles.previewBarPaused : null,
                        config.panelStyle === "finished" ? styles.previewBarFinished : null,
                      ]}
                    />
                  );
                })}
              </View>
              <View style={styles.previewDivider} />
            </>
          ) : (
            <View style={styles.stateInfoPanel}>
              <View style={[styles.stateInfoIconWrap, getStateInfoIconWrapStyle(config.panelStyle)]}>
                {renderStateInfoIcon(config.panelStyle)}
              </View>
              <Text style={styles.stateInfoLabel}>{config.panelLabel}</Text>
            </View>
          )}

          <View style={styles.previewFooter}>
            <Pressable
              style={[
                styles.primaryButton,
                config.actionKind === "resolve" ? styles.primaryButtonQuiet : null,
              ]}
              onPress={handlePrimaryAction}
            >
              <View
                style={[
                  styles.primaryButtonInner,
                  config.actionKind === "resolve" ? styles.primaryButtonInnerQuiet : null,
                ]}
              >
                <View
                  style={[
                    styles.primaryGlyph,
                    config.actionKind === "start" ? styles.startGlyph : null,
                    config.actionKind === "pause" ? styles.pauseGlyph : null,
                    config.actionKind === "resume" ? styles.resumeGlyph : null,
                    config.actionKind === "complete" ? styles.completeGlyph : null,
                    config.actionKind === "resolve" ? styles.resolveGlyph : null,
                  ]}
                />
              </View>
            </Pressable>
            <Text style={styles.previewMeta}>{config.actionLabel}</Text>
            {config.secondaryActionLabel ? (
              <Pressable style={styles.secondaryAction} onPress={handleSecondaryAction}>
                <Text style={styles.secondaryActionText}>{config.secondaryActionLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <OvioScreenShell activeTab="recording" subtitle="RECORD" onTabPress={onTabPress}>
      {renderCard(currentState)}
    </OvioScreenShell>
  );
}

function getPanelStyle(panelStyle: RecordingStateConfig["panelStyle"]) {
  switch (panelStyle) {
    case "live":
      return styles.previewPanelLive;
    case "paused":
      return styles.previewPanelPaused;
    case "finished":
      return styles.previewPanelFinished;
    case "access":
      return styles.previewPanelAccess;
    case "unavailable":
      return styles.previewPanelUnavailable;
    default:
      return styles.previewPanelNeutral;
  }
}

function getCenterMarkerStyle(panelStyle: RecordingStateConfig["panelStyle"]) {
  switch (panelStyle) {
    case "live":
      return [styles.centerMarker, styles.centerMarkerLive];
    case "paused":
      return [styles.centerMarker, styles.centerMarkerPaused];
    case "finished":
      return [styles.centerMarker, styles.centerMarkerFinished];
    case "access":
      return [styles.centerMarker, styles.centerMarkerAccess];
    case "unavailable":
      return [styles.centerMarker, styles.centerMarkerUnavailable];
    default:
      return [styles.centerMarker, styles.centerMarkerNeutral];
  }
}

function getStateInfoIconWrapStyle(panelStyle: RecordingStateConfig["panelStyle"]) {
  switch (panelStyle) {
    case "access":
      return styles.stateInfoIconAccess;
    case "unavailable":
      return styles.stateInfoIconUnavailable;
    default:
      return null;
  }
}

function renderStateMarker(panelStyle: RecordingStateConfig["panelStyle"]) {
  if (panelStyle === "paused") {
    return (
      <View style={styles.markerPausedWrap}>
        <View style={styles.markerPausedBar} />
        <View style={styles.markerPausedBar} />
      </View>
    );
  }

  if (panelStyle === "finished") {
    return <View style={styles.markerFinished} />;
  }

  if (panelStyle === "access") {
    return <View style={styles.markerAccess} />;
  }

  if (panelStyle === "unavailable") {
    return <View style={styles.markerUnavailable} />;
  }

  return <View style={styles.markerNeutral} />;
}

function renderStateInfoIcon(panelStyle: RecordingStateConfig["panelStyle"]) {
  if (panelStyle === "access") {
    return <View style={styles.stateInfoAccessGlyph} />;
  }

  return <View style={styles.stateInfoUnavailableGlyph} />;
}

const styles = StyleSheet.create({
  heroCard: {
    marginTop: 10,
    minHeight: 520,
    backgroundColor: ovioColors.backgroundCard,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: ovioColors.borderStandard,
    padding: 22,
    justifyContent: "space-between",
    shadowColor: ovioColors.shadowBase,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  liveTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 18,
  },
  livePulse: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: ovioColors.black,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: 2.2,
    fontWeight: "800",
    color: ovioColors.textMutedSoft,
  },
  statusPill: {
    minHeight: 30,
    paddingHorizontal: ovioSpacing[12],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: ovioColors.borderSoft,
    backgroundColor: ovioColors.backgroundSurface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 10,
    letterSpacing: 1.1,
    fontWeight: "800",
    color: "#5f5f5f",
  },
  heroCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 42,
  },
  centerMarker: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  centerMarkerNeutral: {
    backgroundColor: "#f0f0f0",
    borderColor: ovioColors.borderSoft,
  },
  centerMarkerLive: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  centerMarkerPaused: {
    backgroundColor: "#ededed",
    borderColor: "#d9d9d9",
  },
  centerMarkerFinished: {
    backgroundColor: "#111111",
    borderColor: "#111111",
  },
  centerMarkerAccess: {
    backgroundColor: "#f1f1f1",
    borderColor: "#dadada",
  },
  centerMarkerUnavailable: {
    backgroundColor: "#ebebeb",
    borderColor: "#d5d5d5",
  },
  markerNeutral: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#101010",
  },
  markerPausedWrap: {
    flexDirection: "row",
    gap: 5,
  },
  markerPausedBar: {
    width: 5,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#2a2a2a",
  },
  markerFinished: {
    width: 18,
    height: 10,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: ovioColors.white,
    transform: [{ rotate: "-45deg" }],
    marginTop: -2,
  },
  markerAccess: {
    width: 18,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#191919",
    backgroundColor: "transparent",
  },
  markerUnavailable: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#1d1d1d",
    transform: [{ rotate: "-35deg" }],
  },
  centerAccentLabel: {
    marginBottom: 8,
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 2,
    fontWeight: "800",
    color: ovioColors.textMutedSoft,
    textTransform: "uppercase",
  },
  heroTitle: {
    marginBottom: 16,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: -0.5,
    fontWeight: "800",
    color: ovioColors.textStrong,
    textAlign: "center",
  },
  timerText: {
    fontSize: 54,
    lineHeight: 54,
    letterSpacing: -2.4,
    fontWeight: "900",
    color: ovioColors.textPrimary,
    textAlign: "center",
  },
  messageTitle: {
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.4,
  },
  heroSubtitle: {
    marginTop: 14,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
    fontWeight: "600",
    color: ovioColors.textMuted,
    textAlign: "center",
    maxWidth: 250,
  },
  eventCount: {
    marginTop: 22,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.1,
    fontWeight: "800",
    color: ovioColors.textStrong,
    textAlign: "center",
  },
  previewPanel: {
    borderRadius: ovioRadius[24],
    backgroundColor: "#efefef",
    borderWidth: 1,
    borderColor: ovioColors.borderSoft,
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 16,
  },
  previewPanelNeutral: {
    backgroundColor: "#efefef",
  },
  previewPanelLive: {
    backgroundColor: "#ededed",
  },
  previewPanelPaused: {
    backgroundColor: "#f1f1f1",
    borderStyle: "dashed",
  },
  previewPanelFinished: {
    backgroundColor: "#f3f3f3",
  },
  previewPanelAccess: {
    backgroundColor: "#f2f2f2",
  },
  previewPanelUnavailable: {
    backgroundColor: "#ececec",
  },
  previewBars: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: ovioSpacing[12],
    overflow: "hidden",
  },
  previewBar: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: ovioColors.black,
  },
  previewBarPaused: {
    borderWidth: 1,
    borderColor: "rgba(17, 17, 17, 0.08)",
  },
  previewBarFinished: {
    borderWidth: 1,
    borderColor: "rgba(17, 17, 17, 0.12)",
  },
  previewDivider: {
    height: 1,
    backgroundColor: "#dddddd",
    marginTop: 18,
  },
  stateInfoPanel: {
    minHeight: 96,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  stateInfoIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    backgroundColor: "#f7f7f7",
  },
  stateInfoIconAccess: {
    backgroundColor: "#f6f6f6",
  },
  stateInfoIconUnavailable: {
    backgroundColor: "#eeeeee",
  },
  stateInfoAccessGlyph: {
    width: 16,
    height: 12,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  stateInfoUnavailableGlyph: {
    width: 18,
    height: 2,
    borderRadius: 999,
    backgroundColor: "#1a1a1a",
    transform: [{ rotate: "-32deg" }],
  },
  stateInfoLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    fontWeight: "700",
    color: ovioColors.textMutedDim,
    textAlign: "center",
  },
  previewFooter: {
    marginTop: 12,
    alignItems: "center",
    gap: 14,
  },
  primaryButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: ovioColors.black,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ovioColors.shadowBase,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primaryButtonQuiet: {
    backgroundColor: "#2a2a2a",
  },
  primaryButtonInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "#151515",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonInnerQuiet: {
    backgroundColor: "#333333",
  },
  primaryGlyph: {
    backgroundColor: ovioColors.white,
  },
  startGlyph: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: ovioColors.white,
    marginLeft: 4,
  },
  pauseGlyph: {
    width: 18,
    height: 18,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderColor: ovioColors.white,
    backgroundColor: "transparent",
  },
  resumeGlyph: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderLeftWidth: 20,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: ovioColors.white,
    marginLeft: 4,
  },
  completeGlyph: {
    width: 22,
    height: 22,
    borderRadius: 5,
    transform: [{ rotate: "45deg" }],
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: ovioColors.white,
    backgroundColor: "transparent",
  },
  resolveGlyph: {
    width: 22,
    height: 4,
    borderRadius: 999,
  },
  previewMeta: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: "800",
    color: ovioColors.textMutedDim,
  },
  secondaryAction: {
    minHeight: 28,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryActionText: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: "800",
    color: ovioColors.textMutedDim,
  },
  livePulseStatic: {
    opacity: 0.72,
    transform: [{ scale: 1 }],
  },
});
