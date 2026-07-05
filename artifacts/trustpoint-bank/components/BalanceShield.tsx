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
}

export function BalanceShield({
  balance,
  income,
  expenses,
  showBalance,
  onToggle,
  accountNumber = "10•• •••• 4821",
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
        colors={["#232529", "#16171B", "#0C0D0F"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.card}
      >
        {/* satin edge highlight */}
        <View pointerEvents="none" style={styles.edgeHighlight} />
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(225,29,51,0.16)", "rgba(225,29,51,0)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.3, y: 0.7 }}
          style={styles.ambientLight}
        />

        {/* Embossed logo */}
        <View style={styles.logoRow}>
          <View style={styles.embossLogo}>
            <View style={styles.embossLogoInner}>
              <TpIcon name="shield" size={16} color="rgba(255,255,255,0.85)" strokeWidth={2} />
            </View>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={[styles.statusText, { fontFamily: "Inter_500Medium" }]}>Active</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.label, { fontFamily: "Inter_500Medium" }]}>Available Balance</Text>
          <Pressable onPress={onToggle} hitSlop={10} style={styles.eyeBtn}>
            <TpIcon
              name={showBalance ? "eye" : "eye-off"}
              size={17}
              color="rgba(255,255,255,0.55)"
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

        <Text style={[styles.accountNumber, { fontFamily: "Inter_500Medium" }]}>
          {accountNumber} · TrustPoints
        </Text>

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
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 14,
  },
  card: {
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  edgeHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  ambientLight: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  embossLogo: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  embossLogoInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: 0.1 },
  eyeBtn: { padding: 4 },
  balanceRow: { marginTop: 8, marginBottom: 4 },
  balance: {
    fontSize: 40,
    letterSpacing: -1,
    color: "#FFFFFF",
    fontVariant: ["tabular-nums"],
  },
  accountNumber: { fontSize: 12.5, color: "rgba(255,255,255,0.4)", letterSpacing: 0.3 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.07)", marginVertical: 18 },
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
