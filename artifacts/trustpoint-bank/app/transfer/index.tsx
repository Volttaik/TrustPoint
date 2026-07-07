import React, { useId, useState, useEffect } from "react";
import {
  Image,
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
import { LinearGradient } from "expo-linear-gradient";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { TpIcon } from "@/components/TpIcon";

/* ─── Stable accent ──────────────────────────────────────── */
const RED    = "#E11D33";
const RED_DK = "#8E0E1E";

/* ─── Banner icon ───────────────────────────────────────── */
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
      <Path d="M7 9.5H9.5L13 7V17L9.5 14.5H7V9.5Z" fill="#fff" />
      <Path d="M15 9.5C16.2 10.4 16.2 13.6 15 14.5"
        stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M16.5 8C18.8 9.5 18.8 14.5 16.5 16"
        stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
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
      <Path d="M17 21 A9 9 0 0 1 32 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M31 15L33 19L29 19Z" fill="#fff" />
      <Path d="M35 31 A9 9 0 0 1 20 34" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Path d="M21 37L19 33L23 33Z" fill="#fff" />
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
  const colors = useColors();
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

  useEffect(() => {
    if (raw.length < 10) { setResolved(null); return; }
    const found = beneficiaries.find((b) => b.account.replace(/\D/g, "") === raw);
    setResolved(found
      ? { name: found.name, bank: found.bank }
      : { name: "TrustPoint User", bank: "TrustPoint Bank" });
  }, [raw, beneficiaries]);

  const savedBenefs  = beneficiaries.filter((b) => b.favorite);
  const recentBenefs = beneficiaries.filter((b) => !b.favorite);
  const sourceBenefs = activeTab === "saved" ? savedBenefs : recentBenefs;
  const filtered     = sourceBenefs.filter(
    (b) =>
      search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.account.includes(search)
  );

  function handleBeneficiary(id: string) {
    router.push({ pathname: "/transfer/amount", params: { beneficiaryId: id } });
  }
  function handleConfirm() {
    setShowConfirm(false);
    router.push({ pathname: "/transfer/amount", params: { accountNumber: raw } });
  }

  /* ── Derived dynamic style pieces ─────────────────── */
  const isDark = colors.background !== "#F4F5F7";

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ────────────────────────────────────── */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <TpIcon name="arrow-left" size={22} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Start your transfer
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} hitSlop={8}>
            <HistoryIcon size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtnFlat} hitSlop={8}>
            <TpIcon name="more-horizontal" size={20} color={colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Banner ─────────────────────────────────── */}
        <View style={[styles.banner, {
          backgroundColor: isDark ? "#12040A" : "#FFF0F2",
          borderColor: RED_DK + "44",
        }]}>
          <BannerIcon size={26} />
          <Text style={[styles.bannerText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            TrustPoint to TrustPoint transfers are{" "}
            <Text style={{ color: colors.text, fontFamily: "Inter_600SemiBold" }}>
              free &amp; instant
            </Text>
          </Text>
          <Image
            source={require("@/assets/icons/investment_flow.webp")}
            style={styles.bannerDeco}
            resizeMode="contain"
          />
        </View>

        {/* ── Paying from ─────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Paying from
          </Text>
          <LinearGradient
            colors={isDark ? ["#1C0408", "#120206", "#080101"] : ["#FFF5F6", "#FFF0F2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.senderCard, { borderColor: RED_DK + "55" }]}
          >
            {/* Decorative illustration */}
            <Image
              source={require("@/assets/icons/exchange_currency_rate.webp")}
              style={styles.senderDeco}
              resizeMode="contain"
            />
            {/* Avatar */}
            <View style={[styles.acctAvatar, { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={[styles.acctInitial, { color: "#fff", fontFamily: "Inter_700Bold" }]}>
                {user?.initials?.slice(0, 2).toUpperCase() ?? "TP"}
              </Text>
            </View>
            {/* Info */}
            <View style={styles.acctInfo}>
              <Text style={[styles.senderName, { fontFamily: "Inter_600SemiBold" }]} numberOfLines={1}>
                {user?.name ?? "TrustPoint Account"}
              </Text>
              <Text style={[styles.senderSub, { fontFamily: "Inter_400Regular" }]}>
                {user?.accountNumber ? fmtAcct(user.accountNumber) : "000 000 0000"}
              </Text>
              <Text style={[styles.senderBalance, { fontFamily: "Inter_700Bold" }]}>
                ₦{(user?.balance ?? 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Account number input ─────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Enter recipient's account number
          </Text>
          <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              value={fmtAcct(raw)}
              onChangeText={(t) => setRaw(t.replace(/\D/g, "").slice(0, 10))}
              keyboardType="number-pad"
              maxLength={12}
              style={[
                styles.inputField,
                {
                  color: raw.length === 0 ? colors.placeholder : colors.text,
                  fontFamily: "Inter_600SemiBold",
                },
              ]}
              placeholder="000 000 0000"
              placeholderTextColor={colors.placeholder}
              textAlign="center"
              cursorColor={RED}
              returnKeyType="done"
            />
          </View>

          {resolved && (
            <Pressable
              onPress={() => setShowConfirm(true)}
              style={({ pressed }) => [
                styles.resolvedRow,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <RecipientAvatar initials={resolved.name.slice(0, 2)} size={44} />
              <View style={styles.resolvedInfo}>
                <Text style={[styles.resolvedName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {resolved.name}
                </Text>
                <Text style={[styles.resolvedBank, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {resolved.bank}
                </Text>
              </View>
              <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2.2} />
            </Pressable>
          )}
        </View>

        {/* ── Select recipient ─────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text, fontFamily: "Inter_400Regular" }]}>
            Select recipient
          </Text>
          <View style={[styles.recipientCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {/* search */}
            <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TpIcon name="search" size={16} color={colors.mutedForeground} strokeWidth={1.8} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search accounts"
                placeholderTextColor={colors.placeholder}
                style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
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
                          : { backgroundColor: "transparent", borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.tabTxt, {
                        color: active ? RED : colors.mutedForeground,
                        fontFamily: "Inter_600SemiBold",
                      }]}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity hitSlop={8}>
                <Text style={[styles.viewAll, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* list */}
            {filtered.length === 0 ? (
              <View style={styles.emptyRow}>
                <Text style={[styles.emptyTxt, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  No recipients found
                </Text>
              </View>
            ) : (
              filtered.map((b, idx) => (
                <React.Fragment key={b.id}>
                  {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <Pressable
                    onPress={() => handleBeneficiary(b.id)}
                    style={({ pressed }) => [styles.benefRow, pressed && { opacity: 0.7 }]}
                  >
                    <RecipientAvatar initials={b.initials} size={48} />
                    <View style={styles.benefInfo}>
                      <Text style={[styles.benefName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                        {b.name}
                      </Text>
                      <Text style={[styles.benefSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
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

      {/* ══ Confirm bottom sheet ═══════════════════════ */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirm(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowConfirm(false)} />
        <View style={[styles.sheet, {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Confirm it's the right person
          </Text>

          <View style={[styles.recipientDetail, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <RecipientAvatar initials={resolved?.name?.slice(0, 2) ?? "TU"} size={56} />
            <Text style={[styles.recipientName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {resolved?.name ?? "Account Holder"}
            </Text>
            <Text style={[styles.recipientBank, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {resolved?.bank ?? "TrustPoint Bank"}
            </Text>
            <Text style={[styles.recipientAcct, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {fmtAcct(raw)}
            </Text>
          </View>

          <View style={styles.saveRow}>
            <Text style={[styles.saveTxt, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              Save recipient?
            </Text>
            <Switch
              value={saveRecipient}
              onValueChange={setSave}
              trackColor={{ false: colors.muted, true: RED + "88" }}
              thumbColor={saveRecipient ? RED : colors.mutedForeground}
            />
          </View>

          <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.changeBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowConfirm(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.changeTxt, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                Change
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: RED }]}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={[styles.confirmTxt, { fontFamily: "Inter_700Bold" }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ═══════ Styles ════════════════════════════════════════════ */
const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18, paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 18, letterSpacing: -0.3 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn:     { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  iconBtnFlat: { width: 30, height: 36, alignItems: "center", justifyContent: "center" },

  scroll: { paddingHorizontal: 16, paddingTop: 16, gap: 20 },

  banner: {
    flexDirection: "row", alignItems: "center", gap: 10,
    borderRadius: 12, borderWidth: 1,
    paddingVertical: 13, paddingHorizontal: 14,
  },
  bannerText: { flex: 1, fontSize: 13, lineHeight: 19 },
  bannerDeco: { width: 52, height: 52, opacity: 0.88 },

  section: { gap: 10 },
  label:   { fontSize: 13, paddingLeft: 2 },

  card: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 14,
  },
  senderCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 16, borderWidth: 1, padding: 16,
    overflow: "hidden",
  },
  senderDeco: {
    position: "absolute", right: -10, top: "50%",
    width: 90, height: 90, opacity: 0.25,
    transform: [{ translateY: -45 }],
  },
  senderName:    { fontSize: 14, color: "#fff", letterSpacing: -0.1 },
  senderSub:     { fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: 0.5 },
  senderBalance: { fontSize: 18, color: "#fff" },
  acctAvatar: {
    width: 44, height: 44, borderRadius: 11,
    borderWidth: 1, alignItems: "center", justifyContent: "center",
  },
  acctInitial: { fontSize: 15 },
  acctInfo:    { flex: 1, gap: 4 },
  acctName:    { fontSize: 14, letterSpacing: -0.1 },
  acctBalance: { fontSize: 17 },

  inputCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  inputField: {
    fontSize: 28, letterSpacing: 6,
    paddingVertical: 22, paddingHorizontal: 16, width: "100%",
  },

  resolvedRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    borderRadius: 14, borderWidth: 1, padding: 12,
  },
  resolvedInfo: { flex: 1 },
  resolvedName: { fontSize: 15, marginBottom: 2 },
  resolvedBank: { fontSize: 12 },

  recipientCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },

  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    margin: 12, borderRadius: 10, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },

  tabsRow:  { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingBottom: 6 },
  tabsLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabPill:  { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1 },
  tabTxt:   { fontSize: 13 },
  viewAll:  { fontSize: 13 },

  benefRow:  { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  benefInfo: { flex: 1 },
  benefName: { fontSize: 15, marginBottom: 2 },
  benefSub:  { fontSize: 12 },
  divider:   { height: StyleSheet.hairlineWidth, marginHorizontal: 14 },
  emptyRow:  { paddingVertical: 28, alignItems: "center" },
  emptyTxt:  { fontSize: 14 },

  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.72)" },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 36 : 24,
    paddingTop: 12,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 17, letterSpacing: -0.4,
    textAlign: "center", marginBottom: 18,
  },
  recipientDetail: {
    borderRadius: 16, borderWidth: 1,
    paddingVertical: 22, paddingHorizontal: 16,
    alignItems: "center", gap: 6,
  },
  recipientName: { fontSize: 18, letterSpacing: -0.4, textAlign: "center" },
  recipientBank: { fontSize: 13, textAlign: "center" },
  recipientAcct: { fontSize: 13, letterSpacing: 2, textAlign: "center" },

  saveRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingVertical: 18,
  },
  saveTxt: { fontSize: 15 },

  sheetDivider: { height: StyleSheet.hairlineWidth, marginBottom: 18 },

  btnRow:    { flexDirection: "row", gap: 12 },
  changeBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 14,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  changeTxt: { fontSize: 15 },
  confirmBtn: {
    flex: 2, paddingVertical: 15, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  confirmTxt: { fontSize: 15, color: "#fff" },
});
