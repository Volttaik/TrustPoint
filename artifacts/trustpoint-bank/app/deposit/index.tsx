import React, { useState } from "react";
import {
  Linking,
  Modal,
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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const WHATSAPP_GREEN = "#25D366";

export default function DepositScreen() {
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const { user } = useApp();

  const [copied,      setCopied]      = useState(false);
  const [sheetOpen,   setSheetOpen]   = useState(false);

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark    = colors.background === "#0A0A0A";

  const accountName   = user?.name          ?? "John Doe";
  const accountNumber = user?.accountNumber ?? "1234567890";
  const bankName      = "TrustPoint MFB";
  const accountType   = "Savings Account";

  const shareText = `Send money to:\nName: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${bankName}`;

  async function copyAccount() {
    await Clipboard.setStringAsync(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    setSheetOpen(false);
  }

  async function shareToWhatsApp() {
    const url = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      await Share.share({ message: shareText });
    }
    setSheetOpen(false);
  }

  async function shareLink() {
    await Share.share({ message: shareText, title: "TrustPoint Account Details" });
    setSheetOpen(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          Receive Money
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Account card ───────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

          {/* Avatar + label */}
          <View style={styles.cardTop}>
            <View style={[styles.avatar, { backgroundColor: isDark ? "#1C0409" : "#F8E8EA", borderColor: "#E11D3330" }]}>
              <Text style={[styles.avatarText, { fontFamily: "Inter_700Bold" }]}>
                {accountName.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardTopInfo}>
              <Text style={[styles.acctNameLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Account Name
              </Text>
              <Text style={[styles.acctName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {accountName}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Rows */}
          <Row label="Account Number" colors={colors}>
            <View style={styles.acctNumRow}>
              <Text style={[styles.acctNum, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {accountNumber}
              </Text>
              <TouchableOpacity
                onPress={copyAccount}
                style={[styles.copyPill, {
                  backgroundColor: copied ? colors.success + "18" : colors.primary + "15",
                  borderColor:     copied ? colors.success + "55" : colors.primary + "33",
                }]}
              >
                <TpIcon
                  name={copied ? "check" : "copy"}
                  size={13}
                  color={copied ? colors.success : colors.primary}
                  strokeWidth={2.2}
                />
                <Text style={[styles.copyPillTxt, {
                  color:      copied ? colors.success : colors.primary,
                  fontFamily: "Inter_600SemiBold",
                }]}>
                  {copied ? "Copied" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>
          </Row>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Bank Name"     value={bankName}     colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Row label="Account Type"  value={accountType}  colors={colors} />
        </View>

        {/* ── Share button ───────────────────────────── */}
        <TouchableOpacity
          onPress={() => setSheetOpen(true)}
          style={[styles.shareBtn, { backgroundColor: "#E11D33" }]}
          activeOpacity={0.85}
        >
          <TpIcon name="share-2" size={18} color="#fff" strokeWidth={2} />
          <Text style={[styles.shareBtnTxt, { fontFamily: "Inter_600SemiBold" }]}>
            Share Account Details
          </Text>
        </TouchableOpacity>

        {/* ── Note ───────────────────────────────────── */}
        <View style={[styles.note, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28" }]}>
          <TpIcon name="info" size={15} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.noteTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Transfers to your account are processed instantly. For amounts above ₦5,000,000, contact support.
          </Text>
        </View>
      </ScrollView>

      {/* ══ Share bottom sheet ═════════════════════════ */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setSheetOpen(false)} />
        <View style={[styles.sheet, {
          backgroundColor: colors.surfaceElevated ?? colors.card,
          borderColor:     colors.border,
          paddingBottom:   Math.max(insets.bottom, 24),
        }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Share via
          </Text>

          {/* WhatsApp */}
          <SheetOption
            icon={<TpIcon name="send" size={20} color={WHATSAPP_GREEN} strokeWidth={1.8} />}
            iconBg={WHATSAPP_GREEN + "18"}
            label="WhatsApp"
            sublabel="Send your account details on WhatsApp"
            onPress={shareToWhatsApp}
            colors={colors}
          />

          <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

          {/* Share link */}
          <SheetOption
            icon={<TpIcon name="share-2" size={20} color={colors.primary} strokeWidth={1.8} />}
            iconBg={colors.primary + "18"}
            label="Share"
            sublabel="Share via any app on your device"
            onPress={shareLink}
            colors={colors}
          />

          <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

          {/* Copy account number */}
          <SheetOption
            icon={<TpIcon name="copy" size={20} color={colors.text} strokeWidth={1.8} />}
            iconBg={colors.surface}
            label="Copy Account Number"
            sublabel={accountNumber}
            onPress={copyAccount}
            colors={colors}
          />

          <TouchableOpacity
            style={[styles.cancelBtn, { backgroundColor: colors.surface }]}
            onPress={() => setSheetOpen(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.cancelTxt, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

/* ── Reusable components ───────────────────────────────── */

function Row({
  label, value, colors, children,
}: {
  label: string; value?: string; colors: any; children?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
        {label}
      </Text>
      {children ?? (
        <Text style={[styles.rowValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {value}
        </Text>
      )}
    </View>
  );
}

function SheetOption({
  icon, iconBg, label, sublabel, onPress, colors,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sublabel: string;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sheetOpt, pressed && { opacity: 0.65 }]}
    >
      <View style={[styles.optIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.optInfo}>
        <Text style={[styles.optLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {label}
        </Text>
        <Text style={[styles.optSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {sublabel}
        </Text>
      </View>
      <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
    </Pressable>
  );
}

/* ── Styles ────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, gap: 14, paddingTop: 4 },

  card: {
    borderRadius: 20, borderWidth: 1, overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row", alignItems: "center",
    gap: 14, padding: 18,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 16,
    borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, color: "#E11D33" },
  cardTopInfo: { flex: 1, gap: 2 },
  acctNameLabel: { fontSize: 12 },
  acctName:      { fontSize: 16, letterSpacing: -0.2 },

  divider: { height: StyleSheet.hairlineWidth },

  row: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18, paddingVertical: 15,
  },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 14 },

  acctNumRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  acctNum:    { fontSize: 15, letterSpacing: 1.2 },
  copyPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    borderRadius: 20, borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  copyPillTxt: { fontSize: 12 },

  shareBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 16,
  },
  shareBtnTxt: { color: "#fff", fontSize: 15 },

  note: {
    flexDirection: "row", gap: 10, padding: 14,
    borderRadius: 12, borderWidth: 1, alignItems: "flex-start",
  },
  noteTxt: { flex: 1, fontSize: 12.5, lineHeight: 18 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.65)" },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingHorizontal: 20, paddingTop: 12, gap: 0,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 18,
  },
  sheetTitle: { fontSize: 16, letterSpacing: -0.3, marginBottom: 16 },
  sheetDivider: { height: StyleSheet.hairlineWidth },

  sheetOpt: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 14,
  },
  optIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  optInfo: { flex: 1, gap: 2 },
  optLabel: { fontSize: 15 },
  optSub:   { fontSize: 12 },

  cancelBtn: {
    marginTop: 12, borderRadius: 14,
    paddingVertical: 15, alignItems: "center",
  },
  cancelTxt: { fontSize: 15 },
});
