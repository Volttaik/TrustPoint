import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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
import { PlanCategoryChips } from "@/components/airtime/PlanCategoryChips";
import { PlanCard } from "@/components/airtime/PlanCard";
import { SummaryCard } from "@/components/airtime/SummaryCard";
import { PinSheet } from "@/components/airtime/PinSheet";
import { PlanCardSkeleton } from "@/components/airtime/PurchaseSkeletons";
import { NetworkSelectorStrip } from "@/components/airtime/NetworkSelectorStrip";
import { detectNetwork, type NetworkId } from "@/components/airtime/networkDetect";
import { DATA_PLANS, type PlanCategory } from "@/components/airtime/dataPlanData";

export default function DataScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, beneficiaries, addTransaction, login } = useApp();
  const isDark  = colors.background !== "#F4F5F7";

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24;

  const [phone, setPhone]               = useState("");
  const [manualNetId, setManualNetId]   = useState<NetworkId | null>(null);
  const [category, setCategory]         = useState<PlanCategory>("hot-deals");
  const [planId, setPlanId]             = useState<string | null>(null);
  const [showPin, setShowPin]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [planLoading, setPlanLoading]   = useState(false);

  /* Resolved network */
  const autoNetId = phone.length >= 4 ? detectNetwork(phone) : null;
  const netId: NetworkId = (manualNetId ?? autoNetId ?? "mtn") as NetworkId;

  const plans    = DATA_PLANS[netId]?.[category] ?? [];
  const selected = plans.find((p) => p.id === planId) ?? null;
  const canProceed = phone.replace(/\D/g, "").length >= 10 && !!selected;

  /* Summary fade */
  const summaryOpacity = useSharedValue(0);
  const summaryStyle   = useAnimatedStyle(() => ({ opacity: summaryOpacity.value }));
  useEffect(() => {
    summaryOpacity.value = withTiming(canProceed ? 1 : 0, { duration: 220 });
  }, [canProceed]);

  /* Simulate plan loading on category/network change */
  useEffect(() => {
    setPlanId(null);
    setPlanLoading(true);
    const t = setTimeout(() => setPlanLoading(false), 400);
    return () => clearTimeout(t);
  }, [category, netId]);

  const isPhone = (s: string) => {
    const d = s.replace(/\D/g, "");
    return (d.length === 11 && d.startsWith("0")) || (d.length === 13 && d.startsWith("234"));
  };
  const recentBenefs = beneficiaries
    .filter((b) => isPhone(b.account))
    .slice(0, 6)
    .map((b) => ({ id: b.id, name: b.name, phone: b.account.replace(/\D/g, ""), avatarColor: b.avatarColor }));

  async function handlePinSuccess() {
    if (!selected) return;
    setShowPin(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    addTransaction({
      title: `${netId.toUpperCase()} Data`,
      subtitle: `${selected.size} to ${phone}`,
      amount: selected.price,
      type: "debit",
      status: "success",
      category: "Data",
      avatarColor: netId === "mtn" ? "#FFC300" : netId === "airtel" ? "#E63946" : netId === "glo" ? "#00B140" : "#00A550",
    });
    setLoading(false);
    router.replace({ pathname: "/data/success", params: { phone, amount: String(selected.price), network: netId, type: "data", plan: selected.size, validity: selected.validity } });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Decorative header background ─────────── */}
      <View style={styles.headerDecorArea} pointerEvents="none">
        <View style={styles.decorBg}>
          <TpIcon name="wifi" size={190} color={colors.primary} strokeWidth={0.6} />
        </View>
        <View style={styles.decorFg}>
          <TpIcon name="radio" size={68} color={colors.primary} strokeWidth={1.2} />
        </View>
      </View>

      {/* ── Header ──────────────────────────────── */}
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
            Buy Data
          </Text>
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
        {/* ── Phone ───────────────────────────── */}
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
            networkId={netId === "mtn" && !manualNetId && !autoNetId ? null : netId}
            onNetworkDetected={(id) => { if (id && !manualNetId) setManualNetId(id); }}
          />
        </View>

        {/* ── Network selector — always visible ── */}
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

        {/* ── Recent beneficiaries ────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Recent recipients
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>
          <BeneficiaryStrip
            beneficiaries={recentBenefs}
            onSelect={(p) => { setPhone(p); setManualNetId(null); }}
            selectedPhone={phone}
          />
        </View>

        {/* ── Plan categories ─────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select a plan
            </Text>
          </View>
          <PlanCategoryChips selected={category} onSelect={(c) => setCategory(c)} />
        </View>

        {/* ── Plan grid ───────────────────────── */}
        <View style={styles.sectionPad}>
          {planLoading ? (
            <PlanCardSkeleton />
          ) : plans.length === 0 ? (
            <View style={[styles.emptyPlans, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TpIcon name="wifi" size={28} color={colors.mutedForeground} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                No plans for this category
              </Text>
            </View>
          ) : (
            <View style={styles.planGrid}>
              {plans.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  selected={planId === p.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setPlanId(p.id);
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* ── Summary ─────────────────────────── */}
        {canProceed && selected && (
          <Animated.View style={[styles.sectionPad, summaryStyle]}>
            <SummaryCard
              networkId={netId}
              phone={phone}
              purchaseType="Data"
              planLabel={`${selected.size} · ${selected.validity}`}
              amount={selected.price}
              payFrom={`TrustPoint · ${user?.accountNumber?.slice(-4) ?? "****"}`}
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* ── CTA ─────────────────────────────────── */}
      <View style={[styles.cta, { paddingBottom: bottomPad, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowPin(true); }}
          disabled={!canProceed}
          loading={loading}
          fullWidth
          size="large"
        >
          {selected ? `Buy ${selected.size} for ₦${selected.price.toLocaleString()}` : "Buy Data"}
        </Button>
      </View>

      <PinSheet
        visible={showPin}
        title="Authorize Data Purchase"
        subtitle={selected ? `${selected.size} to ${phone}` : "Enter your 4-digit PIN"}
        onDismiss={() => setShowPin(false)}
        onSuccess={handlePinSuccess}
        validatePin={async (p) => login(p)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  headerDecorArea: {
    position: "absolute",
    top: 0, right: 0,
    width: 200,
    height: 200,
    overflow: "hidden",
    zIndex: 0,
  },
  decorBg: {
    position: "absolute",
    top: -20,
    right: -50,
    opacity: 0.035,
    transform: [{ rotate: "-15deg" }],
  },
  decorFg: {
    position: "absolute",
    bottom: 20,
    left: 10,
    opacity: 0.07,
    transform: [{ rotate: "10deg" }],
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

  planGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  emptyPlans: {
    borderRadius: 14, borderWidth: 1,
    paddingVertical: 32,
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 13, textAlign: "center" },

  cta: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
