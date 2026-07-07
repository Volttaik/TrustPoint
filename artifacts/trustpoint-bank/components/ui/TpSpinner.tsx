/**
 * TpSpinner — concentric multi-ring spinner built with Reanimated.
 *
 * Sizes
 *   "small"  (36px) — single arc, used in Button loading state
 *   "medium" (64px) — dual ring, used for inline / card loading
 *   "large" (120px) — triple ring, used for full-screen processing & login
 *
 * All rings spin at the same speeds as the transfer processing screen:
 *   outer 1400 ms CW  ·  mid 2100 ms CCW  ·  inner 900 ms CW
 */
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { useColors } from "@/hooks/useColors";

export type TpSpinnerSize = "small" | "medium" | "large";

interface TpSpinnerProps {
  size?:  TpSpinnerSize;
  color?: string; // override primary colour
}

const CONFIGS: Record<
  TpSpinnerSize,
  {
    sz: number;
    rings: { r: number; fill: number; sw: number; dir: 1 | -1; ms: number }[];
  }
> = {
  /* single arc — subtle, fits inside a button */
  small: {
    sz: 36,
    rings: [
      { r: 14, fill: 0.68, sw: 2.5, dir:  1, ms: 900 },
    ],
  },
  /* dual ring — inline card / section loading */
  medium: {
    sz: 64,
    rings: [
      { r: 27, fill: 0.68, sw: 3,   dir:  1, ms: 1400 },
      { r: 17, fill: 0.45, sw: 2.5, dir: -1, ms: 900  },
    ],
  },
  /* triple ring — full-screen & login modal */
  large: {
    sz: 120,
    rings: [
      { r: 52, fill: 0.70, sw: 4,   dir:  1, ms: 1400 },
      { r: 37, fill: 0.50, sw: 3.5, dir: -1, ms: 2100 },
      { r: 22, fill: 0.40, sw: 3,   dir:  1, ms: 900  },
    ],
  },
};

const ALPHA = ["FF", "AA", "DD"]; // outer, mid, inner opacity suffix

export function TpSpinner({ size = "medium", color }: TpSpinnerProps) {
  const colors  = useColors();
  const primary = color ?? colors.primary;
  const cfg     = CONFIGS[size];
  const CX      = cfg.sz / 2;
  const arc     = (r: number) => 2 * Math.PI * r;

  /* one SharedValue per ring */
  const r0 = useSharedValue(0);
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);
  const rots = [r0, r1, r2];

  useEffect(() => {
    const linCfg = (ms: number) => ({ duration: ms, easing: Easing.linear });

    cfg.rings.forEach((ring, i) => {
      const target = ring.dir * 360;
      rots[i].value = withRepeat(withTiming(target, linCfg(ring.ms)), -1, false);
    });
  }, [size]);

  const style0 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r0.value}deg` }] }));
  const style1 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r1.value}deg` }] }));
  const style2 = useAnimatedStyle(() => ({ transform: [{ rotate: `${r2.value}deg` }] }));
  const ringStyles = [style0, style1, style2];

  return (
    <View style={{ width: cfg.sz, height: cfg.sz }}>
      {cfg.rings.map((ring, i) => (
        <Animated.View key={i} style={[StyleSheet.absoluteFill, ringStyles[i]]}>
          <Svg
            width={cfg.sz}
            height={cfg.sz}
            viewBox={`0 0 ${cfg.sz} ${cfg.sz}`}
          >
            {/* Track */}
            <Circle
              cx={CX} cy={CX} r={ring.r}
              stroke={colors.border}
              strokeWidth={ring.sw}
              fill="none"
            />
            {/* Arc */}
            <Circle
              cx={CX} cy={CX} r={ring.r}
              stroke={`${primary}${ALPHA[i] ?? "FF"}`}
              strokeWidth={ring.sw}
              fill="none"
              strokeDasharray={`${arc(ring.r) * ring.fill} ${arc(ring.r) * (1 - ring.fill)}`}
              strokeLinecap="round"
              rotation={-90}
              origin={`${CX},${CX}`}
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
