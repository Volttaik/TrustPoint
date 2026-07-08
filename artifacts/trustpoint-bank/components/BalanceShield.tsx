import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { TpIcon } from "@/components/TpIcon";
import { BankLogo } from "@/components/BankLogo";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { useApp } from "@/context/AppContext";

const CARD_ASPECT = 1536 / 1024;
const H_PAD = 20;

interface BalanceShieldProps {
  balance?: number;
  showBalance?: boolean;
  onToggle?: () => void;
  accountNumber?: string;
  cardholderName?: string;
}

export function BalanceShield({
  balance = 0,
  showBalance = true,
  onToggle,
  accountNumber,
  cardholderName,
}: BalanceShieldProps) {
  const { width: winWidth } = useWindowDimensions();
  const { linkedAccounts, activeAccountId } = useApp();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const cardW = winWidth - H_PAD * 2;
  const cardH = cardW / CARD_ASPECT;

  const formatted = balance.toLocaleString("en-NG", { minimumFractionDigits: 0 });
  const digits = (accountNumber ?? "").replace(/\D/g, "");
  const masked = digits.length >= 4 ? `**** **** ${digits.slice(-4)}` : "**** **** ****";

  const activeAccount = linkedAccounts.find((a) => a.id === activeAccountId);
  const activeBankName = activeAccount?.bankName ?? "TrustPoint Bank";
  const hasMultiple = linkedAccounts.length > 1;

  return (
    <>
      <View style={{ gap: 10 }}>
        <View style={[styles.wrapper, { width: cardW, height: cardH }]}>
          {/* Card background */}
          <Image
            source={require("@/assets/images/card-bg-new-transparent.png")}
            style={{ position: "absolute", top: 0, left: 0, width: cardW, height: cardH }}
            resizeMode="cover"
          />

          {/* Text overlay */}
          <View style={styles.overlay} pointerEvents="box-none">
            {/* Bank logo + account label top-right */}
            <View style={styles.topRow}>
              <View style={styles.nameBlock}>
                <Text style={styles.nameLabel}>Account Holder</Text>
                <Text style={styles.accountName} numberOfLines={1}>
                  {cardholderName ?? "TrustPoint Account"}
                </Text>
              </View>
              <View style={styles.bankLogoWrap}>
                <BankLogo bankName={activeBankName} size={34} />
              </View>
            </View>

            {/* Balance centered */}
            <View style={styles.balanceCenter}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount} numberOfLines={1} adjustsFontSizeToFit>
                  {showBalance ? `₦${formatted}` : "₦ ••••••••"}
                </Text>
                <Pressable onPress={onToggle} hitSlop={14} style={styles.eyeBtn}>
                  <TpIcon
                    name={showBalance ? "eye" : "eye-off"}
                    size={15}
                    color="rgba(255,255,255,0.65)"
                    strokeWidth={1.8}
                  />
                </Pressable>
              </View>
            </View>

            {/* Masked account number bottom */}
            <Text style={styles.accountNumber}>{masked}</Text>
          </View>
        </View>

        {/* Switch Account button — below card */}
        <TouchableOpacity
          onPress={() => setShowSwitcher(true)}
          activeOpacity={0.8}
          style={styles.switchBtn}
        >
          <BankLogo bankName={activeBankName} size={20} />
          <Text style={styles.switchBankName} numberOfLines={1}>
            {activeBankName}
          </Text>
          <TpIcon name="refresh-cw" size={13} color="rgba(255,255,255,0.7)" strokeWidth={2} />
          <Text style={styles.switchLabel}>Switch</Text>
          <TpIcon name="chevron-down" size={14} color="rgba(255,255,255,0.5)" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <AccountSwitcher visible={showSwitcher} onClose={() => setShowSwitcher(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#E63946",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.28,
        shadowRadius: 24,
      },
      android: { elevation: 14 },
    }),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameBlock: { gap: 2, flex: 1, paddingRight: 8 },
  nameLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  accountName: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
  bankLogoWrap: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.18)",
  },
  balanceCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
    paddingBottom: 20,
  },
  balanceLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceAmount: {
    flex: 1,
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  eyeBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  accountNumber: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
  },
  // Switch Account strip
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  switchBankName: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Inter_500Medium",
  },
  switchLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Inter_400Regular",
  },
});
