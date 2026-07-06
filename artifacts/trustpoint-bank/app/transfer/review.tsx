import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber, amount } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    amount: string;
  }>();
  const { beneficiaries, user } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  // Recipient display values — works for both saved-beneficiary and manual account-number flows
  const recipientName = beneficiary?.name ?? "New Recipient";
  const recipientAccount = beneficiary?.account ?? accountNumber ?? "N/A";
  const recipientBank = beneficiary?.bank ?? "Interbank";
  const recipientInitials = beneficiary?.initials ?? (accountNumber ? "NR" : "??");
  const recipientAvatarColor = beneficiary?.avatarColor ?? "#457B9D";
  const numAmount = parseFloat(amount ?? "0") || 0;
  const fee = numAmount > 0 ? 10 : 0;
  const total = numAmount + fee;

  const formatCur = (n: number) =>
    `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const Detail = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: valueColor ?? colors.text, fontFamily: "Inter_600SemiBold" }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Review Transfer
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 80 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.flowRow}>
          <View style={styles.party}>
            <Avatar initials={user?.initials ?? "JD"} color={user?.avatarColor ?? colors.primary} size={60} />
            <Text style={[styles.partyName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {user?.name?.split(" ")[0] ?? "You"}
            </Text>
            <Text style={[styles.partySub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              TrustPoint
            </Text>
          </View>

          <View style={styles.arrowArea}>
            <View style={[styles.arrowLine, { backgroundColor: colors.primary }]} />
            <View style={[styles.amountBubble, { backgroundColor: colors.primary }]}>
              <Text style={[styles.amountBubbleText, { fontFamily: "Inter_700Bold" }]}>
                {formatCur(numAmount)}
              </Text>
            </View>
            <TpIcon name="arrow-right" size={20} color={colors.primary} strokeWidth={2} />
          </View>

          <View style={styles.party}>
            <Avatar initials={recipientInitials} color={recipientAvatarColor} size={60} />
            <Text style={[styles.partyName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {recipientName.split(" ")[0]}
            </Text>
            <Text style={[styles.partySub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {recipientBank}
            </Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Detail label="Recipient" value={recipientName} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Account Number" value={recipientAccount} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Bank" value={recipientBank} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Amount" value={formatCur(numAmount)} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Transaction Fee" value={formatCur(fee)} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Total Debit" value={formatCur(total)} valueColor={colors.primary} />
        </View>

        <View style={[styles.notice, { backgroundColor: colors.warning + "15", borderColor: colors.warning + "44" }]}>
          <TpIcon name="info" size={14} color={colors.warning} strokeWidth={2} />
          <Text style={[styles.noticeText, { color: colors.warning, fontFamily: "Inter_400Regular" }]}>
            Funds typically arrive instantly. For issues, contact support.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: bottomPad + 16, borderTopColor: colors.border }]}>
        <Button
          onPress={() =>
            router.push({
              pathname: "/transfer/pin",
              params: {
              ...(beneficiary ? { beneficiaryId: beneficiary.id } : {}),
              ...(accountNumber ? { accountNumber } : {}),
              amount: numAmount,
              total,
            },
            })
          }
          fullWidth
          size="large"
        >
          Confirm Transfer
        </Button>
        <Button variant="ghost" onPress={() => router.back()} fullWidth>
          Edit
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  flowRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12 },
  party: { alignItems: "center", gap: 8, flex: 1 },
  partyName: { fontSize: 14, letterSpacing: -0.3 },
  partySub: { fontSize: 11 },
  arrowArea: { alignItems: "center", justifyContent: "center", gap: 4 },
  arrowLine: { width: 2, height: 20 },
  amountBubble: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, marginVertical: 4 },
  amountBubbleText: { color: "#fff", fontSize: 12 },
  card: { borderRadius: 18, borderWidth: 1, padding: 4 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, letterSpacing: -0.2 },
  sep: { height: 0.5, marginHorizontal: 16 },
  notice: { flexDirection: "row", gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, alignItems: "flex-start" },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18 },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 16, gap: 8, borderTopWidth: 0.5, backgroundColor: "transparent" },
});
