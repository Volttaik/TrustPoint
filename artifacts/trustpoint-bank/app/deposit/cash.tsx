import React from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const STEPS = [
  {
    num: "1",
    title: "Locate a TrustPoint Agent",
    body: "Find any TrustPoint Bank agent or approved merchant near you using the locator below.",
  },
  {
    num: "2",
    title: "Provide your account number",
    body: "Give the agent your 10-digit TrustPoint account number and the amount you want to deposit.",
  },
  {
    num: "3",
    title: "Pay the agent",
    body: "Hand over the cash. The agent will process your deposit immediately.",
  },
  {
    num: "4",
    title: "Receive confirmation",
    body: "You'll get a notification as soon as the funds land in your account — usually within seconds.",
  },
];

const FAQS = [
  {
    q: "Is there a minimum deposit amount?",
    a: "Yes. The minimum cash deposit via agents is ₦500.",
  },
  {
    q: "Are there any agent fees?",
    a: "Agent fees vary by location, typically between ₦50 and ₦200 per transaction.",
  },
  {
    q: "What if I don't get a notification?",
    a: "Wait 5 minutes then contact our support team with your deposit reference and we'll resolve it immediately.",
  },
  {
    q: "Can I deposit on weekends?",
    a: "Yes. TrustPoint agents operate 7 days a week including public holidays.",
  },
];

export default function CashDepositScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background === "#000000" || colors.background === "#0A0A0A";

  const accountNumber = user?.accountNumber ?? "1234567890";
  const depositRef    = "CASH-" + accountNumber.slice(-6);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Cash Deposit
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/icons/funding_platform.webp")}
            style={styles.heroIllus}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Deposit Cash via Agent
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Fund your TrustPoint account by visiting any approved agent or merchant nearby.
          </Text>
        </View>

        {/* Deposit reference */}
        <View style={[styles.refCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.refTop}>
            <View style={[styles.refIcon, { backgroundColor: colors.primary + "14" }]}>
              <TpIcon name="file-text" size={20} color={colors.primary} strokeWidth={1.8} />
            </View>
            <View style={styles.refInfo}>
              <Text style={[styles.refLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Your Deposit Reference
              </Text>
              <Text style={[styles.refValue, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {depositRef}
              </Text>
            </View>
          </View>
          <Text style={[styles.refNote, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Provide this reference to the agent to ensure your deposit is linked to your account.
          </Text>
        </View>

        {/* Agent locator placeholder */}
        <View style={[styles.locatorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.locatorHeader}>
            <TpIcon name="map-pin" size={18} color={colors.primary} strokeWidth={1.8} />
            <Text style={[styles.locatorTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Find a Nearby Agent
            </Text>
          </View>
          <View style={[styles.locatorMap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image
              source={require("@/assets/icons/dollar_location.webp")}
              style={styles.locatorIllus}
              resizeMode="contain"
            />
            <Text style={[styles.locatorPlaceholder, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Agent locator coming soon
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Linking.openURL("https://trustpoint.ng/agents")}
            style={[styles.locatorBtn, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}
          >
            <TpIcon name="map" size={16} color={colors.primary} strokeWidth={1.8} />
            <Text style={[styles.locatorBtnTxt, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Find Agents on Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Step-by-step */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            How it works
          </Text>
          <View style={[styles.stepsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.num}>
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNum, { fontFamily: "Inter_700Bold" }]}>{s.num}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {s.title}
                    </Text>
                    <Text style={[styles.stepBody, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {s.body}
                    </Text>
                  </View>
                </View>
                {idx < STEPS.length - 1 && (
                  <View style={[styles.stepSep, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Things to Know
          </Text>
          <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {FAQS.map((faq, idx) => (
              <React.Fragment key={idx}>
                <View style={styles.faqItem}>
                  <View style={[styles.faqDot, { backgroundColor: colors.primary }]} />
                  <View style={styles.faqContent}>
                    <Text style={[styles.faqQ, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {faq.q}
                    </Text>
                    <Text style={[styles.faqA, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {faq.a}
                    </Text>
                  </View>
                </View>
                {idx < FAQS.length - 1 && (
                  <View style={[styles.faqSep, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Help & Support */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/settings/help")}
          style={[styles.helpBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={[styles.helpIcon, { backgroundColor: colors.primary + "14" }]}>
            <TpIcon name="headset" size={20} color={colors.primary} strokeWidth={1.8} />
          </View>
          <View style={styles.helpText}>
            <Text style={[styles.helpLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Help & Support
            </Text>
            <Text style={[styles.helpSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Issues with a cash deposit? We're here 24/7
            </Text>
          </View>
          <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },

  /* Hero */
  heroSection: { alignItems: "center", paddingVertical: 8, gap: 12 },
  heroIllus:   { width: 100, height: 100 },
  heroTitle:   { fontSize: 22, letterSpacing: -0.5, textAlign: "center" },
  heroSub:     { fontSize: 13.5, textAlign: "center", lineHeight: 20, maxWidth: 300 },

  /* Reference card */
  refCard: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 12 },
  refTop:  { flexDirection: "row", alignItems: "center", gap: 14 },
  refIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  refInfo: { flex: 1, gap: 3 },
  refLabel:  { fontSize: 12 },
  refValue:  { fontSize: 20, letterSpacing: 1.5 },
  refNote:   { fontSize: 12.5, lineHeight: 18 },

  /* Locator */
  locatorCard:   { borderRadius: 20, borderWidth: 1, padding: 20, gap: 14 },
  locatorHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  locatorTitle:  { fontSize: 15 },
  locatorMap: {
    height: 140, borderRadius: 14, borderWidth: 1,
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  locatorIllus:       { width: 64, height: 64 },
  locatorPlaceholder: { fontSize: 13 },
  locatorBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 13, borderRadius: 12, borderWidth: 1,
  },
  locatorBtnTxt: { fontSize: 14 },

  /* Steps */
  sectionBlock: { gap: 14 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  stepsCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  stepRow: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 14, padding: 20,
  },
  stepBadge: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepNum: { color: "#fff", fontSize: 13 },
  stepContent: { flex: 1, gap: 4, paddingTop: 3 },
  stepTitle:   { fontSize: 14 },
  stepBody:    { fontSize: 13, lineHeight: 19 },
  stepSep:     { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },

  /* FAQ */
  faqCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  faqItem: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 14, padding: 20,
  },
  faqDot: { width: 7, height: 7, borderRadius: 3.5, marginTop: 5, flexShrink: 0 },
  faqContent: { flex: 1, gap: 5 },
  faqQ: { fontSize: 14 },
  faqA: { fontSize: 13, lineHeight: 19 },
  faqSep: { height: StyleSheet.hairlineWidth, marginHorizontal: 20 },

  /* Help */
  helpBtn: {
    flexDirection: "row", alignItems: "center",
    gap: 14, padding: 18, borderRadius: 18, borderWidth: 1,
  },
  helpIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  helpText: { flex: 1, gap: 3 },
  helpLabel: { fontSize: 15 },
  helpSub:   { fontSize: 12.5 },
});
