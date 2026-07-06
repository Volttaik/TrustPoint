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
import { LinearGradient } from "expo-linear-gradient";
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
import { useColors } from "@/hooks/useColors";
import { TpIcon } from "@/components/TpIcon";

/* ─────────────── colour vocabulary matching BankIcons ─── */
const R       = "#E11D33";
const R_LIGHT = "#FF5D6C";
const R_DARK  = "#8E0E1E";
const W       = "#FFFFFF";
const RIM     = "rgba(255,255,255,0.55)";
const BLK_LT  = "#3A3A3F";
const BLK_DK  = "#000000";

/* ─── Lightning bolt — used in blue instant-transfer banner ─ */
function InstantBadgeIcon({ size = 22 }: { size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGrad id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2563EB" />
          <Stop offset="1" stopColor="#1040B0" />
        </SvgGrad>
        <SvgGrad id={`${id}-bolt`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="rgba(255,255,255,0.7)" />
        </SvgGrad>
      </Defs>
      {/* rounded-square base plate */}
      <Rect x="1" y="1" width="22" height="22" rx="6" fill={`url(#${id}-bg)`} stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      <Rect x="1" y="1" width="22" height="6" rx="3" fill={W} fillOpacity="0.08" />
      {/* bolt */}
      <Path d="M13.2 3.4L7.6 12.8H11.8L10.8 20.6L16.4 11.2H12.2Z" fill={`url(#${id}-bolt)`} />
      <Path d="M13.2 3.4L7.6 12.8H11.8" stroke={W} strokeOpacity="0.3" strokeWidth="0.4" fill="none" />
    </Svg>
  );
}

/* ─── Money-stack — cashback promo card icon ─────────── */
function CashbackIcon({ size = 34 }: { size?: number }) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGrad id={`${id}-note`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </SvgGrad>
        <SvgGrad id={`${id}-stack`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#1A5C2A" />
          <Stop offset="1" stopColor="#0A2F14" />
        </SvgGrad>
        <SvgGrad id={`${id}-coin`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F5C842" />
          <Stop offset="1" stopColor="#B8860B" />
        </SvgGrad>
      </Defs>
      {/* back note stack — dark green */}
      <Rect x="2.5" y="9" width="16" height="9" rx="1.8" fill={`url(#${id}-stack)`} stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
      <Rect x="2.5" y="9" width="16" height="3" rx="1.2" fill={W} fillOpacity="0.06" />
      {/* front red note — main feature */}
      <Rect x="1.4" y="6.4" width="17" height="9.8" rx="2" fill={`url(#${id}-note)`} stroke={R_DARK} strokeWidth="0.4" />
      <Rect x="1.4" y="6.4" width="17" height="3.2" rx="1.4" fill={W} fillOpacity="0.22" />
      <Circle cx="9.9" cy="11.3" r="2.4" fill={W} fillOpacity="0.9" />
      <Circle cx="9.9" cy="11.3" r="1.1" fill={R_DARK} />
      <Rect x="3.2" y="7.3" width="4" height="0.9" rx="0.45" fill={W} fillOpacity="0.3" />
      <Rect x="12.8" y="14.2" width="3.8" height="0.9" rx="0.45" fill={W} fillOpacity="0.3" />
      {/* gold coin — top right */}
      <Circle cx="18.8" cy="8.4" r="4.5" fill={`url(#${id}-coin)`} stroke="#8B6400" strokeWidth="0.4" />
      <Circle cx="17.8" cy="7.4" r="1.6" fill={W} fillOpacity="0.22" />
      <Path d="M17.2 8.6L18.8 10.2L21.2 6.8" stroke={W} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ─── Bank circle avatar for recipients ──────────────── */
function BankAvatar({ initials, color = "#0D3530", size = 44 }: { initials: string; color?: string; size?: number }) {
  const id = useId();
  const isDark = color.startsWith("#0") || color.startsWith("#1") || color.startsWith("#2");
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <Defs>
        <SvgGrad id={`${id}-bg`} x1="0.2" y1="0" x2="0.8" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0.6" />
        </SvgGrad>
      </Defs>
      <Circle cx="22" cy="22" r="21" fill={`url(#${id}-bg)`} stroke={isDark ? RIM : "rgba(0,0,0,0.12)"} strokeWidth="0.8" />
      <Circle cx="16" cy="20" r="2.5" fill={W} fillOpacity="0.12" />
    </Svg>
  );
}

/* ─── History clock icon (inline, no TpIcon needed) ──── */
function HistoryIcon({ size = 20, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M12 7.5V12.5L15 14.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M3.6 6L6.4 9M3.6 6L6.8 5.2M3.6 6L4.4 9.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

/* ─── Search magnifier ───────────────────────────────── */
function SearchIcon({ size = 16, color }: { size?: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M15.5 15.5L20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/* ─── Account-number formatter ───────────────────────── */
function formatAccount(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  return [a, b, c].filter(Boolean).join(" ");
}

/* ═══════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export default function TransferIndexScreen() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const { user, beneficiaries } = useApp();

  const [raw, setRaw]           = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "saved">("recent");
  const [search, setSearch]     = useState("");

  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + 120 + (Platform.OS === "web" ? 34 : 0);
  const isDark    = colors.background !== "#F4F5F7";

  const filtered  = beneficiaries.filter(
    (b) =>
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.account.includes(search),
  );

  /* colours that are always dark-mode regardless of system theme
     because the reference design is a premium dark-panel */
  const bannerBg   = "#071F42";
  const bannerBdr  = "#1A4FA0";
  const promoBg    = "#061A0F";
  const promoBdr   = "#0F4E24";
  const cardBg     = isDark ? "#111318" : colors.surface;
  const cardBdr    = isDark ? "#252830" : colors.border;
  const inputBg    = isDark ? "#181B21" : colors.surfaceElevated ?? "#ECEDF0";

  function handleAccountChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setRaw(digits);
  }

  function handleProceed() {
    if (raw.length < 10) return;
    router.push({
      pathname: "/transfer/amount",
      params: { accountNumber: raw },
    });
  }

  function handleBeneficiary(id: string) {
    router.push({
      pathname: "/transfer/amount",
      params: { beneficiaryId: id },
    });
  }

  const accountDisplay = raw.length > 0 ? formatAccount(raw) : "";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: cardBg, borderColor: cardBdr }]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={isDark ? ["rgba(255,255,255,0.05)", "transparent"] : ["rgba(0,0,0,0.04)", "transparent"]}
            style={StyleSheet.absoluteFill}
          />
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Start your transfer
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: cardBg, borderColor: cardBdr }]}>
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.05)", "transparent"] : ["rgba(0,0,0,0.04)", "transparent"]}
              style={StyleSheet.absoluteFill}
            />
            <HistoryIcon size={19} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: cardBg, borderColor: cardBdr }]}>
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.05)", "transparent"] : ["rgba(0,0,0,0.04)", "transparent"]}
              style={StyleSheet.absoluteFill}
            />
            <TpIcon name="more-horizontal" size={20} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Instant-transfer banner ── */}
        <View style={[styles.banner, { backgroundColor: bannerBg, borderColor: bannerBdr }]}>
          {/* left accent bar */}
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bannerAccent}
          />
          <InstantBadgeIcon size={24} />
          <Text style={[styles.bannerText, { fontFamily: "Inter_500Medium" }]}>
            TrustPoint to TrustPoint transfers are{" "}
            <Text style={{ color: "#60A5FA", fontFamily: "Inter_700Bold" }}>free & instant</Text>
          </Text>
        </View>

        {/* ── Cashback promo card ── */}
        <LinearGradient
          colors={[promoBg, "#0A2318"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.promoCard, { borderColor: promoBdr }]}
        >
          {/* top shine */}
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(255,255,255,0.06)", "transparent"]}
            style={styles.promoShine}
          />
          <View style={styles.promoLeft}>
            <Text style={[styles.promoLabel, { fontFamily: "Inter_500Medium" }]}>
              You've completed{" "}
              <Text style={{ color: "#4ADE80", fontFamily: "Inter_700Bold" }}>23 interbank</Text>
            </Text>
            <Text style={[styles.promoSub, { fontFamily: "Inter_400Regular" }]}>
              transfers this month 🎉
            </Text>
            <View style={styles.cashbackRow}>
              <View style={styles.cashbackBadge}>
                <Text style={[styles.cashbackAmt, { fontFamily: "Inter_700Bold" }]}>₦10 cashback</Text>
              </View>
              <Text style={[styles.cashbackMeta, { fontFamily: "Inter_400Regular" }]}>per transfer today</Text>
            </View>
          </View>
          <View style={styles.promoRight}>
            <CashbackIcon size={62} />
          </View>
        </LinearGradient>

        {/* ── Paying from ── */}
        <View style={styles.sectionGap}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Paying from
          </Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBdr }]}>
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.04)", "transparent"] : ["rgba(0,0,0,0.025)", "transparent"]}
              style={styles.cardShine}
            />
            {/* amber account avatar — matches dashboard quick-action tile style */}
            <LinearGradient
              colors={["#7A5A1A", "#3D2A08"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.9, y: 1 }}
              style={styles.accountAvatar}
            >
              <LinearGradient
                pointerEvents="none"
                colors={["rgba(255,255,255,0.28)", "transparent"]}
                style={styles.avatarShine}
              />
              <Text style={[styles.accountInitial, { fontFamily: "Inter_700Bold" }]}>
                {user?.initials?.slice(0, 1) ?? "T"}
              </Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.accountName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {user?.name ?? "TrustPoint Account"}
              </Text>
              <Text style={[styles.accountNum, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {user?.accountNumber
                  ? formatAccount(user.accountNumber) + " · TrustPoint"
                  : "0000 000 0000 · TrustPoint"}
              </Text>
            </View>
            <View style={styles.balancePill}>
              <Text style={[styles.balanceAmt, { color: "#4ADE80", fontFamily: "Inter_700Bold" }]}>
                ₦{((user?.balance ?? 0) / 1000).toFixed(1)}k
              </Text>
            </View>
          </View>
        </View>

        {/* ── Account number input ── */}
        <View style={styles.sectionGap}>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Enter account number
          </Text>
          <View style={[styles.inputCard, { backgroundColor: cardBg, borderColor: raw.length === 10 ? colors.primary : cardBdr }]}>
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.04)", "transparent"] : ["rgba(0,0,0,0.025)", "transparent"]}
              style={styles.cardShine}
            />
            <View style={[styles.inputInner, { backgroundColor: inputBg }]}>
              {raw.length === 0 ? (
                <Text style={[styles.inputPlaceholder, { color: isDark ? "#3A3E4A" : "#B0B3BC", fontFamily: "Inter_400Regular" }]}>
                  000  000  0000
                </Text>
              ) : (
                <Text style={[styles.inputValue, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                  {accountDisplay}
                </Text>
              )}
              <TextInput
                value={raw}
                onChangeText={handleAccountChange}
                keyboardType="number-pad"
                maxLength={10}
                style={styles.hiddenInput}
                caretHidden
              />
            </View>
            {raw.length === 10 && (
              <TouchableOpacity
                onPress={handleProceed}
                style={[styles.proceedBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.85}
              >
                <LinearGradient
                  pointerEvents="none"
                  colors={[R_LIGHT, R_DARK]}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0.9, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <TpIcon name="arrow-right" size={18} color={W} strokeWidth={2.2} />
              </TouchableOpacity>
            )}
          </View>
          {raw.length > 0 && raw.length < 10 && (
            <Text style={[styles.inputHint, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {10 - raw.length} more digit{10 - raw.length !== 1 ? "s" : ""}
            </Text>
          )}
        </View>

        {/* ── Select recipient ── */}
        <View style={styles.sectionGap}>
          <View style={styles.recipientHeader}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select recipient
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.colCard, { backgroundColor: cardBg, borderColor: cardBdr }]}>
            <LinearGradient
              pointerEvents="none"
              colors={isDark ? ["rgba(255,255,255,0.04)", "transparent"] : ["rgba(0,0,0,0.025)", "transparent"]}
              style={styles.cardShine}
            />
            {/* search bar */}
            <View style={[styles.searchBar, { backgroundColor: inputBg, borderColor: isDark ? "#252830" : colors.border }]}>
              <SearchIcon size={15} color={colors.mutedForeground} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search name or account number"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <TpIcon name="x" size={14} color={colors.mutedForeground} strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>

            {/* tabs */}
            <View style={styles.tabs}>
              {(["recent", "saved"] as const).map((tab) => {
                const active = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabPill,
                      active
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: "transparent" },
                    ]}
                  >
                    {active && (
                      <LinearGradient
                        pointerEvents="none"
                        colors={[R_LIGHT, R_DARK]}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.9, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                    )}
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: active ? W : colors.mutedForeground,
                          fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                        },
                      ]}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* beneficiary list */}
            {filtered.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  No recipients found
                </Text>
              </View>
            ) : (
              filtered.map((b, idx) => (
                <React.Fragment key={b.id}>
                  {idx > 0 && <View style={[styles.divider, { backgroundColor: cardBdr }]} />}
                  <Pressable
                    onPress={() => handleBeneficiary(b.id)}
                    style={({ pressed }) => [styles.benefRow, pressed && { opacity: 0.75 }]}
                  >
                    {/* avatar with gradient + initials overlay */}
                    <View style={styles.avatarWrap}>
                      <BankAvatar initials={b.initials} color={b.avatarColor} size={44} />
                      <View style={[styles.avatarText]}>
                        <Text style={[styles.avatarInitials, { color: W, fontFamily: "Inter_700Bold" }]}>
                          {b.initials.slice(0, 2).toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.benefName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                        {b.name}
                      </Text>
                      <Text style={[styles.benefSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                        {b.account} · {b.bank}
                      </Text>
                    </View>
                    <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
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
  root: { flex: 1 },

  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 17, letterSpacing: -0.4 },
  headerRight: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },

  /* scroll */
  scroll: { paddingHorizontal: 18, gap: 16 },

  /* instant-transfer banner */
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  bannerAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  bannerText: { flex: 1, fontSize: 13, color: "#93C5FD", lineHeight: 18 },

  /* promo card */
  promoCard: {
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    overflow: "hidden",
    gap: 12,
  },
  promoShine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 40,
    borderRadius: 18,
  },
  promoLeft: { flex: 1, gap: 6 },
  promoLabel: { fontSize: 13.5, color: "#D1FAE5", lineHeight: 18 },
  promoSub: { fontSize: 13, color: "#6EE7B7" },
  cashbackRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  cashbackBadge: { backgroundColor: "rgba(74,222,128,0.18)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  cashbackAmt: { fontSize: 12, color: "#4ADE80" },
  cashbackMeta: { fontSize: 12, color: "#6EE7B7" },
  promoRight: { alignItems: "center", justifyContent: "center" },

  /* row card — for paying-from */
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    overflow: "hidden",
    gap: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  /* column card — for recipient section */
  colCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
    overflow: "hidden",
    gap: 12,
    flexDirection: "column",
  },
  cardShine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 36,
    borderRadius: 18,
  },

  /* section */
  sectionGap: { gap: 10 },
  sectionLabel: { fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase" },

  /* paying-from */
  accountAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatarShine: { position: "absolute", top: 0, left: 0, right: 0, height: 22 },
  accountInitial: { fontSize: 18, color: "#FFD580" },
  accountName: { fontSize: 14, letterSpacing: -0.2 },
  accountNum: { fontSize: 12, marginTop: 2 },
  balancePill: { backgroundColor: "rgba(74,222,128,0.12)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  balanceAmt: { fontSize: 12 },

  /* account input */
  inputCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputInner: { flex: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  inputPlaceholder: { fontSize: 26, letterSpacing: 8 },
  inputValue: { fontSize: 26, letterSpacing: 5 },
  hiddenInput: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0,
  },
  inputHint: { fontSize: 12, paddingHorizontal: 4 },
  proceedBtn: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  /* recipient */
  recipientHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  viewAll: { fontSize: 13 },

  /* search */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 13.5, padding: 0, margin: 0 },

  /* tabs */
  tabs: { flexDirection: "row", gap: 8 },
  tabPill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    overflow: "hidden",
  },
  tabLabel: { fontSize: 13 },

  /* beneficiary row */
  benefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 2,
  },
  avatarWrap: { width: 44, height: 44, position: "relative" },
  avatarText: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: { fontSize: 14 },
  benefName: { fontSize: 14.5, letterSpacing: -0.2 },
  benefSub: { fontSize: 12, marginTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 2 },
  emptyRow: { paddingVertical: 24, alignItems: "center" },
  emptyText: { fontSize: 13 },
});
