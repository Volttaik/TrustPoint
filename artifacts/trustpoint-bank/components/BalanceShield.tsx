import React, { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface BalanceShieldProps {
  balance: number;
  income: number;
  expenses: number;
  showBalance: boolean;
  onToggle: () => void;
  accountNumber?: string;
  onAddMoney?: () => void;
}

export function BalanceShield({
  balance,
  income,
  expenses,
  showBalance,
  onToggle,
  accountNumber = "10•• •••• 4821",
  onAddMoney,
}: BalanceShieldProps) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(0, { duration: 140 }, () => {
      opacity.value = withTiming(1, { duration: 180 });
    });
  }, [showBalance]);

  const balanceStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const formatCurrency = (n: number) =>
    `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#0F1012", "#0A0B0C", "#000000"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.card}
      >
        {/* Top row: Wallet label + add */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.walletLabel, { fontFamily: "Inter_600SemiBold" }]}>Wallet</Text>
            <Text style={[styles.walletSub, { fontFamily: "Inter_400Regular" }]}>TrustPoints Account</Text>
          </View>
          <View style={styles.topRight}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={[styles.statusText, { fontFamily: "Inter_500Medium" }]}>Active</Text>
            </View>
            <Pressable onPress={onAddMoney} hitSlop={8} style={styles.addBtn}>
              <TpIcon name="plus" size={16} color="#F5F6F7" strokeWidth={2.4} />
            </Pressable>
          </View>
        </View>

        {/* Balance */}
        <View style={styles.balanceHeaderRow}>
          <Text style={[styles.label, { fontFamily: "Inter_500Medium" }]}>Available Balance</Text>
          <Pressable onPress={onToggle} hitSlop={10} style={styles.eyeBtn}>
            <TpIcon
              name={showBalance ? "eye" : "eye-off"}
              size={16}
              color="rgba(255,255,255,0.5)"
              strokeWidth={1.8}
            />
          </Pressable>
        </View>

        <Animated.View style={[balanceStyle, styles.balanceRow]}>
          <Text
            style={[styles.balance, { fontFamily: "Inter_700Bold" }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {showBalance ? formatCurrency(balance) : "₦ ••••••••"}
          </Text>
        </Animated.View>

        <View style={styles.divider} />

        {/* Bottom row: account number + card badge */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={[styles.bottomLabel, { fontFamily: "Inter_400Regular" }]}>Account</Text>
            <Text style={[styles.accountNumber, { fontFamily: "Inter_600SemiBold" }]}>{accountNumber}</Text>
          </View>
          <View style={styles.cardBadgeWrap}>
            <View style={[styles.cardBadge, styles.cardBadgeBack]} />
            <View style={[styles.cardBadge, styles.cardBadgeFront]}>
              <TpIcon name="shield" size={13} color="#FFF" strokeWidth={2.2} />
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.stats}>
          <StatItem
            label="Income"
            value={showBalance ? formatCurrency(income) : "••••••"}
            color={colors.success}
            icon="arrow-down-left"
          />
          <View style={styles.statDivider} />
          <StatItem
            label="Expenses"
            value={showBalance ? formatCurrency(expenses) : "••••••"}
            color={colors.primary}
            icon="arrow-up-right"
          />
        </View>
      </LinearGradient>
    </View>
  );
}

function StatItem({ label, value, color, icon }: { label: string; value: string; color: string; icon: TpIconName }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.statIcon, { backgroundColor: color + "1F", borderColor: color + "33" }]}>
        <TpIcon name={icon} size={13} color={color} strokeWidth={2.2} />
      </View>
      <View>
        <Text style={[styles.statLabel, { fontFamily: "Inter_400Regular" }]}>{label}</Text>
        <Text style={[styles.statValue, { fontFamily: "Inter_600SemiBold" }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.55,
    shadowRadius: 36,
    elevation: 18,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#3A0D14",
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  topRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  walletLabel: { fontSize: 16, color: "#F5F6F7", letterSpacing: -0.2 },
  walletSub: { fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(47,190,115,0.12)",
    borderWidth: 1,
    borderColor: "rgba(47,190,115,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2FBE73" },
  statusText: { fontSize: 11, color: "#8FE3B7", letterSpacing: 0.2 },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#000000",
    borderWidth: 1.5,
    borderColor: "#E11D33",
    alignItems: "center",
    justifyContent: "center",
  },
  balanceHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12.5, color: "rgba(255,255,255,0.5)", letterSpacing: 0.1 },
  eyeBtn: { padding: 4 },
  balanceRow: { marginTop: 8, marginBottom: 4 },
  balance: {
    fontSize: 40,
    letterSpacing: -1,
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginVertical: 16 },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bottomLabel: { fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 3 },
  accountNumber: { fontSize: 13, color: "#E8E9EB", letterSpacing: 0.4 },
  cardBadgeWrap: { width: 42, height: 28, position: "relative" },
  cardBadge: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  cardBadgeBack: {
    right: 0,
    top: 2,
    backgroundColor: "#8F1220",
    borderColor: "#26282D",
  },
  cardBadgeFront: {
    right: 14,
    top: 2,
    backgroundColor: "#E11D33",
    borderColor: "#26282D",
  },
  stats: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 },
  statValue: { fontSize: 13, color: "#F5F6F7", fontVariant: ["tabular-nums"] },
  statDivider: { width: 1, height: 34, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 14 },
});
