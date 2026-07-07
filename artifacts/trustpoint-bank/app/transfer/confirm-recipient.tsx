import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/Avatar";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ConfirmRecipientScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber, bankName } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    bankName?: string;
  }>();
  const { beneficiaries } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const name = beneficiary?.name ?? `Account ${accountNumber ?? "Unknown"}`;
  const account = beneficiary?.account ?? accountNumber ?? "";
  const bank = beneficiary?.bank ?? bankName ?? "Interbank";
  const initials = beneficiary?.initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const avatarColor = beneficiary?.avatarColor ?? "#457B9D";

  const handleConfirm = () => {
    router.push({
      pathname: "/transfer/amount",
      params: {
        ...(beneficiaryId ? { beneficiaryId } : {}),
        ...(accountNumber ? { accountNumber } : {}),
        ...(bankName ? { bankName } : {}),
      },
    });
  };

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
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Confirm Recipient
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.verifiedRow}>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.success + "18", borderColor: colors.success + "40" }]}>
              <TpIcon name="check-circle" size={14} color={colors.success} strokeWidth={2} />
              <Text style={[styles.verifiedText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                Account Verified
              </Text>
            </View>
          </View>

          <Avatar initials={initials} color={avatarColor} size={72} />

          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={[styles.recipientName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {name}
            </Text>
            <Text style={[styles.recipientBank, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {bank}
            </Text>
          </View>

          <View style={[styles.detailBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <DetailRow label="Account Number" value={account} colors={colors} />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <DetailRow label="Bank" value={bank} colors={colors} />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <DetailRow label="Account Type" value="Savings" colors={colors} />
          </View>

          <View style={[styles.warningRow, { backgroundColor: colors.warning + "12" }]}>
            <TpIcon name="alert-triangle" size={14} color={colors.warning} strokeWidth={1.8} />
            <Text style={[styles.warningText, { color: colors.warning, fontFamily: "Inter_400Regular" }]}>
              Verify the account details carefully. Transfers cannot be reversed.
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.cancelBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.cancelText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Wrong Recipient
            </Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Button onPress={handleConfirm} fullWidth size="large">
              Confirm Recipient
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function DetailRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 14 }}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>{label}</Text>
      <Text style={{ color: colors.text, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>{value}</Text>
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
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { flex: 1, paddingHorizontal: 20, gap: 20, paddingTop: 8 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    gap: 16,
    alignItems: "center",
  },
  verifiedRow: { alignSelf: "stretch", alignItems: "flex-end" },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  verifiedText: { fontSize: 12 },
  recipientName: { fontSize: 22, letterSpacing: -0.5 },
  recipientBank: { fontSize: 14 },
  detailBox: { borderRadius: 14, borderWidth: 1, overflow: "hidden", alignSelf: "stretch" },
  sep: { height: 0.5 },
  warningRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    alignSelf: "stretch",
  },
  warningText: { flex: 1, fontSize: 12, lineHeight: 17 },
  actions: { flexDirection: "row", gap: 12, alignItems: "center" },
  cancelBtn: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelText: { fontSize: 14 },
});
