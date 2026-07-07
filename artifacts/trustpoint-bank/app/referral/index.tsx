import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

const REFERRAL_CODE = "TRUST2025";

const REFERRALS = [
  { name: "Adebayo K.", date: "Dec 14, 2024", reward: 2000, status: "paid" },
  { name: "Chioma N.", date: "Dec 10, 2024", reward: 2000, status: "paid" },
  { name: "Emeka O.", date: "Dec 1, 2024", reward: 2000, status: "pending" },
];

export default function ReferralScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [copied, setCopied] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const handleCopy = async () => {
    await Clipboard.setStringAsync(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    await Share.share({
      message: `Join TrustPoint Bank and earn ₦2,000! Use my referral code: ${REFERRAL_CODE}\nDownload now at trustpoint.ng`,
    });
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
          Referrals & Rewards
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <TpIcon name="gift" size={36} color="#fff" strokeWidth={1.5} />
          <Text style={[styles.heroTitle, { fontFamily: "Inter_700Bold" }]}>Earn ₦2,000 per referral</Text>
          <Text style={[styles.heroSub, { fontFamily: "Inter_400Regular" }]}>
            Invite friends to TrustPoint Bank. You both earn when they sign up and make their first transaction.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.text, fontFamily: "Inter_700Bold" }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Total Referrals</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.success, fontFamily: "Inter_700Bold" }]}>₦4,000</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Total Earned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.warning, fontFamily: "Inter_700Bold" }]}>₦2,000</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Pending</Text>
          </View>
        </View>

        {/* Code */}
        <View style={[styles.codeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.codeLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Your Referral Code
          </Text>
          <View style={styles.codeRow}>
            <Text style={[styles.code, { color: colors.primary, fontFamily: "Inter_700Bold" }]}>
              {REFERRAL_CODE}
            </Text>
            <Pressable
              onPress={handleCopy}
              style={[styles.copyBtn, { backgroundColor: colors.primary + "18" }]}
            >
              <TpIcon
                name={copied ? "check" : "copy"}
                size={16}
                color={copied ? colors.success : colors.primary}
                strokeWidth={2}
              />
              <Text style={[styles.copyText, { color: copied ? colors.success : colors.primary, fontFamily: "Inter_500Medium" }]}>
                {copied ? "Copied!" : "Copy"}
              </Text>
            </Pressable>
          </View>
          <Pressable
            onPress={handleShare}
            style={[styles.shareBtn, { backgroundColor: colors.primary }]}
          >
            <TpIcon name="share-2" size={18} color="#fff" strokeWidth={1.8} />
            <Text style={[styles.shareBtnText, { fontFamily: "Inter_600SemiBold" }]}>
              Share Invite Link
            </Text>
          </Pressable>
        </View>

        {/* How it works */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            How it works
          </Text>
          {[
            { step: "1", text: "Share your unique referral code with friends" },
            { step: "2", text: "They sign up using your code" },
            { step: "3", text: "They complete their first transaction" },
            { step: "4", text: "You both earn ₦2,000 instantly!" },
          ].map((s) => (
            <View key={s.step} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumText, { fontFamily: "Inter_700Bold" }]}>{s.step}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
                {s.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Referral history */}
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Referral History
          </Text>
          <View style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {REFERRALS.map((r, idx) => (
              <React.Fragment key={idx}>
                <View style={styles.historyRow}>
                  <View>
                    <Text style={[styles.historyName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {r.name}
                    </Text>
                    <Text style={[styles.historyDate, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {r.date}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.historyReward, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                      +₦{r.reward.toLocaleString()}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: r.status === "paid" ? colors.success + "20" : colors.warning + "20" }]}>
                      <Text style={[styles.statusText, { color: r.status === "paid" ? colors.success : colors.warning, fontFamily: "Inter_500Medium" }]}>
                        {r.status === "paid" ? "Paid" : "Pending"}
                      </Text>
                    </View>
                  </View>
                </View>
                {idx < REFERRALS.length - 1 && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>
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
  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 4 },
  heroCard: {
    borderRadius: 24,
    padding: 28,
    gap: 12,
    alignItems: "center",
  },
  heroTitle: { fontSize: 22, color: "#fff", textAlign: "center", letterSpacing: -0.5 },
  heroSub: { fontSize: 13.5, color: "#ffffffBB", textAlign: "center", lineHeight: 20 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 18, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, textAlign: "center" },
  codeCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  codeLabel: { fontSize: 13 },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  code: { fontSize: 28, letterSpacing: 4 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyText: { fontSize: 13 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shareBtnText: { color: "#fff", fontSize: 15 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3, marginBottom: 12 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 14 },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepNumText: { color: "#fff", fontSize: 13 },
  stepText: { flex: 1, fontSize: 14, lineHeight: 20, paddingTop: 4 },
  historyCard: { borderRadius: 16, borderWidth: 1, padding: 4, paddingHorizontal: 16 },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  historyName: { fontSize: 14, marginBottom: 3 },
  historyDate: { fontSize: 12 },
  historyReward: { fontSize: 15, marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 11 },
  sep: { height: 0.5 },
});
