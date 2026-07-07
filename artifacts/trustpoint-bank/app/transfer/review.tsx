import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";

/* ─── Palette ────────────────────────────────────────────── */
const BG     = "#000000";
const SURF   = "#0F0F0F";
const BORDER = "#1E1E22";
const MUTED  = "#666666";
const WHITE  = "#FFFFFF";
const RED    = "#E11D33";

/* ─── Number → words (Nigerian Naira, up to millions) ───── */
const ONES  = ["","one","two","three","four","five","six","seven","eight","nine",
               "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen",
               "seventeen","eighteen","nineteen"];
const TENS  = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];

function hundreds(n: number): string {
  if (n === 0) return "";
  if (n < 20)  return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + hundreds(n % 100) : "");
}

function numToWords(n: number): string {
  if (n === 0) return "zero naira";
  const int  = Math.floor(n);
  // Round kobo and carry if it reaches 100
  let kobo = Math.round((n - int) * 100);
  let intAdjusted = int;
  if (kobo >= 100) { kobo -= 100; intAdjusted += 1; }

  const parts: string[] = [];
  const millions   = Math.floor(intAdjusted / 1_000_000);
  const thousands  = Math.floor((intAdjusted % 1_000_000) / 1_000);
  const remainder  = intAdjusted % 1_000;

  if (millions  > 0) parts.push(hundreds(millions)  + " million");
  if (thousands > 0) parts.push(hundreds(thousands) + " thousand");
  if (remainder > 0) parts.push(hundreds(remainder));

  const words = parts.join(" ");
  const cap   = words.charAt(0).toUpperCase() + words.slice(1);
  const naira = cap + " naira";
  if (kobo > 0) return naira + ` ${kobo} kobo`;
  return naira;
}

/* ─── Currency formatter ─────────────────────────────────── */
const fmt = (n: number) =>
  "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ─── Bank-logo dot (coloured circle + initials) ─────────── */
function BankDot({ name, size = 22 }: { name: string; size?: number }) {
  const seed = name.charCodeAt(0) % 5;
  const palette = ["#1A6B4A","#1A3A6B","#6B1A3A","#3A1A6B","#6B3A1A"];
  const bg  = palette[seed];
  const lbl = name.slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2,
      backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: size * 0.38, color: WHITE, fontFamily: "Inter_700Bold" }}>{lbl}</Text>
    </View>
  );
}

/* ─── Info-circle icon ───────────────────────────────────── */
function InfoIcon({ size = 13, color = MUTED }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <Path d="M12 11v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="7.5" r="1" fill={color} />
    </Svg>
  );
}

/* ═══════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const { beneficiaryId, accountNumber, amount } = useLocalSearchParams<{
    beneficiaryId?: string;
    accountNumber?: string;
    amount: string;
  }>();
  const { beneficiaries, user } = useApp();
  const [narration, setNarration] = useState("");

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const beneficiary     = beneficiaries.find((b) => b.id === beneficiaryId) ?? null;
  const recipientName   = beneficiary?.name ?? "New Recipient";
  const recipientAcct   = beneficiary?.account ?? accountNumber ?? "—";
  const recipientBank   = beneficiary?.bank ?? "TrustPoint Bank";
  const numAmount       = parseFloat(amount ?? "0") || 0;

  /* Fee logic: free only for confirmed TrustPoint→TrustPoint; all other
     recipients (including manual account-number entries where the bank is
     unknown) are treated as interbank and charged ₦10. */
  const isTp  = !!beneficiary && recipientBank.toLowerCase().includes("trustpoint");
  const fee   = isTp ? 0 : 10;
  const vat   = parseFloat((fee * 0.075).toFixed(2));
  const total = numAmount + fee + vat;
  const cashback = fee > 0 ? 10 : 0;

  const fmtAcct = (s: string) => {
    const d = s.replace(/\D/g, "");
    return [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(" ");
  };

  /* Row component inside the combined card */
  const Row = ({
    label, value, bold, valueColor, infoTip,
  }: { label: string; value: string; bold?: boolean; valueColor?: string; infoTip?: boolean }) => (
    <View style={styles.feeRow}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Text style={[styles.feeLabel, bold && { color: WHITE, fontFamily: "Inter_700Bold" }]}>
          {label}
        </Text>
        {infoTip && <InfoIcon />}
      </View>
      <Text style={[
        styles.feeValue,
        bold && { color: WHITE, fontFamily: "Inter_700Bold", fontSize: 15 },
        valueColor ? { color: valueColor } : {},
      ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar style="light" />

      {/* ── Header ──────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <TpIcon name="arrow-left" size={22} color={WHITE} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm payment</Text>
        <TouchableOpacity
          onPress={() => router.push("/(main)" as any)}
          style={styles.iconBtn}
          hitSlop={8}
        >
          <TpIcon name="x" size={20} color={WHITE} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 110 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Amount hero ──────────────────────────────── */}
        <View style={styles.hero}>
          <Text style={styles.heroAmount}>{fmt(numAmount)}</Text>
          <Text style={styles.heroWords}>{numToWords(numAmount)}</Text>
          {cashback > 0 && (
            <View style={styles.cashbackPill}>
              <Text style={styles.cashbackTxt}>₦{cashback} cashback</Text>
            </View>
          )}
        </View>

        {/* ── Recipient + fee breakdown card ───────────── */}
        <View style={styles.card}>
          {/* recipient header */}
          <View style={styles.recipientHeader}>
            <Text style={styles.toName}>To {recipientName}</Text>
            <View style={styles.recipientSub}>
              <BankDot name={recipientBank} size={20} />
              <Text style={styles.recipientSubTxt}>
                {recipientBank}{"  ·  "}{fmtAcct(recipientAcct)}
              </Text>
            </View>
          </View>

          <View style={styles.sep} />

          {/* fee rows */}
          <View style={styles.feeBlock}>
            <Row label="Amount"       value={fmt(numAmount)} />
            <Row label="Transfer fee" value={fmt(fee)}       infoTip />
            <Row label="VAT"          value={fmt(vat)}       infoTip />
          </View>

          <View style={styles.sep} />

          <View style={styles.feeBlock}>
            <Row label="Total debit"    value={fmt(total)}    bold />
            {cashback > 0 && (
              <Row label="Cashback earned" value={`₦${cashback}`} valueColor={RED} />
            )}
          </View>
        </View>

        {/* ── Paying from ──────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Paying from</Text>
          <View style={styles.card}>
            <View style={styles.acctRow}>
              <View style={styles.acctAvatar}>
                <Text style={styles.acctInitials}>
                  {user?.initials?.slice(0, 2).toUpperCase() ?? "TP"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.acctName} numberOfLines={1}>
                  {user?.name ?? "TrustPoint User"}
                  {"  ·  "}
                  <Text style={styles.acctNum}>
                    {user?.accountNumber ? fmtAcct(user.accountNumber) : "—"}
                  </Text>
                </Text>
                <Text style={styles.acctBalance}>
                  ₦{(user?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Narration ────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Narration</Text>
          <View style={styles.card}>
            <TextInput
              value={narration}
              onChangeText={setNarration}
              placeholder="What is this payment for?"
              placeholderTextColor={MUTED}
              style={styles.narrationInput}
              multiline
              maxLength={140}
              returnKeyType="done"
              blurOnSubmit
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Pay button — pinned to bottom ─────────────── */}
      <View style={[styles.cta, { paddingBottom: bottomPad + 16 }]}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() =>
            router.push({
              pathname: "/transfer/pin",
              params: {
                ...(beneficiary ? { beneficiaryId: beneficiary.id } : {}),
                ...(accountNumber ? { accountNumber } : {}),
                amount: numAmount,
                total,
                narration,
              },
            })
          }
          activeOpacity={0.88}
        >
          <Text style={styles.payTxt}>Pay {fmt(total)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ═══════ Styles ════════════════════════════════════════════ */
const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: BG },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  headerTitle: { fontSize: 17, color: WHITE, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  iconBtn:     { width: 36, height: 36, alignItems: "center", justifyContent: "center" },

  /* scroll */
  scroll: { paddingHorizontal: 16, paddingTop: 20, gap: 16 },

  /* amount hero */
  hero:         { alignItems: "center", gap: 6, paddingVertical: 8 },
  heroAmount:   { fontSize: 44, color: WHITE, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  heroWords:    { fontSize: 14, color: MUTED, fontFamily: "Inter_400Regular" },
  cashbackPill: {
    backgroundColor: RED + "22",
    borderWidth: 1, borderColor: RED + "55",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
    marginTop: 4,
  },
  cashbackTxt: { fontSize: 13, color: RED, fontFamily: "Inter_600SemiBold" },

  /* shared card */
  card: {
    backgroundColor: SURF,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },

  /* recipient header inside card */
  recipientHeader: { padding: 16, gap: 6 },
  toName:          { fontSize: 16, color: WHITE, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
  recipientSub:    { flexDirection: "row", alignItems: "center", gap: 7 },
  recipientSubTxt: { fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular" },

  sep: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER },

  /* fee block */
  feeBlock: { paddingHorizontal: 16, paddingVertical: 8 },
  feeRow:   {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  feeLabel: { fontSize: 14, color: MUTED, fontFamily: "Inter_400Regular" },
  feeValue: { fontSize: 14, color: WHITE, fontFamily: "Inter_500Medium" },

  /* section */
  section:      { gap: 10 },
  sectionLabel: { fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular", paddingLeft: 2 },

  /* account row */
  acctRow: {
    flexDirection: "row", alignItems: "center", gap: 12, padding: 14,
  },
  acctAvatar: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: "#1A1A1E",
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  acctInitials: { fontSize: 14, color: WHITE, fontFamily: "Inter_700Bold" },
  acctName:     { fontSize: 14, color: WHITE, fontFamily: "Inter_500Medium", marginBottom: 3 },
  acctNum:      { color: MUTED, fontFamily: "Inter_400Regular" },
  acctBalance:  { fontSize: 15, color: WHITE, fontFamily: "Inter_700Bold" },

  /* narration */
  narrationInput: {
    fontSize: 14,
    color: WHITE,
    fontFamily: "Inter_400Regular",
    padding: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },

  /* pay CTA */
  cta: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: BG,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  payBtn: {
    backgroundColor: RED,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  payTxt: { fontSize: 17, color: WHITE, fontFamily: "Inter_700Bold", letterSpacing: -0.3 },
});
