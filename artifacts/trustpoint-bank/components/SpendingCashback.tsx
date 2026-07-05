import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface Segment {
  color: string;
  value: number;
}

interface CashbackBadge {
  icon: TpIconName;
  color: string;
}

interface SpendingCashbackProps {
  spentLabel: string;
  segments: Segment[];
  cashbackAmount: string;
  badges: CashbackBadge[];
}

export function SpendingCashback({ spentLabel, segments, cashbackAmount, badges }: SpendingCashbackProps) {
  const colors = useColors();
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;

  return (
    <View style={styles.row}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Spending</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {spentLabel}
        </Text>
        <View style={[styles.track, { backgroundColor: colors.charcoal }]}>
          {segments.map((seg, idx) => (
            <View
              key={idx}
              style={{
                flex: seg.value / total,
                backgroundColor: seg.color,
                height: "100%",
                borderRadius: 6,
                marginRight: idx < segments.length - 1 ? 3 : 0,
              }}
            />
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Cash Back</Text>
        <Text style={[styles.cashbackAmount, { color: colors.success, fontFamily: "Inter_700Bold" }]}>
          {cashbackAmount}
        </Text>
        <View style={styles.badgeRow}>
          {badges.map((b, idx) => (
            <View
              key={idx}
              style={[
                styles.badge,
                {
                  backgroundColor: b.color + "1E",
                  borderColor: b.color + "38",
                  marginLeft: idx === 0 ? 0 : -8,
                  zIndex: badges.length - idx,
                },
              ]}
            >
              <TpIcon name={b.icon} size={13} color={b.color} strokeWidth={2.2} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { fontSize: 13.5, letterSpacing: -0.2 },
  subtitle: { fontSize: 11, marginTop: -6 },
  track: { flexDirection: "row", height: 9, borderRadius: 5, overflow: "hidden", marginTop: 4 },
  cashbackAmount: { fontSize: 19, marginTop: -4, fontVariant: ["tabular-nums"] },
  badgeRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
});
