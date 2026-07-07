import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PinPad } from "@/components/ui/PinPad";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TransferPinScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber, amount, total } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    amount: string;
    total: string;
  }>();
  const { login, addTransaction, beneficiaries } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const recipientName = beneficiary?.name ?? (accountNumber ? `Account ${accountNumber}` : "Recipient");
  const recipientBank = beneficiary?.bank ?? "Interbank";
  const recipientAvatarColor = beneficiary?.avatarColor ?? "#457B9D";
  const numAmount = parseFloat(amount ?? "0") || 0;

  const handleKey = (key: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(async () => {
        const correct = await login(newPin);
        if (correct) {
          addTransaction({
            title: recipientName,
            subtitle: `Money sent to ${recipientBank}`,
            amount: numAmount,
            type: "debit",
            status: "success",
            category: "Transfer",
            bank: recipientBank,
            avatarColor: recipientAvatarColor,
          });
          router.replace({
            pathname: "/transfer/processing",
            params: {
              ...(beneficiary ? { beneficiaryId: beneficiary.id } : {}),
              ...(accountNumber ? { accountNumber } : {}),
              amount,
              total,
            },
          });
        } else {
          setError(true);
          setTimeout(() => {
            setError(false);
            setPin("");
          }, 800);
        }
      }, 300);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Enter PIN
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          Enter your 4-digit transaction PIN to authorize this transfer
        </Text>

        {error && (
          <Text style={[styles.error, { color: colors.destructive, fontFamily: "Inter_500Medium" }]}>
            Incorrect PIN. Please try again.
          </Text>
        )}

        <View style={[styles.lockIcon, { backgroundColor: colors.primary + "18" }]}>
          <TpIcon name="lock" size={28} color={colors.primary} strokeWidth={1.8} />
        </View>

        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={() => setPin((p) => p.slice(0, -1))}
          shake={error}
        />

        <TouchableOpacity style={styles.forgotLink}>
          <Text style={[styles.forgotText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
            Forgot PIN?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { flex: 1, alignItems: "center", gap: 24, paddingHorizontal: 20, paddingTop: 24 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  error: { fontSize: 13 },
  lockIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  forgotLink: { marginTop: 8 },
  forgotText: { fontSize: 14 },
});
