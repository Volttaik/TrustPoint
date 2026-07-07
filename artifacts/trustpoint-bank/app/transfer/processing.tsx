import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

export default function ProcessingScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const topPad  = insets.top + (Platform.OS === "web" ? 67 : 0);

  const {
    beneficiaryId, accountNumber, amount, total, narration,
  } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    amount:   string;
    total:    string;
    narration?: string;
  }>();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const step1    = useRef(new Animated.Value(0)).current;
  const step2    = useRef(new Animated.Value(0)).current;
  const step3    = useRef(new Animated.Value(0)).current;

  const numTotal = parseFloat(total ?? amount ?? "0") || 0;

  useEffect(() => {
    /* Spinning arc — runs indefinitely while mounted */
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1, duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    /* Step ticks — staggered; keep handles for cleanup */
    const t1 = setTimeout(() =>
      Animated.spring(step1, { toValue: 1, useNativeDriver: true, friction: 5, tension: 90 }).start(),
      500);
    const t2 = setTimeout(() =>
      Animated.spring(step2, { toValue: 1, useNativeDriver: true, friction: 5, tension: 90 }).start(),
      1300);
    const t3 = setTimeout(() =>
      Animated.spring(step3, { toValue: 1, useNativeDriver: true, friction: 5, tension: 90 }).start(),
      2100);

    /* Navigate to success once all steps done */
    const nav = setTimeout(() => {
      router.replace({
        pathname: "/transfer/success",
        params: {
          ...(beneficiaryId ? { beneficiaryId } : {}),
          ...(accountNumber ? { accountNumber } : {}),
          amount, total, narration,
        },
      });
    }, 2900);

    return () => {
      spinLoop.stop();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(nav);
    };
  }, []);

  const spinRotate = spinAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const SIZE = 92;
  const R    = 38;
  const C    = SIZE / 2;
  const circ = 2 * Math.PI * R;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#08090A" ? "light" : "dark"} />

      <View style={[styles.content, { paddingTop: topPad + 72 }]}>

        {/* ── Spinner ───────────────────────────────────── */}
        <View style={styles.spinnerWrap}>
          <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              {/* track */}
              <Circle
                cx={C} cy={C} r={R}
                stroke={colors.border}
                strokeWidth={4.5}
                fill="none"
              />
              {/* arc */}
              <Circle
                cx={C} cy={C} r={R}
                stroke={colors.primary}
                strokeWidth={4.5}
                fill="none"
                strokeDasharray={`${circ * 0.68} ${circ * 0.32}`}
                strokeLinecap="round"
                rotation={-90}
                origin={`${C},${C}`}
              />
            </Svg>
          </Animated.View>
        </View>

        {/* ── Labels ───────────────────────────────────── */}
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Processing transfer
        </Text>
        <Text style={[styles.amountText, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
          ₦{numTotal.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Please don't close this screen
        </Text>

        {/* ── Steps card ───────────────────────────────── */}
        <View style={[
          styles.stepsCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}>
          <StepRow label="PIN verified"           anim={step1} colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <StepRow label="Authorizing transfer"   anim={step2} colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <StepRow label="Completing transaction" anim={step3} colors={colors} />
        </View>

      </View>
    </View>
  );
}

/* ── Step row ──────────────────────────────────────────────── */
function StepRow({
  label, anim, colors,
}: {
  label: string;
  anim: Animated.Value;
  colors: any;
}) {
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  return (
    <Animated.View style={[styles.stepRow, { opacity }]}>
      <Text style={[
        styles.stepLabel,
        { color: colors.text, fontFamily: "Inter_400Regular" },
      ]}>
        {label}
      </Text>
      <Animated.View style={[
        styles.stepCheck,
        { backgroundColor: colors.success, transform: [{ scale: anim }] },
      ]}>
        <Text style={styles.checkMark}>✓</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  content:     { flex: 1, alignItems: "center", paddingHorizontal: 28, gap: 12 },
  spinnerWrap: { marginBottom: 8 },
  title:       { fontSize: 22, letterSpacing: -0.6, marginTop: 4 },
  amountText:  { fontSize: 42, letterSpacing: -1.5 },
  sub:         { fontSize: 13 },
  stepsCard: {
    width: "100%", borderRadius: 18, borderWidth: 1,
    marginTop: 28, overflow: "hidden",
  },
  stepRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 17,
  },
  stepLabel: { fontSize: 15 },
  stepCheck: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  checkMark: { color: "#fff", fontSize: 12 },
  sep:       { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },
});
