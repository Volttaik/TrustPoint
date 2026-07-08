import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

function Pulse({ style }: { style: any }) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1,   { duration: 700 }),
        withTiming(0.4, { duration: 700 })
      ),
      -1,
      false
    );
  }, []);
  const aStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[style, aStyle]} />;
}

export function PhoneCardSkeleton() {
  const colors = useColors();
  const bg = colors.shimmer;
  return (
    <View style={[sk.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={sk.row}>
        <Pulse style={[sk.logoBox, { backgroundColor: bg }]} />
        <Pulse style={[sk.inputBar, { backgroundColor: bg }]} />
        <Pulse style={[sk.iconBox, { backgroundColor: bg }]} />
      </View>
    </View>
  );
}

export function BeneficiaryStripSkeleton() {
  const colors = useColors();
  const bg = colors.shimmer;
  return (
    <View style={sk.stripRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[sk.benefChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pulse style={[sk.circle, { backgroundColor: bg }]} />
          <Pulse style={[sk.bar, { width: 50, backgroundColor: bg }]} />
          <Pulse style={[sk.bar, { width: 40, backgroundColor: bg }]} />
        </View>
      ))}
    </View>
  );
}

export function PlanCardSkeleton() {
  const colors = useColors();
  const bg = colors.shimmer;
  return (
    <View style={sk.planGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[sk.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Pulse style={[sk.planSize, { backgroundColor: bg }]} />
          <Pulse style={[sk.planPrice, { backgroundColor: bg }]} />
          <Pulse style={[sk.planVal, { backgroundColor: bg }]} />
          <Pulse style={[sk.planDesc, { backgroundColor: bg }]} />
        </View>
      ))}
    </View>
  );
}

const sk = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBox:  { width: 36, height: 36, borderRadius: 8 },
  inputBar: { flex: 1, height: 24, borderRadius: 8 },
  iconBox:  { width: 36, height: 36, borderRadius: 10 },
  stripRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
  },
  benefChip: {
    width: 84,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  circle: { width: 44, height: 44, borderRadius: 22 },
  bar:    { height: 10, borderRadius: 6 },
  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 20,
  },
  planCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  planSize:  { height: 22, width: "70%", borderRadius: 6 },
  planPrice: { height: 16, width: "50%", borderRadius: 6 },
  planVal:   { height: 11, width: "60%", borderRadius: 6 },
  planDesc:  { height: 10, width: "80%", borderRadius: 6 },
});
