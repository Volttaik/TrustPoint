import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { NetworkLogo } from "./NetworkLogo";
import { NETWORKS, type NetworkId } from "./networkDetect";

interface Row {
  label: string;
  value: string;
  valueColor?: string;
}

interface Props {
  networkId: NetworkId | null;
  phone: string;
  purchaseType: string;   // "Airtime" | "Data"
  planLabel?: string;     // "500MB / 7 Days"
  amount: number;
  fee?: number;
  payFrom?: string;
}

export function SummaryCard({ networkId, phone, purchaseType, planLabel, amount, fee = 0, payFrom }: Props) {
  const colors = useColors();
  const network = networkId ? NETWORKS[networkId] : null;
  const total = amount + fee;

  const rows: Row[] = [
    { label: "Recipient",   value: phone },
    { label: "Network",     value: network?.name ?? "—" },
    { label: "Type",        value: purchaseType },
    ...(planLabel ? [{ label: "Plan", value: planLabel }] : []),
    { label: "Amount",      value: `₦${amount.toLocaleString()}` },
    ...(fee > 0 ? [{ label: "Service Fee", value: `₦${fee.toLocaleString()}` }] : []),
  ];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={[styles.cardHeader, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          {networkId && <NetworkLogo id={networkId} size={28} />}
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Purchase Summary
          </Text>
        </View>
      </View>

      {/* Rows */}
      {rows.map((r, i) => (
        <React.Fragment key={r.label}>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {r.label}
            </Text>
            <Text style={[styles.value, { color: r.valueColor ?? colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {r.value}
            </Text>
          </View>
          {i < rows.length - 1 && (
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
          )}
        </React.Fragment>
      ))}

      {/* Total */}
      <View style={[styles.totalRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.totalLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Total
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
          ₦{total.toLocaleString()}
        </Text>
      </View>

      {/* Pay from */}
      {payFrom && (
        <View style={[styles.payFrom, { backgroundColor: colors.surfaceHigh, borderTopColor: colors.border }]}>
          <Text style={[styles.payFromLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Pay from
          </Text>
          <Text style={[styles.payFromValue, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
            {payFrom}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: { fontSize: 14 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  label: { fontSize: 13 },
  value: { fontSize: 13, letterSpacing: -0.1 },
  sep:   { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 15 },
  totalValue: { fontSize: 20, letterSpacing: -0.5 },
  payFrom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  payFromLabel: { fontSize: 12 },
  payFromValue: { fontSize: 13 },
});
