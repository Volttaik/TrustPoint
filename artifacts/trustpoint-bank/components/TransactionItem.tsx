import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Avatar } from "@/components/Avatar";
import { useColors } from "@/hooks/useColors";
import { Transaction } from "@/context/AppContext";

interface TransactionItemProps {
  tx: Transaction;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TransactionItem({ tx, onPress }: TransactionItemProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  }, []);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  }, []);

  const amountColor =
    tx.status === "failed" ? colors.destructive :
    tx.type === "credit" ? colors.success : colors.text;

  const amountPrefix = tx.type === "credit" ? "+" : "-";

  const formatAmount = (n: number) =>
    `${amountPrefix}₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD === 1) return "Yesterday";
    return date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  };

  const statusColor =
    tx.status === "success" ? colors.success :
    tx.status === "pending" ? colors.warning : colors.destructive;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[aStyle, styles.row]}
    >
      <Avatar initials={tx.title.split(" ").map((w) => w[0]).join("").slice(0, 2)} color={tx.avatarColor} size={48} />
      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
          {tx.title}
        </Text>
        <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
          {tx.subtitle} · {formatDate(tx.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor, fontFamily: "Inter_600SemiBold" }]}>
          {formatAmount(tx.amount)}
        </Text>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  center: { flex: 1, gap: 3 },
  title: { fontSize: 15, letterSpacing: -0.3 },
  sub: { fontSize: 12 },
  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 15, letterSpacing: -0.3 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
});
