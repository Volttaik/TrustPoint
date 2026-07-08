import React, { useState } from "react";
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
import { detectNetwork, NETWORK_LIST } from "@/components/airtime/networkDetect";
import { NetworkLogo } from "@/components/airtime/NetworkLogo";
import { DATA_PLANS, type PlanCategory } from "@/components/airtime/dataPlanData";
import type { NetworkId } from "@/components/airtime/networkDetect";

/* inline HistoryIcon */
function HistoryIcon({ size = 20, color }: { size?: number; color: string }) {
  const Svg  = require("react-native-svg").default;
  const Path = require("react-native-svg").Path;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12A9 9 0 1 0 12 3M3 12H7M3 12V8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 7.5V12.5L15 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

export default function DataScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, beneficiaries, addTransaction, login } = useApp();
  const isDark  = colors.background !== "#F4F5F7";

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0) + 24;

  const [phone, setPhone]             = useState("");
  const [selectedNetId, setSelectedNetId] = useState<NetworkId | null>(null);
  const [category, setCategory]       = useState<PlanCategory>("hot-deals");
  const [planId, setPlanId]           = useState<string | null>(null);
  const [showPin, setShowPin]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  /* Resolve active network: auto-detected or manually chosen */
  const autoNetId = phone.length >= 4 ? detectNetwork(phone) : null;
  const netId: NetworkId = (autoNetId ?? selectedNetId ?? "mtn") as NetworkId;

  const plans    = DATA_PLANS[netId]?.[category] ?? [];
  const selected = plans.find((p) => p.id === planId) ?? null;

  const canProceed = phone.length >= 10 && !!selected;

  /* Summary visibility */
  const summaryOpacity = useSharedValue(0);
  const summaryStyle   = useAnimatedStyle(() => ({ opacity: summaryOpacity.value }));
  React.useEffect(() => {
    summaryOpacity.value = withTiming(canProceed ? 1 : 0, { duration: 220 });
  }, [canProceed]);

  /* Simulate plan loading on category/network change */
  React.useEffect(() => {
    setPlanId(null);
    setPlanLoading(true);
    const t = setTimeout(() => setPlanLoading(false), 500);
    return () => clearTimeout(t);
  }, [category, netId]);

  const isPhoneNumber = (s: string) => {
    const d = s.replace(/\D/g, "");
    return (d.length === 11 && d.startsWith("0")) ||
           (d.length === 13 && d.startsWith("234"));
  };
  const recentBenefs = beneficiaries
    .filter((b) => isPhoneNumber(b.account))
    .slice(0, 6)
    .map((b) => ({
      id: b.id, name: b.name,
      phone: b.account.replace(/\D/g, ""),
      avatarColor: b.avatarColor,
    }));

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
    router.replace({
      pathname: "/data/success",
      params: {
        phone,
        amount: String(selected.price),
        network: netId,
        type: "data",
        plan: selected.size,
        validity: selected.validity,
      },
    });
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ──────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: isDark ? "#111111" : colors.surfaceHigh }]}
          hitSlop={8}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Buy Data
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
        {/* ── Phone section ───────────────────────── */}
        <View style={styles.sectionPad}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Enter phone number
          </Text>
          <PhoneCard
            phone={phone}
            onChangePhone={(p) => { setPhone(p); setSelectedNetId(null); }}
            selfPhone={user?.phone ?? undefined}
            onSelfPress={() => setPhone(user?.phone?.replace(/\D/g, "") ?? "")}
            onContactPress={() => {}}
          />
        </View>

        {/* ── Manual network selection (when auto-detect fails) ── */}
        {phone.length >= 4 && !autoNetId && (
          <View style={styles.sectionPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select network
            </Text>
            <View style={styles.networkGrid}>
              {NETWORK_LIST.map((net) => (
                <TouchableOpacity
                  key={net.id}
                  onPress={() => { setSelectedNetId(net.id); setPlanId(null); }}
                  style={[
                    styles.networkCard,
                    {
                      backgroundColor: selectedNetId === net.id ? net.color + "18" : colors.card,
                      borderColor: selectedNetId === net.id ? net.color + "80" : colors.border,
                    },
                  ]}
                >
                  <NetworkLogo id={net.id} size={36} />
                  <Text style={[
                    styles.networkName,
                    { color: selectedNetId === net.id ? net.color : colors.text, fontFamily: "Inter_600SemiBold" },
                  ]}>
                    {net.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ── Recent beneficiaries ────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Recent beneficiaries
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>
          <BeneficiaryStrip
            beneficiaries={recentBenefs}
            onSelect={(p) => { setPhone(p); setSelectedNetId(null); }}
            selectedPhone={phone}
          />
        </View>

        {/* ── Plan categories ─────────────────────── */}
        <View style={styles.sectionNoPad}>
          <View style={styles.sectionHeaderPad}>
            <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select a data plan
            </Text>
          </View>
          <PlanCategoryChips
            selected={category}
            onSelect={(c) => setCategory(c)}
          />
        </View>

        {/* ── Plan grid ───────────────────────────── */}
        <View style={styles.sectionPad}>
          {planLoading ? (
            <PlanCardSkeleton />
          ) : plans.length === 0 ? (
            <View style={[styles.emptyPlans, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <TpIcon name="wifi" size={28} color={colors.mutedForeground} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                No plans available for this category
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

        {/* ── Summary ─────────────────────────────── */}
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

      {/* ── CTA ─────────────────────────────────────── */}
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
          {selected
            ? `Buy ${selected.size} for ₦${selected.price.toLocaleString()}`
            : "Buy Data"}
        </Button>
      </View>

      {/* ── PIN sheet ─────────────────────────────── */}
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

  sectionPad:    { paddingHorizontal: 20, gap: 12 },
  sectionNoPad:  { gap: 12 },
  sectionHeaderPad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label:   { fontSize: 13 },
  viewAll: { fontSize: 13 },

  networkGrid: { flexDirection: "row", gap: 10 },
  networkCard: {
    flex: 1, alignItems: "center", gap: 8,
    paddingVertical: 14, borderRadius: 14, borderWidth: 1.5,
  },
  networkName: { fontSize: 12 },

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
