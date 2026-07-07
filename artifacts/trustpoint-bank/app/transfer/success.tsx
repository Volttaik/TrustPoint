import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TransferSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber, amount } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    amount: string;
  }>();
  const { beneficiaries } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const beneficiary = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const recipientName = beneficiary?.name ?? (accountNumber ? `Account ${accountNumber}` : "Recipient");
  const recipientBank = beneficiary?.bank ?? "Interbank";
  const numAmount = parseFloat(amount ?? "0") || 0;

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    checkScale.value = withSpring(1, { damping: 12, stiffness: 180 });
    checkOpacity.value = withTiming(1, { duration: 400 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.content, { paddingTop: topPad + 40 }]}>
        <Animated.View style={[checkStyle, styles.checkCircle, { backgroundColor: colors.success }]}>
          <TpIcon name="check" size={52} color="#fff" strokeWidth={2.5} />
        </Animated.View>

        <Animated.View style={[textStyle, styles.textArea]}>
          <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Transfer Successful!
          </Text>
          <Text style={[styles.amount, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
            ₦{numAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Sent to {recipientName} · {recipientBank}
          </Text>

          <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ReceiptRow label="Reference" value={"TXN" + Date.now().toString().slice(-8)} colors={colors} />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <ReceiptRow label="Date" value={new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} colors={colors} />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <ReceiptRow label="Status" value="Completed" valueColor={colors.success} colors={colors} />
          </View>
        </Animated.View>
      </View>

      <View style={[styles.cta, { paddingBottom: bottomPad + 24 }]}>
        <Button variant="secondary" fullWidth onPress={() => {}}>
          Share Receipt
        </Button>
        <Button onPress={() => router.replace("/(main)")} fullWidth size="large">
          Done
        </Button>
      </View>
    </View>
  );
}

function ReceiptRow({ label, value, valueColor, colors }: any) {
  return (
    <View style={styles.receiptRow}>
      <Text style={[styles.receiptLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      <Text style={[styles.receiptValue, { color: valueColor ?? colors.text, fontFamily: "Inter_600SemiBold" }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 24, gap: 24 },
  checkCircle: {
    width: 100, height: 100, borderRadius: 50, alignItems: "center", justifyContent: "center",
  },
  textArea: { alignItems: "center", gap: 10, width: "100%" },
  title: { fontSize: 26, letterSpacing: -0.8 },
  amount: { fontSize: 44, letterSpacing: -1.5 },
  subtitle: { fontSize: 15, textAlign: "center" },
  receiptCard: { width: "100%", borderRadius: 16, borderWidth: 1, marginTop: 8 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  receiptLabel: { fontSize: 13 },
  receiptValue: { fontSize: 13, letterSpacing: -0.2 },
  sep: { height: 0.5, marginHorizontal: 16 },
  cta: { paddingHorizontal: 24, gap: 10 },
});
