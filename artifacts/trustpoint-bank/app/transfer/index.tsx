import React, { useState } from "react";
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
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import type { Beneficiary } from "@/context/AppContext";

/* ─── Small inline SVGs ──────────────────────────────────────────────── */

function HistoryIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12A9 9 0 1 0 5.8 5.3"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 7V3M3 7H7"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 7v5l3 2"
        stroke={color}
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function InstantTransferIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect width="28" height="28" rx="7" fill="#1A6BFF" />
      <Path
        d="M15 6L8 15h7l-2 7 9-10h-7l2-6z"
        fill="#FFFFFF"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CashbackIcon({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <Path
        d="M6 22h24v3a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3z"
        fill="rgba(47,190,115,0.25)"
        stroke="rgba(47,190,115,0.4)"
        strokeWidth="1"
      />
      <Path
        d="M9 16h18v7H9z"
        fill="rgba(47,190,115,0.2)"
        stroke="rgba(47,190,115,0.35)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <Path
        d="M12 10h12v7H12z"
        fill="rgba(47,190,115,0.2)"
        stroke="rgba(47,190,115,0.35)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <Path
        d="M20 4l-3 4"
        stroke="#2FBE73"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        d="M16 4l3 4"
        stroke="#2FBE73"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function RecipientBankAvatar({ size = 48 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#0D3530",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#1A5548",
      }}
    >
      <Svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke="rgba(47,190,115,0.6)" strokeWidth="1.5" />
        <Path
          d="M8 12h8M14 9l3 3-3 3"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

/* ─── formatAccountNumber ────────────────────────────────────────────── */
function formatAccountNumber(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/* ─── Screen ─────────────────────────────────────────────────────────── */
export default function StartTransferScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, beneficiaries } = useApp();

  const [accountInput, setAccountInput] = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "saved">("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + 24;

  const isDark = colors.background === "#08090A";

  /* filter beneficiaries */
  const allFiltered = beneficiaries.filter((b) => {
    if (!searchQuery) return true;
    return (
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.account.includes(searchQuery)
    );
  });

  const displayed =
    activeTab === "saved"
      ? allFiltered.filter((b) => b.favorite)
      : allFiltered;

  const rawDigits = accountInput.replace(/\D/g, "");
  const canProceedWithAccount = rawDigits.length === 10;

  function handleAccountChange(text: string) {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setAccountInput(formatAccountNumber(digits));
  }

  function handleSelectBeneficiary(b: Beneficiary) {
    router.push({
      pathname: "/transfer/amount",
      params: { beneficiaryId: b.id },
    });
  }

  function handleAccountProceed() {
    if (!canProceedWithAccount) return;
    router.push({
      pathname: "/transfer/amount",
      params: { accountNumber: rawDigits },
    });
  }

  /* format user balance */
  const balanceDisplay = user
    ? `₦${user.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
    : "₦0.00";

  const userPhone = user?.phone
    ? user.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
    : "";

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: topPad + 10 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Start your transfer
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <HistoryIcon size={19} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <TpIcon name="more-horizontal" size={20} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Blue info banner ── */}
      <View style={styles.blueBanner}>
        <InstantTransferIcon size={26} />
        <Text style={[styles.bannerText, { fontFamily: "Inter_400Regular" }]}>
          TrustPoint to TrustPoint transfers are{" "}
          <Text style={[styles.bannerBold, { fontFamily: "Inter_600SemiBold" }]}>
            free &amp; instant
          </Text>
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Cashback promo card ── */}
        <View style={styles.promoCard}>
          <CashbackIcon size={40} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.promoText, { fontFamily: "Inter_400Regular" }]}>
              You've made{" "}
              <Text style={[styles.promoHighlight, { fontFamily: "Inter_600SemiBold" }]}>0</Text>
              {" "}of{" "}
              <Text style={[styles.promoHighlight, { fontFamily: "Inter_600SemiBold" }]}>50</Text>
              {" "}interbank transfers today.
            </Text>
            <Text style={[styles.promoText, { fontFamily: "Inter_400Regular" }]}>
              Transfer now to get{" "}
              <Text style={[styles.promoHighlight, { fontFamily: "Inter_600SemiBold" }]}>₦10</Text>
              {" "}cashback.
            </Text>
          </View>
        </View>

        {/* ── Paying from ── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Paying from
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.payingFromCard,
            {
              backgroundColor: colors.surface,
              borderColor: pressed ? colors.borderStrong : colors.border,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          {/* Avatar — amber square */}
          <View style={styles.avatarSquare}>
            <Text style={[styles.avatarInitials, { fontFamily: "Inter_700Bold" }]}>
              {user?.initials ?? "TP"}
            </Text>
          </View>

          <View style={{ flex: 1, gap: 3 }}>
            <View style={styles.payingFromRow}>
              <Text
                style={[styles.payingFromName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}
                numberOfLines={1}
              >
                {user?.name ?? "Account Holder"}
              </Text>
              {userPhone ? (
                <>
                  <View style={[styles.dot, { backgroundColor: colors.mutedForeground }]} />
                  <Text style={[styles.payingFromPhone, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {userPhone}
                  </Text>
                </>
              ) : null}
            </View>
            <Text style={[styles.payingFromBalance, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {balanceDisplay}
            </Text>
          </View>

          <TpIcon name="chevron-right" size={18} color={colors.mutedForeground} strokeWidth={2} />
        </Pressable>

        {/* ── Account number input ── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Enter recipient's account number
        </Text>

        <View style={[styles.accountInputWrap, { backgroundColor: colors.surfaceElevated, borderColor: canProceedWithAccount ? colors.success : colors.border }]}>
          <TextInput
            style={[styles.accountInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
            placeholder="000 000 0000"
            placeholderTextColor={colors.placeholder}
            value={accountInput}
            onChangeText={handleAccountChange}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleAccountProceed}
            maxLength={12} /* 10 digits + 2 spaces */
            selectionColor={colors.primary}
          />
          {canProceedWithAccount && (
            <TouchableOpacity
              style={[styles.accountProceedBtn, { backgroundColor: colors.primary }]}
              onPress={handleAccountProceed}
            >
              <TpIcon name="arrow-right" size={18} color="#fff" strokeWidth={2.2} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Select recipient ── */}
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          Select recipient
        </Text>

        <View style={[styles.recipientBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Search bar */}
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceElevated }]}>
            <TpIcon name="search" size={17} color={colors.placeholder} strokeWidth={1.8} />
            <TextInput
              style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
              placeholder="Search accounts"
              placeholderTextColor={colors.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <TpIcon name="x" size={14} color={colors.mutedForeground} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          {/* Tabs row */}
          <View style={styles.tabsRow}>
            <View style={styles.tabsLeft}>
              <TouchableOpacity
                onPress={() => setActiveTab("recent")}
                style={[
                  styles.tabPill,
                  activeTab === "recent"
                    ? styles.tabPillActive
                    : { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      fontFamily: activeTab === "recent" ? "Inter_700Bold" : "Inter_400Regular",
                      color: activeTab === "recent" ? "#1A0A00" : colors.mutedForeground,
                    },
                  ]}
                >
                  Recent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setActiveTab("saved")}
                style={[
                  styles.tabPill,
                  activeTab === "saved"
                    ? styles.tabPillActive
                    : { backgroundColor: "transparent" },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      fontFamily: activeTab === "saved" ? "Inter_700Bold" : "Inter_400Regular",
                      color: activeTab === "saved" ? "#1A0A00" : colors.mutedForeground,
                    },
                  ]}
                >
                  Saved
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.viewAll, { fontFamily: "Inter_600SemiBold" }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recipient list */}
          {displayed.length === 0 ? (
            <View style={styles.emptyState}>
              <TpIcon name="users" size={28} color={colors.mutedForeground} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {activeTab === "saved" ? "No saved recipients" : "No recent recipients"}
              </Text>
            </View>
          ) : (
            displayed.map((b, idx) => (
              <Pressable
                key={b.id}
                onPress={() => handleSelectBeneficiary(b)}
                style={({ pressed }) => [
                  styles.recipientItem,
                  {
                    borderTopWidth: idx === 0 ? 0 : StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                    backgroundColor: pressed ? colors.surfaceElevated : "transparent",
                  },
                ]}
              >
                <RecipientBankAvatar size={48} />
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={[styles.recipientName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {b.name}
                  </Text>
                  <Text style={[styles.recipientMeta, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {b.bank}
                    {"  ·  "}
                    {b.account}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  root: { flex: 1 },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 17,
    letterSpacing: -0.4,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  headerRight: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Blue banner */
  blueBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#0D2E5A",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  bannerText: {
    color: "#C8D8F0",
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  bannerBold: {
    color: "#FFFFFF",
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 0,
  },

  /* Promo card */
  promoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#0A2318",
    borderWidth: 1,
    borderColor: "#1A4A2E",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  promoText: {
    color: "#A8D4B8",
    fontSize: 13.5,
    lineHeight: 20,
  },
  promoHighlight: {
    color: "#2FBE73",
  },

  /* Section label */
  sectionLabel: {
    fontSize: 13,
    letterSpacing: 0.1,
    marginBottom: 8,
    marginTop: 2,
  },

  /* Paying from */
  payingFromCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  avatarSquare: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#7A4A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#F5D080",
    fontSize: 15,
  },
  payingFromRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  payingFromName: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  payingFromPhone: {
    fontSize: 12.5,
  },
  payingFromBalance: {
    fontSize: 17,
    letterSpacing: -0.5,
  },

  /* Account number input */
  accountInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
    minHeight: 64,
  },
  accountInput: {
    flex: 1,
    fontSize: 26,
    letterSpacing: 2,
    paddingVertical: 12,
  },
  accountProceedBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  /* Recipient block */
  recipientBlock: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },

  /* Search bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 0,
  },

  /* Tabs */
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  tabsLeft: {
    flexDirection: "row",
    gap: 6,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  tabPillActive: {
    backgroundColor: "#E3A008",
  },
  tabText: {
    fontSize: 13.5,
  },
  viewAll: {
    fontSize: 13.5,
    color: "#E3A008",
  },

  /* Recipient items */
  recipientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  recipientName: {
    fontSize: 14.5,
    letterSpacing: -0.2,
  },
  recipientMeta: {
    fontSize: 12.5,
  },

  /* Empty state */
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
  },
});
