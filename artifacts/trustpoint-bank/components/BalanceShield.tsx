import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { TpIcon } from "@/components/TpIcon";

const CARD_ASPECT = 1536 / 1024; // matches actual image dimensions (1536×1024)

interface BalanceShieldProps {
  balance?: number;
  income?: number;
  expenses?: number;
  showBalance?: boolean;
  onToggle?: () => void;
  accountNumber?: string;
  cardholderName?: string;
  onAddMoney?: () => void;
}

const H_PAD = 20;

export function BalanceShield({
  balance = 0,
  showBalance = true,
  onToggle,
  accountNumber,
  cardholderName,
}: BalanceShieldProps) {
  const { width: winWidth } = useWindowDimensions();
  const cardW = winWidth - H_PAD * 2;
  const cardH = cardW / CARD_ASPECT;

  const formatted = balance.toLocaleString("en-NG", { minimumFractionDigits: 0 });
  const digits    = (accountNumber ?? "").replace(/\D/g, "");
  const masked    = digits.length >= 4
    ? `**** **** ${digits.slice(-4)}`
    : "**** **** ****";

  return (
    <View style={[styles.wrapper, { width: cardW, height: cardH }]}>
      {/* Card background image — explicit pixel dims so it never zooms */}
      <Image
        source={require("@/assets/images/card-bg-new-transparent.png")}
        style={{ position: "absolute", top: 0, left: 0, width: cardW, height: cardH }}
        resizeMode="cover"
      />

      {/* Text overlay */}
      <View style={styles.overlay} pointerEvents="box-none">

        {/* ── Account holder label + name at top ── */}
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>Account Holder</Text>
          <Text style={styles.accountName} numberOfLines={1}>
            {cardholderName ?? "TrustPoint Account"}
          </Text>
        </View>

        {/* ── Balance truly centered in remaining space ── */}
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

        {/* ── Masked account number at bottom ── */}
        <Text style={styles.accountNumber}>{masked}</Text>
      </View>
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
    paddingTop: 26,
    paddingBottom: 20,
  },
  nameBlock: { gap: 2 },
  nameLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  balanceCenter: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
    paddingBottom: 24,
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
  accountBlock: { gap: 3 },
  accountName: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
  accountNumber: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
  },
});
