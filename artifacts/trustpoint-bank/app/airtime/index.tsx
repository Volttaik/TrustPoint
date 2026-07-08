import React, { useEffect, useState } from "react";
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
  Easing,
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
import { NetworkSelectorStrip } from "@/components/airtime/NetworkSelectorStrip";
import { detectNetwork, type NetworkId } from "@/components/airtime/networkDetect";

export default function AirtimeScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, beneficiaries, addTransaction, login } = useApp();
  const isDark  = colors.background !== "#F4F5F7";

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24;

  const [phone, setPhone]           = useState("");
  const [manualNetId, setManualNetId] = useState<NetworkId | null>(null);
  const [amount, setAmount]         = useState("");
  const [customAmount, setCustom]   = useState("");
  const [showPin, setShowPin]       = useState(false);
  const [loading, setLoading]       = useState(false);

  /* Resolved network: manual override wins over auto-detection */
  const autoNetId = phone.length >= 4 ? detectNetwork(phone) : null;
  const netId     = (manualNetId ?? autoNetId) as NetworkId | null;

  /* Sync auto-detection → strip selection (only if no manual override) */
  const handleNetworkDetected = (id: NetworkId | null) => {
    if (id && !manualNetId) setManualNetId(id);
  };

  const numAmount = parseInt(amount || customAmount || "0", 10);
  const canProceed = phone.replace(/\D/g, "").length >= 10 && numAmount >= 50;

  /* Summary fade */
  const summaryOpacity = useSharedValue(0);
  const summaryStyle   = useAnimatedStyle(() => ({ opacity: summaryOpacity.value }));
  useEffect(() => {
    summaryOpacity.value = withTiming(canProceed ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [canProceed]);

  /* Beneficiaries: phone-pattern entries only */
  const isPhone = (s: string) => {
    const d = s.replace(/\D/g, "");
    return (d.length === 11 && d.startsWith("0")) || (d.length === 13 && d.startsWith("234"));
  };
  const recentBenefs = beneficiaries
    .filter((b) => isPhone(b.account))
    .slice(0, 6)
    .map((b) => ({ id: b.id, name: b.name, phone: b.account.replace(/\D/g, ""), avatarColor: b.avatarColor }));

  async function handlePinSuccess() {
    setShowPin(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    addTransaction({
      title: `${netId ? netId.toUpperCase() : "MTN"} Airtime`,
      subtitle: `₦${numAmount.toLocaleString()} to ${phone}`,
      amount: numAmount,
      type: "debit",
      status: "success",
      category: "Airtime",
      avatarColor: netId === "mtn" ? "#FFC300" : netId === "airtel" ? "#E63946" : netId === "glo" ? "#00B140" : "#00A550",
    });
    setLoading(false);
    router.replace({ pathname: "/airtime/success", params: { phone, amount: String(numAmount), network: netId ?? "mtn", type: "airtime" } });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Decorative header background ─────────── */}
      <View style={[styles.headerDecorArea, { paddingTop: topPad }]} pointerEvents="none">
        {/* Large faint icon — depth layer 1 */}
        <View style={styles.decorBg}>
          <TpIcon name="phone" size={180} color={colors.primary} strokeWidth={0.6} />
        </View>
        {/* Smaller overlapping icon — depth layer 2 */}
        <View style={styles.decorFg}>
          <TpIcon name="signal" size={72} color={colors.primary} strokeWidth={1.2} />
        </View>
      </View>

      {/* ── Header ────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: isDark ? "#111111" : colors.surfaceHigh }]}
          hitSlop={8}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.titleWrap}>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Buy Airtime
          </Text>
          {/* Small accent dot */}
          <View style={[styles.titleAccent, { backgroundColor: colors.primary }]} />
        </View>

        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: isDark ? "#111111" : colors.surfaceHigh }]}
          hitSlop={8}
        >
          <TpIcon name="clock" size={18} color={colors.mutedForeground} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Phone input ───────────────────────── */}
        <View style={styles.sectionPad}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Enter phone number
          </Text>
          <PhoneCard
            phone={phone}
            onChangePhone={(p) => { setPhone(p); setManualNetId(null); }}
            selfPhone={user?.phone ?? undefined}
            onSelfPress={() => setPhone(user?.phone?.replace(/\D/g, "") ?? "")}
            onContactPress={() => {}}
            networkId={netId}
            onNetworkDetected={handleNetworkDetected}
          />
        </View>

        {/* ── Network selector ─────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select network
            </Text>
          </View>
          <NetworkSelectorStrip
            selected={netId}
            onSelect={(id) => setManualNetId(id)}
          />
        </View>

        {/* ── Beneficiaries ────────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Recent recipients
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                All
              </Text>
            </TouchableOpacity>
          </View>
          <BeneficiaryStrip beneficiaries={recentBenefs} onSelect={(p) => setPhone(p)} selectedPhone={phone} />
        </View>

        {/* ── Amount ───────────────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select amount
            </Text>
          </View>
          <AmountChips selected={amount} onSelect={(a) => { setAmount(a); setCustom(""); }} />
        </View>

        {/* Custom amount */}
        <View style={styles.sectionPad}>
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
              style={[
                styles.customField,
                { color: colors.text, fontFamily: "Inter_500Medium" },
                Platform.OS === "web" && ({ outlineWidth: 0 } as any),
              ]}
              cursorColor={colors.primary}
            />
          </View>
        </View>

        {/* ── Summary ──────────────────────────── */}
        {canProceed && (
          <Animated.View style={[styles.sectionPad, summaryStyle]}>
            <SummaryCard
              networkId={netId}
              phone={phone}
              purchaseType="Airtime"
              amount={numAmount}
              payFrom={`TrustPoint · ${user?.accountNumber?.slice(-4) ?? "****"}`}
            />
          </Animated.View>
        )}

        {/* ── Info ─────────────────────────────── */}
        <View style={styles.sectionPad}>
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TpIcon name="phone" size={16} color={colors.mutedForeground} strokeWidth={1.8} />
            <Text style={[styles.infoText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              No Network? Dial *5573*3# for airtime
            </Text>
            <TpIcon name="chevron-right" size={14} color={colors.mutedForeground} strokeWidth={2.2} />
          </View>
        </View>
      </ScrollView>

      {/* ── CTA ───────────────────────────────── */}
      <View style={[styles.cta, { paddingBottom: bottomPad, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowPin(true); }}
          disabled={!canProceed}
          loading={loading}
          fullWidth
          size="large"
        >
          {canProceed ? `Buy ₦${numAmount.toLocaleString()} Airtime` : "Buy Airtime"}
        </Button>
      </View>

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
  root: { flex: 1 },

  /* Decorative background elements */
  headerDecorArea: {
    position: "absolute",
    top: 0, right: 0,
    width: 200,
    height: 200,
    overflow: "hidden",
    zIndex: 0,
    pointerEvents: "none" as any,
  },
  decorBg: {
    position: "absolute",
    top: -20,
    right: -50,
    opacity: 0.035,
    transform: [{ rotate: "15deg" }],
  },
  decorFg: {
    position: "absolute",
    bottom: 20,
    left: 10,
    opacity: 0.07,
    transform: [{ rotate: "-10deg" }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 1,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: "center", justifyContent: "center",
  },
  titleWrap: { alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 18, letterSpacing: -0.4 },
  titleAccent: { width: 18, height: 2, borderRadius: 1, opacity: 0.8 },

  scroll: { gap: 22, paddingTop: 4 },

  sectionPad:       { paddingHorizontal: 20, gap: 12 },
  sectionNoPad:     { gap: 12 },
  sectionHeaderPad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label:   { fontSize: 13 },
  viewAll: { fontSize: 13 },

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

  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },

  cta: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
