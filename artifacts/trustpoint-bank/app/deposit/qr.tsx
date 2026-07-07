import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Svg, { Rect } from "react-native-svg";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

/* ── Deterministic QR-style grid ─────────────────────────── */
function QRDisplay({
  accountNumber,
  fgColor,
}: {
  accountNumber: string;
  fgColor: string;
}) {
  const cell    = 9;
  const size    = 27;
  const padding = 2;
  const seed    = accountNumber.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const grid: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      // Fixed corner finder patterns
      if (r < 7 && c < 7)           return true;
      if (r < 7 && c > size - 8)    return true;
      if (r > size - 8 && c < 7)    return true;
      // Quiet zone borders around finders
      if ((r < 7 && (c === 6 || c === 7)) || (c < 7 && (r === 6 || r === 7))) return false;
      // Pseudo-random data cells
      return ((seed * (r + 1) * (c + 1) * 31337) % 17) < 8;
    })
  );

  const totalSize = size * cell + padding * 2;

  return (
    <View style={[styles.qrWrapper, { backgroundColor: "#fff" }]}>
      <Svg width={totalSize} height={totalSize}>
        {grid.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <Rect
                key={`${r}-${c}`}
                x={c * cell + padding}
                y={r * cell + padding}
                width={cell}
                height={cell}
                fill={fgColor}
                rx={1.5}
              />
            ) : null
          )
        )}
      </Svg>
    </View>
  );
}

export default function DepositQRScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();

  const [refreshKey,     setRefreshKey]     = useState(0);
  const [copiedAcct,     setCopiedAcct]     = useState(false);

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);
  const isDark    = colors.background === "#000000" || colors.background === "#0A0A0A";

  const accountNumber = user?.accountNumber ?? "1000000001";
  const name          = user?.name          ?? "John Doe";
  const bankName      = "TrustPoint MFB";
  const shareText     = `Pay me on TrustPoint Bank:\nName: ${name}\nAccount: ${accountNumber}\nBank: ${bankName}`;

  // Embed refreshKey into the seed string so "Refresh" visually changes the QR
  const qrSeed = `${accountNumber}-${refreshKey}`;

  async function shareQR() {
    await Share.share({ message: shareText, title: "TrustPoint QR Code" });
  }

  async function copyAcct() {
    await Clipboard.setStringAsync(accountNumber);
    setCopiedAcct(true);
    setTimeout(() => setCopiedAcct(false), 2200);
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
          My QR Code
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Instruction text */}
        <View style={styles.topHint}>
          <Text style={[styles.topHintTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Share this QR code alongside your account details so anyone can send you money quickly — no typing required.
          </Text>
        </View>

        {/* QR card — main visual */}
        <View style={[styles.qrCard, { backgroundColor: colors.card, borderColor: colors.border }]}>

          {/* Illustration above QR */}
          <Image
            source={require("@/assets/icons/investment_security.webp")}
            style={styles.cardIllus}
            resizeMode="contain"
          />

          {/* QR code */}
          <QRDisplay accountNumber={qrSeed} fgColor="#0A0A0A" />

          {/* TrustPoint logo label on QR */}
          <View style={[styles.qrBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.qrBadgeTxt, { fontFamily: "Inter_700Bold" }]}>
              TrustPoint MFB
            </Text>
          </View>

          {/* User info */}
          <View style={styles.userInfo}>
            <Text style={[styles.qrName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {name}
            </Text>
            <View style={styles.acctRow}>
              <Text style={[styles.qrAcct, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {accountNumber}
              </Text>
              <Text style={[styles.qrDot, { color: colors.border }]}>·</Text>
              <Text style={[styles.qrBank, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {bankName}
              </Text>
            </View>
          </View>

          {/* Refresh */}
          <TouchableOpacity
            onPress={() => setRefreshKey((k) => k + 1)}
            activeOpacity={0.75}
            style={[styles.refreshPill, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <TpIcon name="refresh-cw" size={14} color={colors.mutedForeground} strokeWidth={2} />
            <Text style={[styles.refreshTxt, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Refresh QR Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={shareQR}
            activeOpacity={0.85}
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          >
            <TpIcon name="share-2" size={18} color="#fff" strokeWidth={2} />
            <Text style={[styles.actionBtnTxt, { fontFamily: "Inter_600SemiBold", color: "#fff" }]}>
              Share Account Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={copyAcct}
            activeOpacity={0.85}
            style={[styles.actionBtnSecondary, {
              backgroundColor: colors.card,
              borderColor:     copiedAcct ? colors.success : colors.border,
            }]}
          >
            <TpIcon
              name={copiedAcct ? "check" : "copy"}
              size={18}
              color={copiedAcct ? colors.success : colors.primary}
              strokeWidth={2}
            />
            <Text style={[styles.actionBtnTxt, {
              fontFamily: "Inter_600SemiBold",
              color: copiedAcct ? colors.success : colors.primary,
            }]}>
              {copiedAcct ? "Account Copied!" : "Copy Account Number"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* How to use */}
        <View style={styles.howSection}>
          <Text style={[styles.howTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            How to use
          </Text>
          <View style={[styles.howCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {[
              {
                icon: "smartphone" as const,
                title: "Show to sender",
                body: "Display this QR code on your screen. The sender scans it from their banking app.",
              },
              {
                icon: "check-circle" as const,
                title: "Instant confirmation",
                body: "Once scanned and approved, funds land in your account in seconds.",
              },
              {
                icon: "share-2" as const,
                title: "Share remotely",
                body: "Tap Share to send your QR code via WhatsApp, SMS, or any messaging app.",
              },
            ].map((item, idx) => (
              <React.Fragment key={item.title}>
                <View style={styles.howRow}>
                  <View style={[styles.howIcon, { backgroundColor: colors.primary + "14" }]}>
                    <TpIcon name={item.icon} size={18} color={colors.primary} strokeWidth={1.8} />
                  </View>
                  <View style={styles.howText}>
                    <Text style={[styles.howItemTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.howItemBody, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {item.body}
                    </Text>
                  </View>
                </View>
                {idx < 2 && <View style={[styles.howSep, { backgroundColor: colors.border }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Security note */}
        <View style={[styles.secNote, {
          backgroundColor: colors.success + "0C",
          borderColor:     colors.success + "25",
        }]}>
          <TpIcon name="shield" size={15} color={colors.success} strokeWidth={1.8} />
          <Text style={[styles.secNoteTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            This QR code only allows others to send money <Text style={{ fontFamily: "Inter_600SemiBold" }}>to</Text> you. It cannot be used to withdraw funds from your account.
          </Text>
        </View>

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

  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 4 },

  /* Top hint */
  topHint:    { paddingHorizontal: 4 },
  topHintTxt: { fontSize: 13.5, textAlign: "center", lineHeight: 20 },

  /* QR card */
  qrCard: {
    borderRadius: 24, borderWidth: 1,
    padding: 28, alignItems: "center", gap: 16,
  },
  cardIllus: { width: 72, height: 72 },

  qrWrapper: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  qrBadge: {
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20,
  },
  qrBadgeTxt: { color: "#fff", fontSize: 11, letterSpacing: 0.5 },

  userInfo:  { alignItems: "center", gap: 5 },
  qrName:    { fontSize: 20, letterSpacing: -0.4 },
  acctRow:   { flexDirection: "row", alignItems: "center", gap: 6 },
  qrAcct:    { fontSize: 13.5 },
  qrDot:     { fontSize: 14 },
  qrBank:    { fontSize: 13.5 },

  refreshPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  refreshTxt: { fontSize: 13 },

  /* Action buttons */
  actions: { gap: 10 },
  actionBtn: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10,
    paddingVertical: 17, borderRadius: 16,
  },
  actionBtnSecondary: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 10,
    paddingVertical: 16, borderRadius: 16, borderWidth: 1.5,
  },
  actionBtnTxt: { fontSize: 16 },

  /* How to use */
  howSection: { gap: 14 },
  howTitle:   { fontSize: 17, letterSpacing: -0.3 },
  howCard:    { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  howRow: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 14, padding: 18,
  },
  howIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  howText: { flex: 1, gap: 4, paddingTop: 2 },
  howItemTitle: { fontSize: 14 },
  howItemBody:  { fontSize: 13, lineHeight: 18 },
  howSep:       { height: StyleSheet.hairlineWidth, marginHorizontal: 18 },

  /* Security note */
  secNote: {
    flexDirection: "row", gap: 10, padding: 15,
    borderRadius: 14, borderWidth: 1, alignItems: "flex-start",
  },
  secNoteTxt: { flex: 1, fontSize: 13, lineHeight: 19 },
});
