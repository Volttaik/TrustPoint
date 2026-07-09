import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

export default function BillsSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isDark = colors.background !== "#F4F5F7";
  const { provider, amount, meter, category, icon, color, fieldLabel } = useLocalSearchParams<{
    provider: string;
    amount: string;
    meter: string;
    category: string;
    icon: string;
    color: string;
    fieldLabel: string;
  }>();

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24;

  const numAmt = parseFloat(amount ?? "0") || 0;
  const ref    = "TP" + Date.now().toString().slice(-8);
  const catColor = color || "#FF9500";

  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const circleScale  = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const iconScale    = useSharedValue(0);
  const contentOpacity    = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    pulseOpacity.value = withSequence(
      withTiming(0.5, { duration: 80 }),
      withDelay(80, withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }))
    );
    pulseScale.value = withTiming(1.8, { duration: 730, easing: Easing.out(Easing.quad) });

    circleOpacity.value = withTiming(1, { duration: 200 });
    circleScale.value   = withSpring(1, { damping: 11, stiffness: 220 });

    iconScale.value = withDelay(200, withSpring(1, { damping: 9, stiffness: 200 }));

    contentOpacity.value    = withDelay(420, withTiming(1, { duration: 480 }));
    contentTranslateY.value = withDelay(420, withSpring(0, { damping: 18, stiffness: 130 }));
  }, []);

  const pulseStyle   = useAnimatedStyle(() => ({ transform: [{ scale: pulseScale.value }], opacity: pulseOpacity.value }));
  const circleStyle  = useAnimatedStyle(() => ({ transform: [{ scale: circleScale.value }], opacity: circleOpacity.value }));
  const iconStyle    = useAnimatedStyle(() => ({ transform: [{ scale: iconScale.value }] }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value, transform: [{ translateY: contentTranslateY.value }] }));

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.content, { paddingTop: topPad + 48 }]}>
        <View style={styles.checkOuter}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.pulseRing, { borderColor: colors.success }, pulseStyle]} />
          <Animated.View style={[styles.checkCircle, { backgroundColor: colors.success }, circleStyle]}>
            <Animated.View style={iconStyle}>
              <TpIcon name="check" size={48} color="#fff" strokeWidth={2.5} />
            </Animated.View>
          </Animated.View>
        </View>

        <Animated.View style={[contentStyle, styles.textArea]}>
          <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Bill Paid!
          </Text>

          <View style={styles.amountRow}>
            <View style={[styles.catIconBig, { backgroundColor: catColor + "20" }]}>
              <TpIcon name={(icon as TpIconName) || "zap"} size={22} color={catColor} strokeWidth={1.8} />
            </View>
            <Text style={[styles.amount, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
              ₦{numAmt.toLocaleString()}
            </Text>
          </View>

          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {provider} · {category}
          </Text>

          <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ReceiptRow label="Reference" value={ref} colors={colors} />
            <ReceiptSep colors={colors} />
            <ReceiptRow label={fieldLabel || "Meter Number"} value={meter} colors={colors} />
            <ReceiptSep colors={colors} />
            <ReceiptRow label="Provider" value={provider} colors={colors} />
            <ReceiptSep colors={colors} />
            <ReceiptRow label="Amount" value={`₦${numAmt.toLocaleString()}`} colors={colors} />
            <ReceiptSep colors={colors} />
            <ReceiptRow label="Status" value="Completed" valueColor={colors.success} colors={colors} />
            <ReceiptSep colors={colors} />
            <ReceiptRow
              label="Date"
              value={new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
              colors={colors}
            />
          </View>
        </Animated.View>
      </View>

      <View style={[styles.cta, { paddingBottom: bottomPad }]}>
        <Button variant="secondary" fullWidth onPress={() => {}}>
          Share Receipt
        </Button>
        <Button fullWidth size="large" onPress={() => router.replace("/(main)")}>
          Done
        </Button>
        <TouchableOpacity onPress={() => router.replace("/bills")}>
          <Text style={[styles.buyAgain, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
            Pay Another Bill
          </Text>
        </TouchableOpacity>
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

function ReceiptSep({ colors }: any) {
  return <View style={[styles.sep, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 24, gap: 20 },

  checkOuter:  { width: 100, height: 100, alignItems: "center", justifyContent: "center" },
  pulseRing:   { borderRadius: 50, borderWidth: 2.5 },
  checkCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },

  textArea: { alignItems: "center", gap: 10, width: "100%" },
  title:    { fontSize: 24, letterSpacing: -0.7 },
  amountRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  catIconBig: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  amount:   { fontSize: 36, letterSpacing: -1.2 },
  subtitle: { fontSize: 14, textAlign: "center" },

  receiptCard: { width: "100%", borderRadius: 18, borderWidth: 1, marginTop: 4 },
  receiptRow:  {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 11,
  },
  receiptLabel: { fontSize: 13 },
  receiptValue: { fontSize: 13, letterSpacing: -0.1 },
  sep:          { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },

  cta: { paddingHorizontal: 24, gap: 10 },
  buyAgain: { textAlign: "center", fontSize: 14, paddingVertical: 4 },
});
