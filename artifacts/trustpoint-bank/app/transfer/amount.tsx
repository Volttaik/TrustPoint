import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const QUICK_AMOUNTS = [1000, 5000, 10000, 50000];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "⌫"];

export default function AmountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber } = useLocalSearchParams<{ beneficiaryId?: string; accountNumber?: string }>();
  const { beneficiaries, user } = useApp();
  const [amount, setAmount] = useState("0");
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  // Support both flows: saved beneficiary (beneficiaryId) or manual account number entry
  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const recipientLabel = beneficiary?.name ?? (accountNumber ? `Account ${accountNumber}` : "Recipient");
  const recipientSub = beneficiary
    ? `${beneficiary.bank} · ${beneficiary.account}`
    : accountNumber
    ? "New recipient"
    : "";

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setAmount((a) => (a.length <= 1 ? "0" : a.slice(0, -1)));
      return;
    }
    if (key === "." && amount.includes(".")) return;
    setAmount((a) => {
      if (a === "0" && key !== ".") return key;
      return a + key;
    });
  };

  const numAmount = parseFloat(amount) || 0;
  const hasEnough = numAmount <= (user?.balance ?? 0) && numAmount > 0;

  const formatDisplay = () => {
    const [int, dec] = amount.split(".");
    const formattedInt = parseInt(int || "0").toLocaleString("en-NG");
    return dec !== undefined ? `${formattedInt}.${dec}` : formattedInt;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Send to
          </Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {recipientLabel}
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.amountArea}>
        <Text style={[styles.currency, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>₦</Text>
        <Text
          style={[
            styles.amount,
            {
              color: numAmount > (user?.balance ?? 0) ? colors.destructive : colors.text,
              fontFamily: "Inter_700Bold",
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatDisplay()}
        </Text>
      </View>

      <Text style={[styles.balanceHint, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        Balance: ₦{(user?.balance ?? 0).toLocaleString()}
      </Text>

      <View style={styles.quickRow}>
        {QUICK_AMOUNTS.map((a) => (
          <TouchableOpacity
            key={a}
            onPress={() => setAmount(String(a))}
            style={[
              styles.quickChip,
              {
                backgroundColor: numAmount === a ? colors.primary + "22" : colors.surface,
                borderColor: numAmount === a ? colors.primary : colors.border,
              },
            ]}
          >
            <Text style={[styles.quickText, { color: numAmount === a ? colors.primary : colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              ₦{a >= 1000 ? `${a / 1000}k` : a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.keypad}>
        {KEYS.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleKey(key)}
            style={[styles.key, { backgroundColor: key ? colors.surface : "transparent" }]}
            activeOpacity={0.6}
          >
            {key === "⌫" ? (
              <TpIcon name="delete" size={22} color={colors.text} strokeWidth={1.8} />
            ) : (
              <Text style={[styles.keyText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {key}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.cta, { paddingBottom: bottomPad + 20 }]}>
        {!hasEnough && numAmount > (user?.balance ?? 0) && (
          <Text style={[styles.errorText, { color: colors.destructive, fontFamily: "Inter_500Medium" }]}>
            Insufficient balance. Need ₦{(numAmount - (user?.balance ?? 0)).toLocaleString()} more.
          </Text>
        )}
        <Button
          onPress={() =>
            router.push({
              pathname: "/transfer/review",
              params: {
                ...(beneficiary ? { beneficiaryId: beneficiary.id } : {}),
                ...(accountNumber ? { accountNumber } : {}),
                amount,
              },
            })
          }
          disabled={!hasEnough}
          fullWidth
          size="large"
        >
          Continue
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerCenter: { alignItems: "center" },
  headerTitle: { fontSize: 15, letterSpacing: -0.3 },
  headerSub: { fontSize: 13 },
  amountArea: { flexDirection: "row", alignItems: "flex-end", justifyContent: "center", gap: 6, paddingHorizontal: 20, paddingVertical: 16 },
  currency: { fontSize: 28, marginBottom: 6 },
  amount: { fontSize: 56, letterSpacing: -2, flex: 1, textAlign: "center" },
  balanceHint: { fontSize: 13, textAlign: "center", marginBottom: 12 },
  quickRow: { flexDirection: "row", justifyContent: "center", gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  quickText: { fontSize: 13 },
  keypad: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, gap: 8, justifyContent: "center", flex: 1, alignContent: "center" },
  key: { width: "30%", height: 60, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  keyText: { fontSize: 24 },
  cta: { paddingHorizontal: 20, gap: 8 },
  errorText: { fontSize: 13, textAlign: "center" },
});
