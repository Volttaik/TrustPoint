import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { TpIcon } from "@/components/TpIcon";
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

  const numTotal = parseFloat(total ?? amount ?? "0") || 0;

  /* ── Ring rotations ──────────────────────────────────── */
  const rot1 = useSharedValue(0); // outer — clockwise, slow
  const rot2 = useSharedValue(0); // mid   — counter-clockwise, medium
  const rot3 = useSharedValue(0); // inner — clockwise, fast

  /* ── Step animations ─────────────────────────────────── */
  const step1Scale   = useSharedValue(0);
  const step2Scale   = useSharedValue(0);
  const step3Scale   = useSharedValue(0);
  const step1Opacity = useSharedValue(0.25);
  const step2Opacity = useSharedValue(0.25);
  const step3Opacity = useSharedValue(0.25);

  useEffect(() => {
    /* Spinning rings — continuous loops at different speeds & directions */
    const linearCfg = (duration: number) => ({
      duration,
      easing: Easing.linear,
    });

    rot1.value = withRepeat(withTiming(360,  linearCfg(1400)), -1, false);
    rot2.value = withRepeat(withTiming(-360, linearCfg(2100)), -1, false);
    rot3.value = withRepeat(withTiming(360,  linearCfg(900)),  -1, false);

    /* Step ticks — spring in with staggered delay */
    const spring = { damping: 14, stiffness: 180 };

    step1Scale.value   = withDelay(400,  withSpring(1, spring));
    step1Opacity.value = withDelay(400,  withTiming(1, { duration: 200 }));

    step2Scale.value   = withDelay(1200, withSpring(1, spring));
    step2Opacity.value = withDelay(1200, withTiming(1, { duration: 200 }));

    step3Scale.value   = withDelay(2000, withSpring(1, spring));
    step3Opacity.value = withDelay(2000, withTiming(1, { duration: 200 }));

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

    return () => clearTimeout(nav);
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot1.value}deg` }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot2.value}deg` }],
  }));
  const ring3Style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot3.value}deg` }],
  }));

  /* ── SVG ring specs ──────────────────────────────────── */
  const SZ  = 120;
  const CX  = SZ / 2;
  const arc = (r: number) => 2 * Math.PI * r;

  const OUTER = { r: 52, fill: 0.70, sw: 4   };
  const MID   = { r: 37, fill: 0.50, sw: 3.5 };
  const INNER = { r: 22, fill: 0.40, sw: 3   };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#08090A" ? "light" : "dark"} />

      <View style={[styles.content, { paddingTop: topPad + 72 }]}>

        {/* ── Premium multi-ring spinner ─────────────────── */}
        <View style={styles.spinnerWrap}>

          {/* Outer ring — slow clockwise */}
          <Animated.View style={[StyleSheet.absoluteFill, ring1Style]}>
            <Svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
              <Circle cx={CX} cy={CX} r={OUTER.r} stroke={colors.border} strokeWidth={OUTER.sw} fill="none" />
              <Circle
                cx={CX} cy={CX} r={OUTER.r}
                stroke={colors.primary}
                strokeWidth={OUTER.sw}
                fill="none"
                strokeDasharray={`${arc(OUTER.r) * OUTER.fill} ${arc(OUTER.r) * (1 - OUTER.fill)}`}
                strokeLinecap="round"
                rotation={-90}
                origin={`${CX},${CX}`}
              />
            </Svg>
          </Animated.View>

          {/* Mid ring — medium counter-clockwise */}
          <Animated.View style={[StyleSheet.absoluteFill, ring2Style]}>
            <Svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
              <Circle cx={CX} cy={CX} r={MID.r} stroke={colors.border} strokeWidth={MID.sw} fill="none" />
              <Circle
                cx={CX} cy={CX} r={MID.r}
                stroke={colors.primary + "AA"}
                strokeWidth={MID.sw}
                fill="none"
                strokeDasharray={`${arc(MID.r) * MID.fill} ${arc(MID.r) * (1 - MID.fill)}`}
                strokeLinecap="round"
                rotation={-90}
                origin={`${CX},${CX}`}
              />
            </Svg>
          </Animated.View>

          {/* Inner ring — fast clockwise */}
          <Animated.View style={[StyleSheet.absoluteFill, ring3Style]}>
            <Svg width={SZ} height={SZ} viewBox={`0 0 ${SZ} ${SZ}`}>
              <Circle cx={CX} cy={CX} r={INNER.r} stroke="transparent" strokeWidth={INNER.sw} fill="none" />
              <Circle
                cx={CX} cy={CX} r={INNER.r}
                stroke={colors.primary + "DD"}
                strokeWidth={INNER.sw}
                fill="none"
                strokeDasharray={`${arc(INNER.r) * INNER.fill} ${arc(INNER.r) * (1 - INNER.fill)}`}
                strokeLinecap="round"
                rotation={-90}
                origin={`${CX},${CX}`}
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
        <View style={[styles.stepsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <StepRow
            label="PIN verified"
            scaleAnim={step1Scale}
            opacityAnim={step1Opacity}
            colors={colors}
          />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <StepRow
            label="Authorizing transfer"
            scaleAnim={step2Scale}
            opacityAnim={step2Opacity}
            colors={colors}
          />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <StepRow
            label="Completing transaction"
            scaleAnim={step3Scale}
            opacityAnim={step3Opacity}
            colors={colors}
          />
        </View>

      </View>
    </View>
  );
}

/* ── Step row ──────────────────────────────────────────────── */
function StepRow({
  label, scaleAnim, opacityAnim, colors,
}: {
  label: string;
  scaleAnim: SharedValue<number>;
  opacityAnim: SharedValue<number>;
  colors: any;
}) {
  const rowStyle   = useAnimatedStyle(() => ({ opacity: opacityAnim.value }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <Animated.View style={[styles.stepRow, rowStyle]}>
      <Text style={[styles.stepLabel, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      <Animated.View style={[styles.stepCheck, { backgroundColor: colors.success }, checkStyle]}>
        <TpIcon name="check" size={13} color="#fff" strokeWidth={2.5} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  content:     { flex: 1, alignItems: "center", paddingHorizontal: 28, gap: 12 },

  spinnerWrap: { width: 120, height: 120, marginBottom: 8 },

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
  sep: { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },
});
