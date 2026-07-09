import React, { useState } from "react";
import {
  Image,
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
import { TpIcon } from "@/components/TpIcon";
import { ShareAccountSheet } from "@/components/ShareAccountSheet";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const METHODS = [
  {
    id: "cash",
    label: "Cash Deposit",
    subtitle: "Via agents & merchants",
    icon: require("@/assets/icons/funding_platform.webp"),
    route: "/deposit/cash",
  },
  {
    id: "card",
    label: "Top-up with Card",
    subtitle: "Debit or credit card",
    icon: require("@/assets/icons/business_card.webp"),
    route: "/deposit/card",
  },
  {
    id: "ussd",
    label: "Bank USSD",
    subtitle: "Dial from any phone",
    icon: require("@/assets/icons/payment_info.webp"),
    route: "/deposit/ussd",
  },
  {
    id: "qr",
    label: "Scan My QR",
    subtitle: "Let someone scan your code",
    icon: require("@/assets/icons/financial_security.webp"),
    route: "/deposit/qr",
  },
];

export default function DepositScreen() {
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const { user } = useApp();

  const [copied,    setCopied]    = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background === "#000000" || colors.background === "#0A0A0A";

  const accountName   = user?.name          ?? "John Doe";
  const accountNumber = user?.accountNumber ?? "1234567890";
  const bankName      = "TrustPoint MFB";
  const accountType   = "Savings Account";
  const shareText     = `Send money to:\nName: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${bankName}`;

  async function copyAccount() {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    setSheetOpen(false);
  }

  /* Format account number with spaces: 1234 567890 */
  const fmtAcct = accountNumber.replace(/(\d{4})(\d{6})/, "$1 $2");

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ─────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Add Money
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero illustration ────────────────────────── */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/icons/funding.webp")}
            style={styles.heroIllustration}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Bank Transfer
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Share your account details below to receive money from any Nigerian bank
          </Text>
        </View>

        {/* ── Account number — highest priority ────────── */}
        <View style={styles.acctNumberSection}>
          <Text style={[styles.acctLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Account Number
          </Text>
          <Text style={[styles.acctNumber, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            {fmtAcct}
          </Text>
          <TouchableOpacity
            onPress={copyAccount}
            activeOpacity={0.75}
            style={[styles.copyPill, {
              backgroundColor: copied ? colors.success + "18" : colors.primary + "14",
              borderColor:     copied ? colors.success + "55" : colors.primary + "30",
            }]}
          >
            <TpIcon
              name={copied ? "check" : "copy"}
              size={14}
              color={copied ? colors.success : colors.primary}
              strokeWidth={2.2}
            />
            <Text style={[styles.copyPillTxt, {
              color:      copied ? colors.success : colors.primary,
              fontFamily: "Inter_600SemiBold",
            }]}>
              {copied ? "Copied!" : "Copy Number"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Account details card ─────────────────────── */}
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <DetailRow
            label="Account Name"
            value={accountName}
            valueStyle={{ fontFamily: "Inter_700Bold", fontSize: 15 }}
            colors={colors}
          />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <DetailRow label="Bank" value={bankName} colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <DetailRow label="Account Type" value={accountType} colors={colors} />
        </View>

        {/* ── Share CTA ────────────────────────────────── */}
        <TouchableOpacity
          onPress={() => setSheetOpen(true)}
          activeOpacity={0.85}
          style={[styles.shareBtn, { backgroundColor: colors.primary }]}
        >
          <TpIcon name="share-2" size={18} color="#fff" strokeWidth={2} />
          <Text style={[styles.shareBtnTxt, { fontFamily: "Inter_600SemiBold" }]}>
            Share Account Details
          </Text>
        </TouchableOpacity>

        {/* ── Info note ───────────────────────────────── */}
        <View style={[styles.note, {
          backgroundColor: colors.primary + "0C",
          borderColor:     colors.primary + "25",
        }]}>
          <TpIcon name="info" size={15} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.noteTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Transfers arrive instantly. For amounts above ₦5,000,000, please contact support first.
          </Text>
        </View>

        {/* ── Other funding methods ────────────────────── */}
        <View style={styles.methodsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            More ways to add money
          </Text>
          <Text style={[styles.sectionSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Choose how you'd like to fund your account
          </Text>
        </View>

        <View style={styles.methodsGrid}>
          {METHODS.map((m) => (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => router.push(m.route as any)}
              style={[styles.methodCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Image source={m.icon} style={styles.methodIllus} resizeMode="contain" />
              <Text style={[styles.methodLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {m.label}
              </Text>
              <Text style={[styles.methodSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {m.subtitle}
              </Text>
              <View style={[styles.methodArrow, { backgroundColor: colors.primary + "14" }]}>
                <TpIcon name="arrow-right" size={14} color={colors.primary} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Referral invite section ──────────────────── */}
        <View style={[styles.referralCard, { backgroundColor: colors.primary }]}>
          <View style={styles.referralLeft}>
            <Text style={[styles.referralTitle, { fontFamily: "Inter_700Bold" }]}>
              Invite friends, earn ₦2,000
            </Text>
            <Text style={[styles.referralSub, { fontFamily: "Inter_400Regular" }]}>
              Share your referral code and earn rewards when friends sign up and transact.
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/referral")}
              style={styles.referralBtn}
            >
              <Text style={[styles.referralBtnTxt, { fontFamily: "Inter_600SemiBold" }]}>
                Share & Earn
              </Text>
              <TpIcon name="arrow-right" size={14} color={colors.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Image
            source={require("@/assets/icons/online_donation.webp")}
            style={styles.referralIllus}
            resizeMode="contain"
          />
        </View>

      </ScrollView>

      {/* ══ Share bottom sheet ══════════════════════════ */}
      <ShareAccountSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        accountName={accountName}
        accountNumber={accountNumber}
        bankName={bankName}
        onCopied={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2200);
        }}
      />
    </View>
  );
}

/* ── Reusable sub-components ───────────────────────────── */

function DetailRow({
  label, value, valueStyle, colors,
}: {
  label: string; value: string; valueStyle?: object; colors: any;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }, valueStyle]}>
        {value}
      </Text>
    </View>
  );
}

/* ── Styles ────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },

  /* Hero */
  heroSection: { alignItems: "center", paddingTop: 8, paddingBottom: 4, gap: 10 },
  heroIllustration: { width: 96, height: 96 },
  heroTitle:   { fontSize: 22, letterSpacing: -0.6 },
  heroSub:     { fontSize: 13.5, textAlign: "center", lineHeight: 20, maxWidth: 280 },

  /* Account number block */
  acctNumberSection: { alignItems: "center", gap: 12, paddingVertical: 8 },
  acctLabel:   { fontSize: 13 },
  acctNumber:  { fontSize: 38, letterSpacing: 3 },
  copyPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 24, borderWidth: 1,
    paddingHorizontal: 16, paddingVertical: 9,
  },
  copyPillTxt: { fontSize: 13.5 },

  /* Detail card */
  detailCard:  { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  detailRow:   {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14 },
  sep:         { height: StyleSheet.hairlineWidth },

  /* Share button */
  shareBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10,
    paddingVertical: 17, borderRadius: 16,
  },
  shareBtnTxt: { color: "#fff", fontSize: 16 },

  /* Note */
  note: {
    flexDirection: "row", gap: 10, padding: 15,
    borderRadius: 14, borderWidth: 1, alignItems: "flex-start",
  },
  noteTxt: { flex: 1, fontSize: 13, lineHeight: 19 },

  /* Methods section */
  methodsHeader: { gap: 4 },
  sectionTitle:  { fontSize: 17, letterSpacing: -0.3 },
  sectionSub:    { fontSize: 13 },

  methodsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  methodCard: {
    width: "47%", flexGrow: 1,
    borderRadius: 20, borderWidth: 1,
    padding: 18, gap: 6,
  },
  methodIllus: { width: 52, height: 52, marginBottom: 4 },
  methodLabel: { fontSize: 14, letterSpacing: -0.2 },
  methodSub:   { fontSize: 12, lineHeight: 17 },
  methodArrow: {
    alignSelf: "flex-start", marginTop: 6,
    borderRadius: 8, padding: 6,
  },

  /* Referral */
  referralCard: {
    borderRadius: 24, padding: 24,
    flexDirection: "row", alignItems: "center",
    overflow: "hidden",
  },
  referralLeft: { flex: 1, gap: 8 },
  referralTitle: { fontSize: 17, color: "#fff", letterSpacing: -0.4 },
  referralSub:   { fontSize: 12.5, color: "#ffffffBB", lineHeight: 18 },
  referralBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10, marginTop: 4,
  },
  referralBtnTxt: { fontSize: 13, color: "#E11D33" },
  referralIllus:  { width: 80, height: 80, marginLeft: 12, flexShrink: 0 },

  /* Sheet */
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingHorizontal: 20, paddingTop: 12, gap: 0,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  sheetTitle:   { fontSize: 18, letterSpacing: -0.4, marginBottom: 4 },
  sheetSub:     { fontSize: 13, marginBottom: 20 },
  sheetDivider: { height: StyleSheet.hairlineWidth },

  sheetOpt: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 16,
  },
  optIcon: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  optInfo:  { flex: 1, gap: 3 },
  optLabel: { fontSize: 15 },
  optSub:   { fontSize: 12.5 },

  cancelBtn: {
    marginTop: 16, borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
  },
  cancelTxt: { fontSize: 15 },
});
