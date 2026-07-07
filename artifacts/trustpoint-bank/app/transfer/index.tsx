import React, { useId, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
  G,
  LinearGradient as SvgGrad,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { useApp } from "@/context/AppContext";
import { TpIcon } from "@/components/TpIcon";

/* ─── Palette (solid — no transparency or glass) ──────── */
const BG        = "#000000";   // page background
const SURFACE   = "#111111";   // cards / inputs
const SURFACE2  = "#0D0D0D";   // slightly deeper variant
const BANNER_BG = "#1A0508";   // red banner strip
const GREEN_BG  = "#122A18";   // green promo card
const AMBER     = "#E9A200";   // Recent pill, View All
const AMBER_BG  = "#2C2200";   // amber pill background
const TEAL      = "#E11D33";   // recipient circle rim (red)
const TEAL_BG   = "#1A0508";   // recipient circle fill (dark red)
const GREEN_TXT = "#4ADE80";   // highlighted numbers
const MUTED     = "#666666";   // secondary labels
const WHITE     = "#FFFFFF";
const RED       = "#E11D33";

/* ─── Banner icon: red broadcast badge ────────────────── */
function BannerIcon({ size = 24 }: { size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGrad id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E11D33" />
          <Stop offset="1" stopColor="#8B0E1E" />
        </SvgGrad>
      </Defs>
      <Rect x="1" y="1" width="22" height="22" rx="7" fill={`url(#${id}-bg)`} />
      {/* speaker cone */}
      <Path d="M7 9.5H9.5L13 7V17L9.5 14.5H7V9.5Z" fill={WHITE} />
      {/* sound waves */}
      <Path d="M15 9.5C16.2 10.4 16.2 13.6 15 14.5" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M16.5 8C18.8 9.5 18.8 14.5 16.5 16" stroke={WHITE} strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
    </Svg>
  );
}


/* ─── Recipient avatar: teal circle with transfer ring ─── */
function RecipientAvatar({ initials, color = TEAL_BG, rim = TEAL, size = 48 }: {
  initials: string; color?: string; rim?: string; size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* outer ring */}
      <Circle cx="24" cy="24" r="23" fill={color} stroke={rim} strokeWidth="2" />
      {/* circular-arrows transfer icon */}
      <Path
        d="M16 20 A8 8 0 0 1 30 17"
        stroke={WHITE}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M29 14L31 18L27 18Z" fill={WHITE} />
      <Path
        d="M32 28 A8 8 0 0 1 18 31"
        stroke={WHITE}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M19 34L17 30L21 30Z" fill={WHITE} />
    </Svg>
  );
}

/* ─── History clock icon ──────────────────────────────── */
function HistoryIcon({ size = 22, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12A9 9 0 1 0 12 3M3 12H7M3 12V8"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M12 7.5V12.5L15 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ─── Account-number formatter ───────────────────────── */
function formatAcct(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 10);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}

/* ═══════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export default function TransferIndexScreen() {
  const insets = useSafeAreaInsets();
  const { user, beneficiaries } = useApp();

  const [raw, setRaw]             = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "saved">("recent");
  const [search, setSearch]       = useState("");

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + 120 + (Platform.OS === "web" ? 34 : 0);

  const filtered = beneficiaries.filter(
    (b) =>
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.account.includes(search),
  );

  function handleProceed() {
    if (raw.length < 10) return;
    router.push({ pathname: "/transfer/amount", params: { accountNumber: raw } });
  }

  function handleBeneficiary(id: string) {
    router.push({ pathname: "/transfer/amount", params: { beneficiaryId: id } });
  }

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar style="light" />

      {/* ── Header ───────────────────────────────────── */}
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
        {/* ── Blue instant-transfer banner ──────────── */}
        <View style={styles.banner}>
          <BannerIcon size={26} />
          <Text style={styles.bannerText}>
            TrustPoint to TrustPoint transfers are{" "}
            <Text style={styles.bannerBold}>free &amp; instant</Text>
          </Text>
        </View>

        {/* ── Paying from ───────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Paying from</Text>
          <View style={styles.card}>
            {/* amber-square avatar */}
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
                  {user?.accountNumber ? formatAcct(user.accountNumber) : "000 000 0000"}
                </Text>
              </Text>
              <Text style={styles.acctBalance}>
                ₦{(user?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Account number input ──────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Enter recipient's account number</Text>
          <View style={styles.inputCard}>
            <TextInput
              value={raw}
              onChangeText={(t) => setRaw(t.replace(/\D/g, "").slice(0, 10))}
              keyboardType="number-pad"
              maxLength={10}
              style={[
                styles.inputField,
                { color: raw.length === 0 ? "#333333" : WHITE },
              ]}
              placeholder="000 000 0000"
              placeholderTextColor="#333333"
              textAlign="center"
              cursorColor={RED}
              returnKeyType="done"
              onSubmitEditing={handleProceed}
            />
          </View>
          {raw.length > 0 && raw.length < 10 && (
            <Text style={styles.inputHint}>{10 - raw.length} more digit{10 - raw.length !== 1 ? "s" : ""}</Text>
          )}
          {raw.length === 10 && (
            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed} activeOpacity={0.85}>
              <Text style={styles.proceedTxt}>Continue</Text>
              <TpIcon name="arrow-right" size={16} color={WHITE} strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Select recipient ──────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: WHITE }]}>Select recipient</Text>
          <View style={styles.recipientCard}>
            {/* search bar */}
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

            {/* tabs row */}
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
                          ? { backgroundColor: AMBER }
                          : { backgroundColor: "transparent" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabTxt,
                          { color: active ? "#000" : WHITE },
                        ]}
                      >
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

            {/* recipient list */}
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
                    <RecipientAvatar
                      initials={b.initials}
                      color={TEAL_BG}
                      rim={TEAL}
                      size={48}
                    />
                    <View style={styles.benefInfo}>
                      <Text style={styles.benefName}>{b.name}</Text>
                      <Text style={styles.benefSub}>
                        {b.bank}{"  ·  "}{b.account}
                      </Text>
                    </View>
                  </Pressable>
                </React.Fragment>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ═══════ Styles ═══════════════════════════════════════════ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  headerTitle: { fontSize: 18, color: WHITE, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  iconBtnFlat: { width: 30, height: 36, alignItems: "center", justifyContent: "center" },

  /* scroll */
  scroll: { paddingHorizontal: 16, paddingTop: 8, gap: 16 },

  /* banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: BANNER_BG,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  bannerText: { flex: 1, fontSize: 13.5, color: "#CCCCCC", fontFamily: "Inter_400Regular", lineHeight: 19 },
  bannerBold: { color: WHITE, fontFamily: "Inter_600SemiBold" },

  /* promo card */
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: GREEN_BG,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  promoText: { flex: 1, gap: 4 },
  promoLine: { fontSize: 14, color: "#B4E8C8", fontFamily: "Inter_400Regular", lineHeight: 20 },
  promoGreen: { color: GREEN_TXT, fontFamily: "Inter_700Bold" },
  promoGold: { color: AMBER, fontFamily: "Inter_700Bold" },

  /* section */
  section: { gap: 10 },
  label: { fontSize: 13.5, color: MUTED, fontFamily: "Inter_400Regular" },

  /* paying-from card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURFACE,
    borderRadius: 14,
    padding: 14,
  },
  acctAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#3D2A08",
    alignItems: "center",
    justifyContent: "center",
  },
  acctInitial: { fontSize: 16, color: "#FFD580", fontFamily: "Inter_700Bold" },
  acctInfo: { flex: 1, gap: 4 },
  acctName: { fontSize: 14, color: WHITE, fontFamily: "Inter_500Medium", letterSpacing: -0.1 },
  acctNum: { color: MUTED, fontFamily: "Inter_400Regular" },
  acctBalance: { fontSize: 16, color: WHITE, fontFamily: "Inter_700Bold" },

  /* account input */
  inputCard: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingVertical: 0,
    overflow: "hidden",
  },
  inputField: {
    fontSize: 28,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 6,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  inputHint: { fontSize: 12, color: MUTED, fontFamily: "Inter_400Regular", paddingHorizontal: 4 },
  proceedBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 14,
  },
  proceedTxt: { fontSize: 15, color: WHITE, fontFamily: "Inter_600SemiBold" },

  /* recipient card */
  recipientCard: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    gap: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: SURFACE2,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: WHITE,
    fontFamily: "Inter_400Regular",
    padding: 0,
    margin: 0,
  },

  /* tabs */
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabsLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  tabPill: { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  tabTxt: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  viewAll: { fontSize: 14, color: AMBER, fontFamily: "Inter_600SemiBold" },

  /* beneficiary */
  benefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  benefInfo: { flex: 1 },
  benefName: { fontSize: 15, color: WHITE, fontFamily: "Inter_600SemiBold", marginBottom: 3 },
  benefSub: { fontSize: 13, color: MUTED, fontFamily: "Inter_400Regular" },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: "#222222", marginHorizontal: 2 },
  emptyRow: { paddingVertical: 28, alignItems: "center" },
  emptyTxt: { fontSize: 14, color: MUTED, fontFamily: "Inter_400Regular" },
});
