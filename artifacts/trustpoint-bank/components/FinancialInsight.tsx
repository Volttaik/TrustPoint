import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface FinancialInsightProps {
  spent: number;
  budget: number;
}

export function FinancialInsight({ spent, budget }: FinancialInsightProps) {
  const colors = useColors();
  const pct = Math.min(100, Math.round((spent / budget) * 100));

  const formatCurrency = (n: number) =>
    `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.iconWrap, { backgroundColor: colors.warning + "1E", borderColor: colors.warning + "35" }]}>
            <TpIcon name="pie-chart" size={16} color={colors.warning} strokeWidth={2.2} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Monthly Spending
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {pct}% of your budget used
            </Text>
          </View>
        </View>
        <Text style={[styles.pct, { color: colors.text, fontFamily: "Inter_700Bold" }]}>{pct}%</Text>
      </View>

      <View style={[styles.track, { backgroundColor: colors.charcoal }]}>
        <LinearGradient
          colors={pct > 80 ? ["#E11D33", "#8F1220"] : ["#E3A008", "#B9790A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${pct}%` }]}
        />
      </View>

      <View style={styles.footRow}>
        <Text style={[styles.footText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          {formatCurrency(spent)} spent
        </Text>
        <Text style={[styles.footText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          of {formatCurrency(budget)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleGroup: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: { fontSize: 14.5, letterSpacing: -0.2 },
  subtitle: { fontSize: 11.5, marginTop: 2 },
  pct: { fontSize: 18, fontVariant: ["tabular-nums"] },
  track: { height: 8, borderRadius: 4, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 4 },
  footRow: { flexDirection: "row", justifyContent: "space-between" },
  footText: { fontSize: 12 },
});
