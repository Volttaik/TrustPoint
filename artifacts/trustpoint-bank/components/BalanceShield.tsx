import React from "react";
import { Image, Platform, StyleSheet, View } from "react-native";

// Aspect ratio of the card image (1024 × 645 ≈ 1.587 : 1)
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

export function BalanceShield(_props: BalanceShieldProps) {
  return (
    <View style={styles.wrapper}>
      <Image
        source={require("@/assets/images/card-bg-new-transparent.png")}
        style={styles.card}
        resizeMode="cover"
      />
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
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: { elevation: 14 },
    }),
  },
  card: {
    width: "100%",
    height: "100%",
  },
});
