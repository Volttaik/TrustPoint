import React, { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TpIcon } from "@/components/TpIcon";
import { PackIcon, PackIconName } from "@/components/PackIcon";
import { useColors } from "@/hooks/useColors";
import { Transaction } from "@/context/AppContext";

interface TransactionItemProps {
  tx: Transaction;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const CATEGORY_ICON: Record<string, PackIconName> = {
  Transfer:      "tx_transfer",
  Bills:         "tx_bills",
  Airtime:       "tx_airtime",
  Data:          "tx_data",
  Entertainment: "tx_entertainment",
  Income:        "tx_income",
  Shopping:      "tx_shopping",
};

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

  const isCredit = tx.type === "credit";
  const amountColor =
    tx.status === "failed" ? colors.destructive : isCredit ? colors.success : colors.text;

  const amountPrefix = isCredit ? "+" : "-";

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

  const categoryIcon: PackIconName = CATEGORY_ICON[tx.category] ?? "tx_default";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[aStyle, styles.row]}
    >
      <View style={styles.merchantWrap}>
        <View
          style={[
            styles.merchantIcon,
            { backgroundColor: (tx.avatarColor ?? colors.primary) + "1E", borderColor: (tx.avatarColor ?? colors.primary) + "35" },
          ]}
        >
          <Text
            style={[styles.merchantInitials, { color: tx.avatarColor ?? colors.primary, fontFamily: "Inter_700Bold" }]}
          >
            {tx.title.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View
          style={[
            styles.dirBadge,
            { backgroundColor: isCredit ? colors.success : colors.charcoal, borderColor: colors.card },
          ]}
        >
          <TpIcon
            name={isCredit ? "arrow-down-left" : "arrow-up-right"}
            size={9}
            color="#fff"
            strokeWidth={3}
          />
        </View>
      </View>

      <View style={styles.center}>
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
          {tx.title}
        </Text>
        <View style={styles.subRow}>
          <PackIcon name={categoryIcon} size={14} />
          <Text style={[styles.sub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]} numberOfLines={1}>
            {tx.subtitle} · {formatDate(tx.date)}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, { color: amountColor, fontFamily: "Inter_600SemiBold" }]}>
          {formatAmount(tx.amount)}
        </Text>
        <Text style={[styles.statusLabel, { color: colors.mutedForeground }]}>{tx.status}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  merchantWrap: { position: "relative" },
  merchantIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  merchantInitials: { fontSize: 15 },
  dirBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  center: { flex: 1, gap: 4 },
  title: { fontSize: 15, letterSpacing: -0.3 },
  subRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sub: { fontSize: 12 },
  right: { alignItems: "flex-end", gap: 3 },
  amount: { fontSize: 15, letterSpacing: -0.3, fontVariant: ["tabular-nums"] },
  statusLabel: { fontSize: 10.5, textTransform: "capitalize" },
});
