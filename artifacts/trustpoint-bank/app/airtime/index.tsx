import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { PhoneCard } from "@/components/airtime/PhoneCard";
import { BeneficiaryStrip } from "@/components/airtime/BeneficiaryStrip";
import { AmountChips } from "@/components/airtime/AmountChips";
import { SummaryCard } from "@/components/airtime/SummaryCard";
import { PinSheet } from "@/components/airtime/PinSheet";
import { detectNetwork } from "@/components/airtime/networkDetect";

/* ─── HistoryIcon inline SVG ─────────────────────────── */
function HistoryIcon({ size = 20, color }: { size?: number; color: string }) {
  const Svg = require("react-native-svg").default;
  const Path = require("react-native-svg").Path;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12A9 9 0 1 0 12 3M3 12H7M3 12V8"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <Path
        d="M12 7.5V12.5L15 14.5"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </Svg>
  );
}

export default function AirtimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, beneficiaries, addTransaction, login } = useApp();
  const isDark = colors.background !== "#F4F5F7";

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24;

  const [phone, setPhone]       = useState("");
  const [amount, setAmount]     = useState("");
  const [customAmount, setCustom] = useState("");
  const [showPin, setShowPin]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const networkId = phone.length >= 4 ? detectNetwork(phone) : null;
  const numAmount = parseInt(amount || customAmount || "0", 10);
  const canProceed = phone.length >= 10 && numAmount >= 50;

  /* Summary fade in */
  const summaryOpacity = useSharedValue(0);
  const summaryStyle = useAnimatedStyle(() => ({ opacity: summaryOpacity.value }));
  React.useEffect(() => {
    summaryOpacity.value = withTiming(canProceed ? 1 : 0, { duration: 200 });
  }, [canProceed]);

  /**
   * Filter to entries whose `account` looks like a Nigerian mobile number
   * (10 digits starting with 0, or 13 chars starting with 234).
   * Bank account numbers (10 digits NOT starting with 0) are excluded.
   */
  const isPhoneNumber = (s: string) => {
    const d = s.replace(/\D/g, "");
    return (d.length === 11 && d.startsWith("0")) ||
           (d.length === 13 && d.startsWith("234"));
  };
  const recentBenefs = beneficiaries
    .filter((b) => isPhoneNumber(b.account))
    .slice(0, 6)
    .map((b) => ({
      id: b.id,
      name: b.name,
      phone: b.account.replace(/\D/g, ""),
      avatarColor: b.avatarColor,
    }));

  async function handlePinSuccess() {
    setShowPin(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    addTransaction({
      title: `${networkId ? networkId.toUpperCase() : "MTN"} Airtime`,
      subtitle: `₦${numAmount.toLocaleString()} to ${phone}`,
      amount: numAmount,
      type: "debit",
      status: "success",
      category: "Airtime",
      avatarColor: networkId === "mtn" ? "#FFC300" :
                   networkId === "airtel" ? "#E63946" :
                   networkId === "glo" ? "#00B140" : "#00A550",
    });
    setLoading(false);
    router.replace({
      pathname: "/airtime/success",
      params: {
        phone,
        amount: String(numAmount),
        network: networkId ?? "mtn",
        type: "airtime",
      },
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: isDark ? "#111111" : colors.surfaceHigh }]}
          hitSlop={8}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Buy Airtime
        </Text>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? "#111111" : colors.surfaceHigh }]}
          hitSlop={8}
        >
          <HistoryIcon size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Phone section ─────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Enter phone number
          </Text>
          <PhoneCard
            phone={phone}
            onChangePhone={setPhone}
            selfPhone={user?.phone ?? undefined}
            onSelfPress={() => setPhone(user?.phone?.replace(/\D/g, "") ?? "")}
            onContactPress={() => {}}
          />
        </View>

        {/* ── Recent beneficiaries ──────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select beneficiary
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                All beneficiaries
              </Text>
            </TouchableOpacity>
          </View>
          <BeneficiaryStrip
            beneficiaries={recentBenefs}
            onSelect={(p) => setPhone(p)}
            selectedPhone={phone}
          />
        </View>

        {/* ── Amount section ────────────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select amount
            </Text>
          </View>
          <AmountChips
            selected={amount}
            onSelect={(a) => { setAmount(a); setCustom(""); }}
          />
        </View>

        {/* Custom amount input */}
        <View style={styles.customInputWrap}>
          <View style={[styles.customInput, {
            backgroundColor: colors.card,
            borderColor: customAmount ? colors.primary + "80" : colors.border,
          }]}>
            <Text style={[styles.naira, { color: colors.placeholder, fontFamily: "Inter_400Regular" }]}>₦</Text>
            <TextInput
              value={customAmount}
              onChangeText={(t) => { setCustom(t.replace(/[^0-9]/g, "")); setAmount(""); }}
              placeholder="Custom amount"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              style={[styles.customField, { color: colors.text, fontFamily: "Inter_500Medium" }]}
              cursorColor={colors.primary}
            />
          </View>
        </View>

        {/* ── Summary ───────────────────────────────── */}
        {canProceed && (
          <Animated.View style={[styles.sectionPad, summaryStyle]}>
            <SummaryCard
              networkId={networkId}
              phone={phone}
              purchaseType="Airtime"
              amount={numAmount}
              payFrom={`TrustPoint · ${user?.accountNumber?.slice(-4) ?? "****"}`}
            />
          </Animated.View>
        )}

        {/* ── More actions ──────────────────────────── */}
        <View style={styles.sectionPad}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            More actions
          </Text>
          <View style={[styles.moreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TpIcon name="phone" size={18} color={colors.mutedForeground} strokeWidth={1.8} />
            <Text style={[styles.moreText, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              No Network? Dial *5573*3# for airtime
            </Text>
            <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2.2} />
          </View>
        </View>
      </ScrollView>

      {/* ── CTA ───────────────────────────────────────── */}
      <View style={[styles.cta, {
        paddingBottom: bottomPad,
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      }]}>
        <Button
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowPin(true); }}
          disabled={!canProceed}
          loading={loading}
          fullWidth
          size="large"
        >
          {canProceed
            ? `Buy ₦${numAmount.toLocaleString()} Airtime`
            : "Buy Airtime"}
        </Button>
      </View>

      {/* ── PIN sheet ────────────────────────────────── */}
      <PinSheet
        visible={showPin}
        title="Authorize Airtime Purchase"
        subtitle={`Enter your 4-digit PIN to buy ₦${numAmount.toLocaleString()} airtime`}
        onDismiss={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        validatePin={async (p) => login(p)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.4 },
  scroll: { gap: 22, paddingTop: 4 },

  section:       { paddingHorizontal: 20, gap: 12 },
  sectionNoPad:  { gap: 12 },
  sectionPad:    { paddingHorizontal: 20, gap: 12 },
  sectionHeaderPad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sectionLabel: { fontSize: 13 },
  viewAll:      { fontSize: 13 },

  customInputWrap: { paddingHorizontal: 20 },
  customInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 6,
  },
  naira:       { fontSize: 18 },
  customField: { flex: 1, fontSize: 18, padding: 0 },

  moreCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  moreText: { flex: 1, fontSize: 13, lineHeight: 19 },

  cta: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
