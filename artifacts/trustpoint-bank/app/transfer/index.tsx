import React, { useId, useState, useEffect } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGrad,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { useApp } from "@/context/AppContext";
import { TpIcon } from "@/components/TpIcon";

/* ─── Palette — pure black, no gradients ────────────────── */
const BG      = "#000000";   // page background
const SURF    = "#0F0F0F";   // card surface
const SURF2   = "#080808";   // deeper surface (inputs, search)
const SURF3   = "#161618";   // sheet / slightly lifted
const BORDER  = "#1E1E22";   // solid dark border
const MUTED   = "#666666";   // secondary labels
const WHITE   = "#FFFFFF";
const RED     = "#E11D33";
const RED_DK  = "#8E0E1E";

/* ─── Banner icon: red broadcast badge ──────────────────── */
function BannerIcon({ size = 24 }: { size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGrad id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={RED} />
          <Stop offset="1" stopColor={RED_DK} />
        </SvgGrad>
      </Defs>
      <Rect x="1" y="1" width="22" height="22" rx="7" fill={`url(#${id}-bg)`} />
      <Path d="M7 9.5H9.5L13 7V17L9.5 14.5H7V9.5Z" fill={WHITE} />
      <Path d="M15 9.5C16.2 10.4 16.2 13.6 15 14.5"
        stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M16.5 8C18.8 9.5 18.8 14.5 16.5 16"
        stroke={WHITE} strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
    </Svg>
  );
}

/* ─── Recipient avatar ──────────────────────────────────── */
function RecipientAvatar({ initials, size = 52 }: { initials: string; size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <Defs>
        <SvgGrad id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#1A0508" />
          <Stop offset="1" stopColor="#0D0204" />
        </SvgGrad>
      </Defs>
      <Circle cx="26" cy="26" r="25" fill={`url(#${id}-bg)`} stroke={RED} strokeWidth="1.6" />
      <Path d="M17 21 A9 9 0 0 1 32 18" stroke={WHITE} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M31 15L33 19L29 19Z" fill={WHITE} />
      <Path d="M35 31 A9 9 0 0 1 20 34" stroke={WHITE} strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M21 37L19 33L23 33Z" fill={WHITE} />
    </Svg>
  );
}

/* ─── History icon ──────────────────────────────────────── */
function HistoryIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12A9 9 0 1 0 12 3M3 12H7M3 12V8"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 7.5V12.5L15 14.5"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ─── Account-number formatter ──────────────────────────── */
function fmtAcct(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}

/* ═══════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export default function TransferIndexScreen() {
  const insets = useSafeAreaInsets();
  const { user, beneficiaries } = useApp();

  const [raw, setRaw]                 = useState("");
  const [activeTab, setActiveTab]     = useState<"recent" | "saved">("recent");
  const [search, setSearch]           = useState("");
  const [resolved, setResolved]       = useState<{ name: string; bank: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saveRecipient, setSave]      = useState(false);

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + 120 + (Platform.OS === "web" ? 34 : 0);

  /* Simulate account name lookup */
  useEffect(() => {
    if (raw.length < 10) { setResolved(null); return; }
    const found = beneficiaries.find((b) => b.account.replace(/\D/g, "") === raw);
    setResolved(found
      ? { name: found.name, bank: found.bank }
      : { name: "TrustPoint User", bank: "TrustPoint Bank" }
    );
  }, [raw, beneficiaries]);

  const savedBenefs   = beneficiaries.filter((b) => b.favorite);
  const recentBenefs  = beneficiaries.filter((b) => !b.favorite);
  const sourceBenefs  = activeTab === "saved" ? savedBenefs : recentBenefs;
  const filtered = sourceBenefs.filter(
    (b) =>
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.account.includes(search),
  );

  function handleBeneficiary(id: string) {
    router.push({ pathname: "/transfer/amount", params: { beneficiaryId: id } });
  }

  function handleConfirm() {
    setShowConfirm(false);
    router.push({ pathname: "/transfer/amount", params: { accountNumber: raw } });
  }

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar style="light" />

      {/* ── Header — solid black ─────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <TpIcon name="arrow-left" size={22} color={WHITE} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start your transfer</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <HistoryIcon size={20} color={WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnFlat} hitSlop={8}>
            <TpIcon name="more-horizontal" size={20} color={WHITE} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Banner ───────────────────────────────── */}
        <View style={styles.banner}>
          <BannerIcon size={26} />
          <Text style={styles.bannerText}>
            TrustPoint to TrustPoint transfers are{" "}
            <Text style={styles.bannerBold}>free &amp; instant</Text>
          </Text>
        </View>

        {/* ── Paying from ──────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Paying from</Text>
          <View style={styles.card}>
            <View style={styles.acctAvatar}>
              <Text style={styles.acctInitial}>
                {user?.initials?.slice(0, 2).toUpperCase() ?? "TP"}
              </Text>
            </View>
            <View style={styles.acctInfo}>
              <Text style={styles.acctName} numberOfLines={1}>
                {user?.name ?? "TrustPoint Account"}
                {"  ·  "}
                <Text style={styles.acctNum}>
                  {user?.accountNumber ? fmtAcct(user.accountNumber) : "000 000 0000"}
                </Text>
              </Text>
              <Text style={styles.acctBalance}>
                ₦{(user?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Account number input ─────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Enter recipient's account number</Text>
          <View style={styles.inputCard}>
            <TextInput
              value={fmtAcct(raw)}
              onChangeText={(t) => setRaw(t.replace(/\D/g, "").slice(0, 10))}
              keyboardType="number-pad"
              maxLength={12}
              style={[styles.inputField, { color: raw.length === 0 ? "#2A2A2E" : WHITE }]}
              placeholder="000 000 0000"
              placeholderTextColor="#2A2A2E"
              textAlign="center"
              cursorColor={RED}
              returnKeyType="done"
            />
          </View>

          {/* Resolved name row — tap opens confirm sheet */}
          {resolved && (
            <Pressable
              onPress={() => setShowConfirm(true)}
              style={({ pressed }) => [styles.resolvedRow, { opacity: pressed ? 0.75 : 1 }]}
            >
              <RecipientAvatar initials={resolved.name.slice(0, 2)} size={44} />
              <View style={styles.resolvedInfo}>
                <Text style={styles.resolvedName}>{resolved.name}</Text>
                <Text style={styles.resolvedBank}>{resolved.bank}</Text>
              </View>
              <TpIcon name="chevron-right" size={16} color={MUTED} strokeWidth={2.2} />
            </Pressable>
          )}
        </View>

        {/* ── Select recipient ─────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: WHITE }]}>Select recipient</Text>
          <View style={styles.recipientCard}>
            {/* search */}
            <View style={styles.searchBar}>
              <TpIcon name="search" size={16} color={MUTED} strokeWidth={1.8} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search accounts"
                placeholderTextColor={MUTED}
                style={styles.searchInput}
              />
            </View>

            {/* tabs */}
            <View style={styles.tabsRow}>
              <View style={styles.tabsLeft}>
                {(["recent", "saved"] as const).map((tab) => {
                  const active = activeTab === tab;
                  return (
                    <TouchableOpacity
                      key={tab}
                      onPress={() => setActiveTab(tab)}
                      style={[
                        styles.tabPill,
                        active
                          ? { backgroundColor: RED + "1A", borderColor: RED + "44" }
                          : { backgroundColor: "transparent", borderColor: BORDER },
                      ]}
                    >
                      <Text style={[styles.tabTxt, { color: active ? RED : MUTED }]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity hitSlop={8}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* list */}
            {filtered.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyTxt}>No recipients found</Text>
              </View>
            ) : (
              filtered.map((b, idx) => (
                <React.Fragment key={b.id}>
                  {idx > 0 && <View style={styles.divider} />}
                  <Pressable
                    onPress={() => handleBeneficiary(b.id)}
                    style={({ pressed }) => [styles.benefRow, pressed && { opacity: 0.7 }]}
                  >
                    <RecipientAvatar initials={b.initials} size={48} />
                    <View style={styles.benefInfo}>
                      <Text style={styles.benefName}>{b.name}</Text>
                      <Text style={styles.benefSub}>{b.bank}{"  ·  "}{b.account}</Text>
                    </View>
                  </Pressable>
                </React.Fragment>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* ══ Confirm bottom sheet ═════════════════════ */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirm(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowConfirm(false)} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.sheetTitle}>Confirm it's the right person</Text>

          {/* recipient detail card */}
          <View style={styles.recipientDetail}>
            <RecipientAvatar initials={resolved?.name?.slice(0, 2) ?? "TU"} size={56} />
            <Text style={styles.recipientName}>{resolved?.name ?? "Account Holder"}</Text>
            <Text style={styles.recipientBank}>{resolved?.bank ?? "TrustPoint Bank"}</Text>
            <Text style={styles.recipientAcct}>{fmtAcct(raw)}</Text>
          </View>

          {/* save toggle */}
          <View style={styles.saveRow}>
            <Text style={styles.saveTxt}>Save recipient?</Text>
            <Switch
              value={saveRecipient}
              onValueChange={setSave}
              trackColor={{ false: "#2A2A2E", true: RED + "88" }}
              thumbColor={saveRecipient ? RED : "#444448"}
            />
          </View>

          <View style={styles.sheetDivider} />

          {/* buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => setShowConfirm(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.changeTxt}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmTxt}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ═══════ Styles ════════════════════════════════════════════ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    backgroundColor: BG,
  },
  headerTitle:  { fontSize: 18, color: WHITE, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  headerRight:  { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn:      { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  iconBtnFlat:  { width: 30, height: 36, alignItems: "center", justifyContent: "center" },

  /* scroll */
  scroll: { paddingHorizontal: 16, paddingTop: 12, gap: 16 },

  /* banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#12040A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RED_DK + "44",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  bannerText: { flex: 1, fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular", lineHeight: 19 },
  bannerBold: { color: WHITE, fontFamily: "Inter_600SemiBold" },

  /* section */
  section: { gap: 10 },
  label:   { fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular", paddingLeft: 2 },

  /* card — solid black surface */
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURF,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
  },
  acctAvatar: {
    width: 44, height: 44, borderRadius: 11,
    backgroundColor: "#1A1A1E",
    borderWidth: 1, borderColor: BORDER,
    alignItems: "center", justifyContent: "center",
  },
  acctInitial: { fontSize: 15, color: WHITE, fontFamily: "Inter_700Bold" },
  acctInfo:    { flex: 1, gap: 4 },
  acctName:    { fontSize: 14, color: WHITE, fontFamily: "Inter_500Medium", letterSpacing: -0.1 },
  acctNum:     { color: MUTED, fontFamily: "Inter_400Regular" },
  acctBalance: { fontSize: 17, color: WHITE, fontFamily: "Inter_700Bold" },

  /* input */
  inputCard: {
    backgroundColor: SURF,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  inputField: {
    fontSize: 28,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 6,
    paddingVertical: 22,
    paddingHorizontal: 16,
    width: "100%",
  },

  /* resolved name row */
  resolvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURF,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },
  resolvedInfo: { flex: 1 },
  resolvedName: { fontSize: 15, color: WHITE, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  resolvedBank: { fontSize: 12, color: MUTED, fontFamily: "Inter_400Regular" },

  /* recipient card */
  recipientCard: {
    backgroundColor: SURF,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },

  /* search */
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: SURF2,
    margin: 12,
    borderRadius: 10,
    borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: {
    flex: 1, fontSize: 14, color: WHITE,
    fontFamily: "Inter_400Regular", padding: 0,
  },

  /* tabs */
  tabsRow:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingBottom: 4 },
  tabsLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabPill:  { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1 },
  tabTxt:   { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  viewAll:  { fontSize: 13, color: MUTED, fontFamily: "Inter_500Medium" },

  /* beneficiary list */
  benefRow:  { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 12 },
  benefInfo: { flex: 1 },
  benefName: { fontSize: 15, color: WHITE, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  benefSub:  { fontSize: 12, color: MUTED, fontFamily: "Inter_400Regular" },
  divider:   { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginHorizontal: 12 },
  emptyRow:  { paddingVertical: 28, alignItems: "center" },
  emptyTxt:  { fontSize: 14, color: MUTED, fontFamily: "Inter_400Regular" },

  /* confirm sheet */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: SURF3,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#2E2E32",
    alignSelf: "center", marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 17, color: WHITE,
    fontFamily: "Inter_700Bold", letterSpacing: -0.4,
    textAlign: "center", marginBottom: 16,
  },
  recipientDetail: {
    backgroundColor: SURF,
    borderRadius: 16,
    borderWidth: 1, borderColor: BORDER,
    paddingVertical: 20, paddingHorizontal: 16,
    alignItems: "center", gap: 6,
  },
  recipientName: { fontSize: 18, color: WHITE, fontFamily: "Inter_700Bold", letterSpacing: -0.4, textAlign: "center" },
  recipientBank: { fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular", textAlign: "center" },
  recipientAcct: { fontSize: 13, color: MUTED, fontFamily: "Inter_500Medium", letterSpacing: 2, textAlign: "center" },

  saveRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: 16,
  },
  saveTxt: { fontSize: 15, color: WHITE, fontFamily: "Inter_500Medium" },

  sheetDivider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginBottom: 16 },

  btnRow: { flexDirection: "row", gap: 12 },
  changeBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: SURF, borderWidth: 1, borderColor: BORDER,
  },
  changeTxt: { fontSize: 15, color: WHITE, fontFamily: "Inter_600SemiBold" },
  confirmBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: RED,
  },
  confirmTxt: { fontSize: 15, color: WHITE, fontFamily: "Inter_700Bold" },
});
