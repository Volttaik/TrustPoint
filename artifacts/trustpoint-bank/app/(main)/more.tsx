import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { BankLogo } from "@/components/BankLogo";
import { AccountSwitcher } from "@/components/AccountSwitcher";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MENU_SECTIONS: {
  title: string;
  items: { icon: TpIconName; label: string; route: string | null; isTheme?: boolean; isAccounts?: boolean }[];
}[] = [
  {
    title: "Account",
    items: [
      { icon: "edit-2",      label: "Edit Profile",        route: "/settings/profile" },
      { icon: "trending-up", label: "Account Upgrade",     route: "/settings/upgrade" },
      { icon: "shield",      label: "KYC / Verification",  route: "/profile/kyc" },
      { icon: "refresh-cw",  label: "Manage Accounts",     route: null, isAccounts: true },
    ],
  },
  {
    title: "Finance",
    items: [
      { icon: "pie-chart",   label: "Savings & Goals",     route: "/savings" },
      { icon: "dollar-sign", label: "Loans",               route: "/loans" },
      { icon: "gift",        label: "Referrals & Rewards", route: "/referral" },
      { icon: "file-text",   label: "Account Statement",   route: "/statements" },
    ],
  },
  {
    title: "Security",
    items: [
      { icon: "shield",      label: "Security Settings",   route: "/settings/security" },
      { icon: "lock",        label: "Change PIN",          route: "/settings/change-pin" },
      { icon: "fingerprint", label: "Biometrics",          route: "/settings/biometrics" },
      { icon: "smartphone",  label: "Trusted Devices",     route: "/settings/devices" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "moon",        label: "Theme",               route: "/settings/theme", isTheme: true },
      { icon: "bell",        label: "Notifications",       route: "/settings/notifications" },
      { icon: "help-circle", label: "Help & Support",      route: "/settings/help" },
      { icon: "info",        label: "About TrustPoint",    route: "/settings/about" },
    ],
  },
];

export default function MoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout, toggleTheme, theme, linkedAccounts, activeAccountId } = useApp();
  const isDark = colors.background !== "#F4F5F7";
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const activeAccount    = linkedAccounts.find((a) => a.id === activeAccountId);
  const activeBankName   = activeAccount?.bankName    ?? "TrustPoint Bank";
  const activeAccountNum = activeAccount?.accountNumber ?? user?.accountNumber ?? "";

  const handleCopyAcct = async () => {
    const num = activeAccountNum;
    if (num) await Clipboard.setStringAsync(num);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const MenuItem = ({
    icon,
    label,
    route,
    isTheme,
    isAccounts,
  }: {
    icon: TpIconName;
    label: string;
    route: string | null;
    isTheme?: boolean;
    isAccounts?: boolean;
  }) => (
    <Pressable
      onPress={() => {
        if (isTheme) { toggleTheme(); return; }
        if (isAccounts) { setShowSwitcher(true); return; }
        if (route) router.push(route as any);
      }}
      style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.menuIcon, { backgroundColor: isDark ? "#1A1A1A" : colors.charcoal }]}>
        <TpIcon name={icon} size={17} color={colors.mutedForeground} strokeWidth={1.8} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {isTheme && (
          /* Monochrome black/white toggle: dark = white thumb, light = black thumb */
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{
              false: isDark ? "#2A2A2A" : "#D0D0D0",
              true:  isDark ? "#3A3A3A" : "#1A1A1A",
            }}
            thumbColor={theme === "dark" ? "#FFFFFF" : "#000000"}
            ios_backgroundColor={isDark ? "#2A2A2A" : "#D0D0D0"}
          />
        )}
        {isAccounts && (
          <View style={styles.linkedBadge}>
            <Text style={[styles.linkedCount, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              {linkedAccounts.length}
            </Text>
          </View>
        )}
        {!isTheme && !isAccounts && (
          <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Avatar initials={user?.initials ?? "JD"} color={user?.avatarColor ?? colors.primary} size={64} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.profileName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {user?.name ?? "John Doe"}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {user?.email ?? "user@email.com"}
            </Text>
            <View style={[styles.tierBadge, { backgroundColor: colors.primary + "22" }]}>
              <Text style={[styles.tierText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                Tier {user?.tier ?? 1} Account
              </Text>
            </View>
          </View>
          <Pressable onPress={() => router.push("/settings/profile")}>
            <TpIcon name="edit-2" size={20} color={colors.mutedForeground} strokeWidth={1.8} />
          </Pressable>
        </View>

        {/* Active account card */}
        <Pressable
          onPress={() => setShowSwitcher(true)}
          style={[styles.activeAcctCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <BankLogo bankName={activeBankName} size={42} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.acctLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Active Account
            </Text>
            <Text style={[styles.acctBankName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {activeBankName}
            </Text>
            <Text style={[styles.acctNum, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {user?.accountNumber ?? "—"}
            </Text>
          </View>
          <View style={[styles.switchTag, { backgroundColor: colors.primary + "18" }]}>
            <TpIcon name="refresh-cw" size={13} color={colors.primary} strokeWidth={2} />
            <Text style={[styles.switchTagTxt, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Switch
            </Text>
          </View>
        </Pressable>

        {/* Account number copy */}
        <View style={[styles.acctCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.acctLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Account Number
            </Text>
            <Text style={[styles.acctNumLarge, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {activeAccountNum || "1234567890"}
            </Text>
          </View>
          <Pressable onPress={handleCopyAcct} style={[styles.copyBtn, { backgroundColor: colors.primary + "18" }]}>
            <TpIcon name="copy" size={16} color={colors.primary} strokeWidth={1.8} />
            <Text style={[styles.copyText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>Copy</Text>
          </Pressable>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {[
            { icon: "arrow-down-left" as TpIconName, label: "Receive", route: "/deposit" },
            { icon: "qr-code" as TpIconName, label: "QR Pay", route: "/qr" },
            { icon: "zap" as TpIconName, label: "Airtime", route: "/airtime" },
            { icon: "file-text" as TpIconName, label: "Statement", route: "/statements" },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.route as any)}
              style={[styles.quickItem, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: colors.primary + "18" }]}>
                <TpIcon name={item.icon} size={18} color={colors.primary} strokeWidth={1.8} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {section.title.toUpperCase()}
            </Text>
            <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.label}>
                  <MenuItem {...item} />
                  {idx < section.items.length - 1 && (
                    <View style={[styles.sep, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <Pressable
          onPress={handleLogout}
          style={[
            styles.logoutBtn,
            { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "33" },
          ]}
        >
          <TpIcon name="log-out" size={20} color={colors.destructive} strokeWidth={1.8} />
          <Text style={[styles.logoutText, { color: colors.destructive, fontFamily: "Inter_600SemiBold" }]}>
            Logout
          </Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          TrustPoint Bank v1.0.0
        </Text>
      </ScrollView>

      <AccountSwitcher visible={showSwitcher} onClose={() => setShowSwitcher(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 16 },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  profileName: { fontSize: 18, letterSpacing: -0.5 },
  profileEmail: { fontSize: 13, marginBottom: 6 },
  tierBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  tierText: { fontSize: 11 },

  activeAcctCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  acctBankName: { fontSize: 15, letterSpacing: -0.2 },
  switchTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  switchTagTxt: { fontSize: 12 },

  acctCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  acctLabel: { fontSize: 12, marginBottom: 4 },
  acctNum: { fontSize: 12, letterSpacing: 0.5 },
  acctNumLarge: { fontSize: 18, letterSpacing: 2 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  copyText: { fontSize: 13 },
  quickRow: { flexDirection: "row", gap: 10 },
  quickItem: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  quickIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 11 },
  sectionTitle: { fontSize: 11, letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  menuCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 14 },
  menuRight: { alignItems: "center", justifyContent: "center" },
  linkedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  linkedCount: { fontSize: 14 },
  sep: { height: 0.5, marginLeft: 64 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  logoutText: { fontSize: 15 },
  version: { fontSize: 12, textAlign: "center", paddingBottom: 8 },
});
