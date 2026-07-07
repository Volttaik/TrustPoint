import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 750 }),
        withTiming(0.4, { duration: 750 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.shimmer,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  const colors = useColors();
  return (
    <View style={[{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 }, style]}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="70%" height={14} />
          <Skeleton width="45%" height={12} />
        </View>
      </View>
      <Skeleton height={12} />
      <Skeleton width="80%" height={12} />
    </View>
  );
}

export function SkeletonTransactionItem() {
  return (
    <View style={styles.txRow}>
      <Skeleton width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, gap: 7 }}>
        <Skeleton width="60%" height={13} />
        <Skeleton width="40%" height={11} />
      </View>
      <Skeleton width={64} height={14} />
    </View>
  );
}

export function SkeletonDashboard() {
  const colors = useColors();
  return (
    <View style={{ gap: 20, paddingHorizontal: 20 }}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={{ flex: 1, gap: 8 }}>
          <Skeleton width="40%" height={12} />
          <Skeleton width="55%" height={18} />
        </View>
        <Skeleton width={80} height={36} borderRadius={18} />
      </View>
      <Skeleton height={160} borderRadius={20} />
      <View style={styles.quickRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ alignItems: "center", gap: 8 }}>
            <Skeleton width={52} height={52} borderRadius={26} />
            <Skeleton width={40} height={10} />
          </View>
        ))}
      </View>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <View style={{ gap: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonTransactionItem key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  quickRow: { flexDirection: "row", justifyContent: "space-around" },
  txRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 4 },
});
