import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface BalanceShieldProps {
  balance: number;
  income: number;
  expenses: number;
  showBalance: boolean;
  onToggle: () => void;
}

export function BalanceShield({ balance, income, expenses, showBalance, onToggle }: BalanceShieldProps) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 150 }, () => {
      opacity.value = withTiming(1, { duration: 150 });
    });
  }, [showBalance]);

  const balanceStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const formatCurrency = (n: number) =>
    `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.primary,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Total Balance
        </Text>
        <Pressable onPress={onToggle} style={styles.eyeBtn}>
          <Feather
            name={showBalance ? "eye" : "eye-off"}
            size={18}
            color={colors.mutedForeground}
          />
        </Pressable>
      </View>

      {/* Balance */}
      <Animated.View style={[balanceStyle, styles.balanceRow]}>
        <Text style={[styles.balance, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {showBalance ? formatCurrency(balance) : "₦ ••••••••"}
        </Text>
      </Animated.View>

      {/* Stats */}
      <View style={styles.stats}>
        <StatItem
          label="Income"
          value={showBalance ? formatCurrency(income) : "••••••"}
          color={colors.success}
          icon="arrow-down-left"
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <StatItem
          label="Expenses"
          value={showBalance ? formatCurrency(expenses) : "••••••"}
          color={colors.primary}
          icon="arrow-up-right"
          colors={colors}
        />
      </View>
    </View>
  );
}

function StatItem({ label, value, color, icon, colors }: any) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color + "22" }]}>
        <Feather name={icon} size={14} color={color} />
      </View>
      <View>
        <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {label}
        </Text>
        <Text style={[styles.statValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 13 },
  eyeBtn: { padding: 4 },
  balanceRow: { marginVertical: 4 },
  balance: { fontSize: 34, letterSpacing: -1 },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  stat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  statIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  statLabel: { fontSize: 11, marginBottom: 2 },
  statValue: { fontSize: 13 },
  divider: { width: 1, height: 40, marginHorizontal: 16 },
});
