import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
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
  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const beneficiary   = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const recipientName = beneficiary?.name ?? (accountNumber ? `Account ${accountNumber}` : "Recipient");
  const recipientBank = beneficiary?.bank ?? "Interbank";
  const numAmount     = parseFloat(amount ?? "0") || 0;

  /* ── Animation values ─────────────────────────────────── */

  // Outer pulse ring — expands and fades
  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  // Main check circle — bounces in
  const circleScale   = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  // Check icon inside — pops in after circle lands
  const iconScale = useSharedValue(0);

  // Content below — fades + slides up
  const textOpacity    = useSharedValue(0);
  const textTranslateY = useSharedValue(16);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    /* Pulse ring: flash to visible then expand-fade away */
    pulseOpacity.value = withSequence(
      withTiming(0.55, { duration: 80 }),
      withDelay(80, withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }))
    );
    pulseScale.value = withTiming(
      1.85,
      { duration: 750, easing: Easing.out(Easing.quad) }
    );

    /* Main circle — spring entrance with satisfying overshoot */
    circleOpacity.value = withTiming(1, { duration: 200 });
    circleScale.value   = withSpring(1, { damping: 11, stiffness: 220 });

    /* Check icon — slightly delayed so circle lands first */
    iconScale.value = withDelay(220, withSpring(1, { damping: 9, stiffness: 200 }));

    /* Receipt + text — fade + slide up */
    textOpacity.value    = withDelay(460, withTiming(1,  { duration: 480 }));
    textTranslateY.value = withDelay(460, withSpring(0,  { damping: 18, stiffness: 130 }));
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform:  [{ scale: pulseScale.value }],
    opacity:    pulseOpacity.value,
  }));
  const circleStyle = useAnimatedStyle(() => ({
    transform:  [{ scale: circleScale.value }],
    opacity:    circleOpacity.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity:   textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.content, { paddingTop: topPad + 48 }]}>

        {/* ── Animated success circle ───────────────────── */}
        <View style={styles.checkOuter}>
          {/* Expanding pulse ring */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.pulseRing,
              { borderColor: colors.success },
              pulseStyle,
            ]}
          />

          {/* Main circle */}
          <Animated.View
            style={[
              styles.checkCircle,
              { backgroundColor: colors.success },
              circleStyle,
            ]}
          >
            <Animated.View style={iconStyle}>
              <TpIcon name="check" size={52} color="#fff" strokeWidth={2.5} />
            </Animated.View>
          </Animated.View>
        </View>

        {/* ── Transaction details ───────────────────────── */}
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
            <ReceiptRow
              label="Reference"
              value={"TXN" + Date.now().toString().slice(-8)}
              colors={colors}
            />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <ReceiptRow
              label="Date"
              value={new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              colors={colors}
            />
            <View style={[styles.sep, { backgroundColor: colors.border }]} />
            <ReceiptRow
              label="Status"
              value="Completed"
              valueColor={colors.success}
              colors={colors}
            />
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
  content:   { flex: 1, alignItems: "center", paddingHorizontal: 24, gap: 24 },

  /* Success circle + pulse ring */
  checkOuter: {
    width: 104, height: 104,
    alignItems: "center", justifyContent: "center",
  },
  pulseRing: {
    borderRadius: 52,
    borderWidth: 2.5,
  },
  checkCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center",
  },

  /* Text area */
  textArea:  { alignItems: "center", gap: 10, width: "100%" },
  title:     { fontSize: 26, letterSpacing: -0.8 },
  amount:    { fontSize: 44, letterSpacing: -1.5 },
  subtitle:  { fontSize: 15, textAlign: "center" },

  /* Receipt card */
  receiptCard: {
    width: "100%", borderRadius: 16, borderWidth: 1, marginTop: 8,
  },
  receiptRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 12,
  },
  receiptLabel: { fontSize: 13 },
  receiptValue: { fontSize: 13, letterSpacing: -0.2 },
  sep:          { height: 0.5, marginHorizontal: 16 },

  cta: { paddingHorizontal: 24, gap: 10 },
});
