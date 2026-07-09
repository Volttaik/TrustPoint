import React, { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import * as Clipboard from "expo-clipboard";
import { TpIcon } from "@/components/TpIcon";
import { ShareAccountSheet } from "@/components/ShareAccountSheet";

const CARD_ASPECT = 1536 / 1024;
const H_PAD = 20;

interface BalanceShieldProps {
  balance?: number;
  showBalance?: boolean;
  onToggle?: () => void;
  accountNumber?: string;
  cardholderName?: string;
  bankName?: string;
}

export function BalanceShield({
  balance = 0,
  showBalance = true,
  onToggle,
  accountNumber,
  cardholderName,
  bankName = "TrustPoint MFB",
}: BalanceShieldProps) {
  const { width: winWidth } = useWindowDimensions();
  const [copied, setCopied] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const cardW = winWidth - H_PAD * 2;
  const cardH = cardW / CARD_ASPECT;

  const formatted = balance.toLocaleString("en-NG", { minimumFractionDigits: 0 });
  const digits = (accountNumber ?? "").replace(/\D/g, "");
  const masked = digits.length >= 4 ? `**** **** ${digits.slice(-4)}` : "**** **** ****";

  async function handleCopy() {
    if (!accountNumber) return;
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  return (
    <View style={[styles.wrapper, { width: cardW, height: cardH }]}>
      {/* Card background */}
      <Image
        source={require("@/assets/images/card-bg-new-transparent.png")}
        style={{ position: "absolute", top: 0, left: 0, width: cardW, height: cardH }}
        resizeMode="cover"
      />

      {/* Text overlay */}
      <View style={styles.overlay} pointerEvents="box-none">
        {/* Account holder name top-left */}
        <View style={styles.topRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.nameLabel}>Account Holder</Text>
            <Text style={styles.accountName} numberOfLines={1}>
              {cardholderName ?? "TrustPoint Account"}
            </Text>
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
                size={17}
                color="rgba(255,255,255,0.75)"
                strokeWidth={2.4}
              />
            </Pressable>
          </View>
        </View>

        {/* Masked account number + copy/share bottom */}
        <View style={styles.acctRow}>
          <Text style={styles.accountNumber}>{masked}</Text>
          <View style={styles.acctActions}>
            <Pressable onPress={handleCopy} hitSlop={10} style={styles.acctIconBtn}>
              <TpIcon
                name={copied ? "check" : "copy"}
                size={15}
                color="rgba(255,255,255,0.8)"
                strokeWidth={2.4}
              />
            </Pressable>
            <Pressable onPress={() => setSheetOpen(true)} hitSlop={10} style={styles.acctIconBtn}>
              <TpIcon
                name="share-2"
                size={15}
                color="rgba(255,255,255,0.8)"
                strokeWidth={2.4}
              />
            </Pressable>
          </View>
        </View>
      </View>

      <ShareAccountSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accountName={cardholderName ?? "TrustPoint Account"}
        accountNumber={accountNumber ?? ""}
        bankName={bankName}
        onCopied={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }}
      />
    </View>
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
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  accountName: {
    fontSize: 15,
    color: "rgba(255,255,255,0.92)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
  balanceCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
    paddingBottom: 20,
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
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
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  eyeBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  acctRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountNumber: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
  },
  acctActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  acctIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
});
