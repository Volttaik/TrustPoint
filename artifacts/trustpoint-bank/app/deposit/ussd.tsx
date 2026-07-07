import React, { useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const BANKS = [
  { id: "gtbank",   name: "GTBank",        shortCode: "*737#",  fullCode: "*737*Amount*AccountNumber#",  color: "#F58220" },
  { id: "access",   name: "Access Bank",   shortCode: "*901#",  fullCode: "*901*Amount*AccountNumber#",  color: "#E31837" },
  { id: "firstbank",name: "First Bank",    shortCode: "*894#",  fullCode: "*894*Amount*AccountNumber#",  color: "#00A3E0" },
  { id: "zenith",   name: "Zenith Bank",   shortCode: "*966#",  fullCode: "*966*Amount*AccountNumber#",  color: "#E6122E" },
  { id: "uba",      name: "UBA",           shortCode: "*919#",  fullCode: "*919*Amount*AccountNumber#",  color: "#ED1C24" },
  { id: "fcmb",     name: "FCMB",          shortCode: "*329#",  fullCode: "*329*Amount*AccountNumber#",  color: "#B01116" },
  { id: "wema",     name: "Wema Bank",     shortCode: "*945#",  fullCode: "*945*Amount*AccountNumber#",  color: "#6F2D93" },
  { id: "sterling", name: "Sterling Bank", shortCode: "*822#",  fullCode: "*822*Amount*AccountNumber#",  color: "#B01116" },
  { id: "fidelity", name: "Fidelity Bank", shortCode: "*770#",  fullCode: "*770*Amount*AccountNumber#",  color: "#026C00" },
  { id: "polaris",  name: "Polaris Bank",  shortCode: "*833#",  fullCode: "*833*Amount*AccountNumber#",  color: "#00529B" },
  { id: "stanbic",  name: "Stanbic IBTC",  shortCode: "*909#",  fullCode: "*909*Amount*AccountNumber#",  color: "#009FDF" },
  { id: "union",    name: "Union Bank",    shortCode: "*826#",  fullCode: "*826*Amount*AccountNumber#",  color: "#003087" },
];

const AFTER_DIAL = [
  "Select your preferred language from the menu.",
  "Choose \"Transfer\" or \"Fund Transfer\" from options.",
  "Enter the amount you wish to transfer.",
  'Enter TrustPoint Bank account number when prompted.',
  "Confirm the details and enter your PIN to complete.",
  "You will receive an SMS confirmation immediately.",
];

export default function USSDScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const [search,    setSearch]    = useState("");
  const [copiedId,  setCopiedId]  = useState<string | null>(null);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background === "#000000" || colors.background === "#0A0A0A";

  const accountNumber = user?.accountNumber ?? "1234567890";

  const filtered = BANKS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  async function copyCode(bank: typeof BANKS[0]) {
    const code = bank.fullCode.replace("AccountNumber", accountNumber);
    await Clipboard.setStringAsync(code);
    setCopiedId(bank.id);
    setTimeout(() => setCopiedId(null), 2200);
  }

  async function dialCode(bank: typeof BANKS[0]) {
    const tel = `tel:${bank.shortCode.replace("#", encodeURIComponent("#"))}`;
    const ok = await Linking.canOpenURL(tel);
    if (ok) Linking.openURL(tel);
  }

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
          Bank USSD
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/icons/payment_info.webp")}
            style={styles.heroIllus}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Fund via USSD
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Dial your bank's USSD code from any phone to transfer money into your TrustPoint account — no internet required.
          </Text>
        </View>

        {/* Account number reference pill */}
        <View style={[styles.acctRef, {
          backgroundColor: colors.primary + "10",
          borderColor:     colors.primary + "28",
        }]}>
          <TpIcon name="info" size={15} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.acctRefTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Use account number{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold" }}>
              {accountNumber}
            </Text>
            {" "}when the USSD menu asks for destination account.
          </Text>
        </View>

        {/* Search */}
        <Input
          placeholder="Search your bank..."
          value={search}
          onChangeText={setSearch}
          prefixIcon={<TpIcon name="search" size={18} color={colors.placeholder} strokeWidth={1.8} />}
        />

        {/* Bank list */}
        <View style={styles.bankSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            {filtered.length === BANKS.length
              ? "Popular Banks"
              : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </Text>

          <View style={[styles.bankList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <TpIcon name="search" size={32} color={colors.border} strokeWidth={1.5} />
                <Text style={[styles.emptyTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  No banks found for "{search}"
                </Text>
              </View>
            ) : (
              filtered.map((bank, idx) => {
                const copied = copiedId === bank.id;
                return (
                  <React.Fragment key={bank.id}>
                    <View style={styles.bankRow}>
                      {/* Colour dot */}
                      <View style={[styles.bankDot, { backgroundColor: bank.color }]} />

                      {/* Bank name + code */}
                      <View style={styles.bankInfo}>
                        <Text style={[styles.bankName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                          {bank.name}
                        </Text>
                        <Text style={[styles.bankCode, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                          {bank.fullCode}
                        </Text>
                      </View>

                      {/* Actions */}
                      <View style={styles.bankActions}>
                        <Pressable
                          onPress={() => copyCode(bank)}
                          style={({ pressed }) => [
                            styles.actionPill,
                            {
                              backgroundColor: copied
                                ? colors.success + "18"
                                : colors.primary + "12",
                              borderColor: copied
                                ? colors.success + "44"
                                : colors.primary + "28",
                              opacity: pressed ? 0.7 : 1,
                            },
                          ]}
                        >
                          <TpIcon
                            name={copied ? "check" : "copy"}
                            size={13}
                            color={copied ? colors.success : colors.primary}
                            strokeWidth={2.2}
                          />
                          <Text style={[styles.actionPillTxt, {
                            color:      copied ? colors.success : colors.primary,
                            fontFamily: "Inter_600SemiBold",
                          }]}>
                            {copied ? "Copied" : "Copy"}
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() => dialCode(bank)}
                          style={({ pressed }) => [
                            styles.dialPill,
                            { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
                          ]}
                        >
                          <TpIcon name="phone" size={13} color={colors.text} strokeWidth={2} />
                          <Text style={[styles.dialPillTxt, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                            Dial
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {idx < filtered.length - 1 && (
                      <View style={[styles.bankSep, { backgroundColor: colors.border }]} />
                    )}
                  </React.Fragment>
                );
              })
            )}
          </View>
        </View>

        {/* After dialing instructions */}
        <View style={styles.sectionBlock}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            After dialing
          </Text>
          <View style={[styles.stepsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {AFTER_DIAL.map((step, idx) => (
              <React.Fragment key={idx}>
                <View style={styles.afterStep}>
                  <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNumTxt, { fontFamily: "Inter_700Bold" }]}>
                      {idx + 1}
                    </Text>
                  </View>
                  <Text style={[styles.afterStepTxt, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
                    {step}
                  </Text>
                </View>
                {idx < AFTER_DIAL.length - 1 && (
                  <View style={[styles.stepSep, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Help */}
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
              Need help?
            </Text>
            <Text style={[styles.helpSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Contact support if your transfer doesn't arrive
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
  backBtn:     { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },

  /* Hero */
  heroSection: { alignItems: "center", paddingVertical: 8, gap: 12 },
  heroIllus:   { width: 100, height: 100 },
  heroTitle:   { fontSize: 22, letterSpacing: -0.5 },
  heroSub:     { fontSize: 13.5, textAlign: "center", lineHeight: 20, maxWidth: 310 },

  /* Account ref */
  acctRef: {
    flexDirection: "row", gap: 10, padding: 14,
    borderRadius: 14, borderWidth: 1, alignItems: "flex-start",
  },
  acctRefTxt: { flex: 1, fontSize: 13, lineHeight: 19 },

  /* Bank list */
  bankSection: { gap: 14 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  bankList: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },

  emptyState: { padding: 40, alignItems: "center", gap: 12 },
  emptyTxt:   { fontSize: 13, textAlign: "center" },

  bankRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 18, paddingVertical: 14, gap: 12,
  },
  bankDot:  { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  bankInfo: { flex: 1, gap: 3 },
  bankName: { fontSize: 14 },
  bankCode: { fontSize: 12, letterSpacing: 0.2 },
  bankActions: { flexDirection: "row", gap: 6, alignItems: "center" },
  bankSep: { height: StyleSheet.hairlineWidth, marginHorizontal: 18 },

  actionPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
  },
  actionPillTxt: { fontSize: 12 },

  dialPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20,
  },
  dialPillTxt: { fontSize: 12 },

  /* After dial steps */
  sectionBlock: { gap: 14 },
  stepsCard: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  afterStep: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 14, padding: 16,
  },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  stepNumTxt:   { color: "#fff", fontSize: 12 },
  afterStepTxt: { flex: 1, fontSize: 13.5, lineHeight: 20, paddingTop: 3 },
  stepSep:      { height: StyleSheet.hairlineWidth, marginHorizontal: 18 },

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
