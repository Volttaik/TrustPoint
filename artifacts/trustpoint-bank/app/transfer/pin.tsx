import React, { useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const isDark = colors.background === "#0A0A0A";

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
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Enter PIN
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.iconWrap, {
          backgroundColor: isDark ? "#140308" : "#FDF0F2",
          borderColor: "#E11D3322",
        }]}>
          <Image
            source={require("@/assets/icons/financial_security.webp")}
            style={styles.iconImg}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Authorize Transfer
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Enter your 4-digit PIN to securely{"\n"}confirm this payment
          </Text>
        </View>

        {error && (
          <View style={[styles.errorPill, {
            backgroundColor: colors.destructive + "18",
            borderColor: colors.destructive + "44",
          }]}>
            <TpIcon name="alert-circle" size={14} color={colors.destructive} strokeWidth={2} />
            <Text style={[styles.errorTxt, { color: colors.destructive, fontFamily: "Inter_500Medium" }]}>
              Incorrect PIN. Please try again.
            </Text>
          </View>
        )}

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
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  content: {
    flex: 1, alignItems: "center",
    gap: 20, paddingHorizontal: 20, paddingTop: 12,
  },

  iconWrap: {
    width: 80, height: 80, borderRadius: 20,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  iconImg: { width: 54, height: 54 },

  textBlock: { alignItems: "center", gap: 8 },
  title:    { fontSize: 20, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 21 },

  errorPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  errorTxt: { fontSize: 13 },

  forgotLink: { marginTop: 4 },
  forgotText: { fontSize: 14 },
});
