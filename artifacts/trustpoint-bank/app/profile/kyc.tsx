import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TIERS = [
  {
    tier: 1,
    name: "Basic",
    limit: "₦50,000/day",
    requirements: ["Phone Number", "Full Name"],
    completed: true,
    color: "#34C759",
  },
  {
    tier: 2,
    name: "Standard",
    limit: "₦500,000/day",
    requirements: ["BVN Verification", "Valid ID (NIN/Passport/Driver's License)", "Selfie"],
    completed: false,
    color: "#007AFF",
  },
  {
    tier: 3,
    name: "Premium",
    limit: "₦5,000,000/day",
    requirements: ["Tier 2 Completed", "Proof of Address", "Utility Bill"],
    completed: false,
    color: "#FF9500",
  },
];

export default function KYCScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [bvn, setBvn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const handleSubmitBvn = async () => {
    if (bvn.length !== 11) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Account Upgrade
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.currentTier, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <Text style={[styles.currentLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Current Tier
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={[styles.currentTierName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Tier {user?.tier ?? 1} — Basic
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: "#34C759" + "25" }]}>
              <TpIcon name="check-circle" size={13} color="#34C759" strokeWidth={2} />
              <Text style={[styles.tierBadgeText, { color: "#34C759", fontFamily: "Inter_600SemiBold" }]}>Active</Text>
            </View>
          </View>
          <Text style={[styles.currentLimit, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Daily transfer limit: ₦50,000
          </Text>
        </View>

        {TIERS.map((tier) => (
          <View
            key={tier.tier}
            style={[
              styles.tierCard,
              {
                backgroundColor: tier.completed ? colors.card : colors.card,
                borderColor: tier.completed ? tier.color + "60" : colors.border,
              },
            ]}
          >
            <View style={styles.tierTop}>
              <View style={[styles.tierNum, { backgroundColor: tier.color + "20" }]}>
                <Text style={[styles.tierNumText, { color: tier.color, fontFamily: "Inter_700Bold" }]}>
                  {tier.tier}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={[styles.tierName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                    Tier {tier.tier} — {tier.name}
                  </Text>
                  {tier.completed && (
                    <TpIcon name="check-circle" size={16} color={tier.color} strokeWidth={2} />
                  )}
                </View>
                <Text style={[styles.tierLimit, { color: tier.color, fontFamily: "Inter_600SemiBold" }]}>
                  {tier.limit} limit
                </Text>
              </View>
            </View>

            <View style={styles.requirements}>
              {tier.requirements.map((req) => (
                <View key={req} style={styles.reqRow}>
                  <TpIcon
                    name={tier.completed ? "check-circle" : "info"}
                    size={14}
                    color={tier.completed ? tier.color : colors.mutedForeground}
                    strokeWidth={2}
                  />
                  <Text style={[styles.reqText, { color: tier.completed ? tier.color : colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {req}
                  </Text>
                </View>
              ))}
            </View>

            {tier.tier === 2 && !tier.completed && (
              <View style={{ gap: 12 }}>
                {submitted ? (
                  <View style={[styles.submittedBanner, { backgroundColor: colors.success + "18", borderColor: colors.success }]}>
                    <TpIcon name="check-circle" size={16} color={colors.success} strokeWidth={1.8} />
                    <Text style={[styles.submittedText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                      BVN submitted for verification!
                    </Text>
                  </View>
                ) : (
                  <>
                    <Input
                      label="BVN"
                      value={bvn}
                      onChangeText={(t) => setBvn(t.replace(/\D/g, "").slice(0, 11))}
                      keyboardType="number-pad"
                      placeholder="11-digit BVN"
                      prefixIcon={<TpIcon name="shield" size={18} color={colors.placeholder} strokeWidth={1.8} />}
                    />
                    <Button
                      onPress={handleSubmitBvn}
                      loading={submitting}
                      disabled={bvn.length !== 11}
                      fullWidth
                    >
                      Verify BVN & Upgrade
                    </Button>
                  </>
                )}
              </View>
            )}

            {tier.tier === 3 && !tier.completed && (
              <Pressable style={[styles.upgradeBtn, { borderColor: tier.color + "50", backgroundColor: tier.color + "10" }]}>
                <Text style={[styles.upgradeBtnText, { color: tier.color, fontFamily: "Inter_600SemiBold" }]}>
                  Complete Tier 2 first
                </Text>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 20, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  currentTier: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 6 },
  currentLabel: { fontSize: 12 },
  currentTierName: { fontSize: 18, letterSpacing: -0.3 },
  tierBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tierBadgeText: { fontSize: 11 },
  currentLimit: { fontSize: 13 },
  tierCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  tierTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  tierNum: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  tierNumText: { fontSize: 18 },
  tierName: { fontSize: 15, letterSpacing: -0.3 },
  tierLimit: { fontSize: 13, marginTop: 2 },
  requirements: { gap: 8 },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reqText: { fontSize: 13 },
  submittedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  submittedText: { fontSize: 14 },
  upgradeBtn: { padding: 12, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  upgradeBtnText: { fontSize: 13 },
});
