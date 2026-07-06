import React, { useCallback } from "react";
import {
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { BalanceShield } from "@/components/BalanceShield";
import { CardCarousel } from "@/components/CardCarousel";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem } from "@/components/TransactionItem";
import { PromoBanner } from "@/components/PromoBanner";
import { TpIcon } from "@/components/TpIcon";
import { QRIcon, SupportIcon, BellIcon } from "@/components/BankIcons";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const { user, transactions, cards, showBalance, toggleShowBalance, freezeCard } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 96 + (Platform.OS === "web" ? 34 : 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const recentTx = transactions.slice(0, 2);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/dashboard_bg_new.png")}
        style={{ position: "absolute", top: 0, left: 0, width: winWidth, height: winHeight }}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />
      <StatusBar style="light" />

      {/* Fixed header — lives outside the ScrollView so it never scrolls */}
      <View style={[styles.fixedHeader, { paddingTop: topPad + 8 }]}>
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/icon_transparent.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={[styles.brandText, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Welcome to Trust Point
          </Text>
        </View>

        <View style={styles.header}>
          <Pressable onPress={() => router.push("/(main)/more")} style={styles.identity}>
            <Avatar
              initials={user?.initials ?? "JD"}
              color={user?.avatarColor ?? colors.primary}
              size={44}
            />
            <View>
              <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                {greeting()}
              </Text>
              <Text style={[styles.name, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {user?.name?.split(" ")[0] ?? "Friend"}
              </Text>
            </View>
          </Pressable>
          <View style={styles.headerRight}>
            <HeaderIconButton
              icon="qr-code"
              colors={colors}
              onPress={() => {}}
            />
            <HeaderIconButton
              icon="headset"
              colors={colors}
              onPress={() => {}}
            />
            <HeaderIconButton
              icon="bell"
              colors={colors}
              onPress={() => router.push("/notifications")}
              dot
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingTop: 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Balance Card */}
        <BalanceShield
          balance={user?.balance ?? 247560}
          income={user?.income ?? 450000}
          expenses={user?.expenses ?? 76015}
          showBalance={showBalance}
          onToggle={toggleShowBalance}
          accountNumber={user?.accountNumber ? formatAccount(user.accountNumber) : undefined}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActions
            actions={[
              { icon: "transfer", label: "Transfer", onPress: () => router.push("/transfer/method"), accent: true },
              { icon: "deposit", label: "Add Money", onPress: () => {} },
              { icon: "airtime", label: "Airtime", onPress: () => router.push("/(main)/payments") },
              { icon: "data", label: "Data", onPress: () => router.push("/(main)/payments") },
              { icon: "bills", label: "Bills", onPress: () => router.push("/(main)/payments") },
              { icon: "cards", label: "Cards", onPress: () => router.push("/(main)/cards") },
              { icon: "savings", label: "Savings", onPress: () => router.push("/savings") },
              { icon: "more", label: "More", onPress: () => router.push("/(main)/more") },
            ]}
          />
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              My Cards
            </Text>
            <Pressable onPress={() => router.push("/(main)/cards")}>
              <Text style={[styles.seeAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                See all
              </Text>
            </Pressable>
          </View>
          <CardCarousel
            cards={cards}
            onCardPress={(c) => router.push("/(main)/cards")}
            onFreezeCard={freezeCard}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Recent Transactions
            </Text>
          </View>
          {recentTx.length === 0 ? (
            <View style={styles.empty}>
              <TpIcon name="inbox" size={32} color={colors.mutedForeground} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                No transactions yet
              </Text>
            </View>
          ) : (
            <View style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentTx.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem
                    tx={tx}
                    onPress={() => router.push(`/transactions/${tx.id}` as any)}
                  />
                  {idx < recentTx.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          )}
          <Pressable
            onPress={() => router.push("/transactions")}
            style={[styles.viewAllBtn, { backgroundColor: colors.surfaceHigh, borderColor: colors.border }]}
          >
            <Text style={[styles.viewAllText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              View All Transactions
            </Text>
            <TpIcon name="chevron-right" size={15} color={colors.mutedForeground} strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Promotional Banner */}
        <View style={styles.section}>
          <PromoBanner onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

function formatAccount(acc: string) {
  if (acc.length < 4) return acc;
  return `${acc.slice(0, 2)}•• •••• ${acc.slice(-4)}`;
}

function HeaderIconButton({
  icon,
  colors,
  onPress,
  dot,
}: {
  icon: any;
  colors: any;
  onPress: () => void;
  dot?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.iconBtn,
        { backgroundColor: colors.surfaceHigh, borderColor: colors.borderStrong },
      ]}
      onPress={onPress}
    >
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)", "rgba(255,255,255,0.06)"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {icon === "qr-code" && <QRIcon size={18} color={colors.text} />}
      {icon === "headset" && <SupportIcon size={18} color={colors.text} />}
      {icon === "bell" && <BellIcon size={18} color={colors.text} />}
      {icon !== "qr-code" && icon !== "headset" && icon !== "bell" && (
        <TpIcon name={icon} size={18} color={colors.text} strokeWidth={1.9} />
      )}
      {dot && <View style={[styles.notifDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  overlay: { backgroundColor: "rgba(0,0,0,0.25)" },
  scroll: { paddingHorizontal: 20, gap: 26 },
  fixedHeader: { paddingHorizontal: 20, gap: 26, paddingBottom: 14 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: -4 },
  brandLogo: { width: 44, height: 44 },
  brandText: { fontSize: 22, letterSpacing: -0.4 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  identity: { flexDirection: "row", alignItems: "center", gap: 12 },
  greeting: { fontSize: 12.5, letterSpacing: 0.1 },
  name: { fontSize: 20, letterSpacing: -0.5, marginTop: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  notifDot: {
    position: "absolute",
    width: 9,
    height: 9,
    borderRadius: 5,
    top: 6,
    right: 6,
    borderWidth: 1.5,
  },
  section: { gap: 14 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  seeAll: { fontSize: 13 },
  txCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 16,
  },
  separator: { height: 0.5, marginHorizontal: 0 },
  empty: { alignItems: "center", gap: 8, paddingVertical: 32 },
  emptyText: { fontSize: 14 },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  viewAllText: { fontSize: 13.5 },
});
