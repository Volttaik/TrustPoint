import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const PERIODS = ["Last 7 days", "Last 30 days", "Last 3 months", "Last 6 months", "Custom"];
const FORMATS = ["PDF", "Excel", "CSV"];

export default function StatementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions } = useApp();
  const [period, setPeriod] = useState("Last 30 days");
  const [format, setFormat] = useState("PDF");
  const [requesting, setRequesting] = useState(false);
  const [sent, setSent] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const handleRequest = async () => {
    setRequesting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setRequesting(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleShare = async () => {
    await Share.share({ message: "TrustPoint Bank Statement\nGenerated: " + new Date().toLocaleDateString() });
  };

  const credits = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const debits = transactions.filter((t) => t.type === "debit").reduce((s, t) => s + t.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Account Statement
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Account Summary
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: colors.success }]} />
              <View>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Total Credits</Text>
                <Text style={[styles.summaryValue, { color: colors.success, fontFamily: "Inter_700Bold" }]}>
                  ₦{credits.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryDot, { backgroundColor: colors.destructive }]} />
              <View>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Total Debits</Text>
                <Text style={[styles.summaryValue, { color: colors.destructive, fontFamily: "Inter_700Bold" }]}>
                  ₦{debits.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Period */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Statement Period
          </Text>
          <View style={styles.periodList}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodRow,
                  { borderColor: period === p ? colors.primary : colors.border },
                  period === p && { backgroundColor: colors.primary + "10" },
                ]}
              >
                <Text style={[styles.periodText, { color: period === p ? colors.primary : colors.text, fontFamily: period === p ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                  {p}
                </Text>
                {period === p && (
                  <TpIcon name="check" size={16} color={colors.primary} strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Format */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            File Format
          </Text>
          <View style={styles.formatRow}>
            {FORMATS.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFormat(f)}
                style={[
                  styles.formatChip,
                  {
                    backgroundColor: format === f ? colors.primary : colors.card,
                    borderColor: format === f ? colors.primary : colors.border,
                  },
                ]}
              >
                <TpIcon
                  name="file-text"
                  size={16}
                  color={format === f ? "#fff" : colors.mutedForeground}
                  strokeWidth={1.8}
                />
                <Text style={[styles.formatText, { color: format === f ? "#fff" : colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {sent && (
          <View style={[styles.sentBanner, { backgroundColor: colors.success + "18", borderColor: colors.success }]}>
            <TpIcon name="check-circle" size={18} color={colors.success} strokeWidth={1.8} />
            <Text style={[styles.sentText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
              Statement sent to your email!
            </Text>
          </View>
        )}

        <Button onPress={handleRequest} loading={requesting} fullWidth size="large">
          Request Statement
        </Button>

        <Pressable
          onPress={handleShare}
          style={[styles.shareBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <TpIcon name="share-2" size={20} color={colors.text} strokeWidth={1.8} />
          <Text style={[styles.shareBtnText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Share Statement
          </Text>
        </Pressable>

        <View style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TpIcon name="info" size={14} color={colors.mutedForeground} strokeWidth={1.8} />
          <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Statements will be sent to your registered email address and are valid for official use.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 4 },
  summaryCard: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 16 },
  summaryTitle: { fontSize: 15, letterSpacing: -0.3 },
  summaryRow: { flexDirection: "row", alignItems: "center" },
  summaryItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  summaryDot: { width: 8, height: 8, borderRadius: 4 },
  summaryDivider: { width: 1, height: 40, marginHorizontal: 16 },
  summaryLabel: { fontSize: 12, marginBottom: 3 },
  summaryValue: { fontSize: 18, letterSpacing: -0.5 },
  sectionLabel: { fontSize: 13, marginBottom: 10 },
  periodList: { gap: 8 },
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  periodText: { fontSize: 14 },
  formatRow: { flexDirection: "row", gap: 10 },
  formatChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  formatText: { fontSize: 14 },
  sentBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  sentText: { fontSize: 14 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  shareBtnText: { fontSize: 16 },
  note: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
