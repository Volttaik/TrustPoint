import React from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { TpIcon } from "@/components/TpIcon";

const CARD_ASPECT = 1024 / 645;

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

export function BalanceShield({
  balance = 0,
  showBalance = true,
  onToggle,
  accountNumber,
  cardholderName,
}: BalanceShieldProps) {
  const formatted = balance.toLocaleString("en-NG", { minimumFractionDigits: 2 });
  const digits    = (accountNumber ?? "").replace(/\D/g, "");
  const masked    = digits.length >= 4
    ? `**** **** ${digits.slice(-4)}`
    : "**** **** ****";

  return (
    <View style={styles.wrapper}>
      {/* Card background image */}
      <Image
        source={require("@/assets/images/card-bg-new-transparent.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* Text overlay */}
      <View style={styles.overlay} pointerEvents="box-none">

        {/* ── Balance ── */}
        <View style={styles.balanceBlock}>
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

        {/* ── Account info ── */}
        <View style={styles.accountBlock}>
          <Text style={styles.accountName} numberOfLines={1}>
            {cardholderName ?? "TrustPoint Account"}
          </Text>
          <Text style={styles.accountNumber}>{masked}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    aspectRatio: CARD_ASPECT,
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
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 20,
  },
  balanceBlock: { gap: 5 },
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
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.8,
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
