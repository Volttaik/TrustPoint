import React, { useCallback } from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: winWidth } = Dimensions.get("window");
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { BalanceShield } from "@/components/BalanceShield";
import { CardCarousel } from "@/components/CardCarousel";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, transactions, cards, showBalance, toggleShowBalance, freezeCard } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const isDark    = colors.background !== "#F4F5F7";
  const topPad    = insets.top;
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Fixed header bar */}
      <LinearGradient
        colors={isDark ? ["#000000", "#080808"] : ["#FFFFFF", "#F4F5F7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.headerBar, { paddingTop: topPad }]}
      >
        <View style={styles.brandRow}>
          <Image
            source={require("@/assets/images/icon_transparent.png")}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={[styles.brandText, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            TrustPoint Bank
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingTop: 16, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* User greeting + action buttons */}
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
            <HeaderIconButton icon="qr-code" colors={colors} isDark={isDark} onPress={() => {}} />
            <HeaderIconButton icon="headset" colors={colors} isDark={isDark} onPress={() => {}} />
            <HeaderIconButton icon="bell" colors={colors} isDark={isDark} onPress={() => router.push("/notifications")} dot />
          </View>
        </View>

        {/* Balance Card */}
        <BalanceShield
          balance={user?.balance ?? 247560}
          income={user?.income ?? 450000}
          expenses={user?.expenses ?? 76015}
          showBalance={showBalance}
          onToggle={toggleShowBalance}
          accountNumber={user?.accountNumber}
          cardholderName={user?.name}
        />

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Services
            </Text>
            <Pressable>
              <Text style={[styles.seeAll, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                Edit
              </Text>
            </Pressable>
          </View>
          <QuickActions
            actions={[
              { icon: "shuffle",         label: "Transfer",  onPress: () => router.push("/transfer"), accent: true },
              { icon: "plus",            label: "Add Money", onPress: () => router.push("/deposit") },
              { icon: "phone",           label: "Airtime",   onPress: () => router.push("/(main)/payments") },
              { icon: "wifi",            label: "Data",      onPress: () => router.push("/(main)/payments") },
              { icon: "file-text",       label: "Bills",     onPress: () => router.push("/(main)/payments") },
              { icon: "credit-card",     label: "Cards",     onPress: () => router.push("/(main)/cards") },
              { icon: "trending-up",     label: "Savings",   onPress: () => router.push("/savings") },
              { icon: "more-horizontal", label: "More",      onPress: () => router.push("/(main)/more") },
            ]}
          />
        </View>

        {/* Rewards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Rewards
            </Text>
            <Pressable>
              <Text style={[styles.seeAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                View all
              </Text>
            </Pressable>
          </View>
          <View style={styles.rewardsRow}>
            <View style={[styles.rewardCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={require("@/assets/icons/passive_income.webp")}
                style={styles.rewardImg}
              />
              <Text style={[styles.rewardLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Cashback
              </Text>
              <Text style={[styles.rewardAmount, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                ₦0.00
              </Text>
            </View>
            <View style={[styles.rewardCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Image
                source={require("@/assets/icons/crowdfunding.webp")}
                style={styles.rewardImg}
              />
              <Text style={[styles.rewardLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Referrals
              </Text>
              <Text style={[styles.rewardAmount, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                ₦0.00
              </Text>
            </View>
          </View>
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
            onCardPress={() => router.push("/(main)/cards")}
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
  isDark,
  onPress,
  dot,
}: {
  icon: any;
  colors: any;
  isDark: boolean;
  onPress: () => void;
  dot?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.iconBtn,
        {
          backgroundColor: isDark ? "#111111" : colors.surfaceHigh,
          borderColor: colors.borderStrong,
        },
      ]}
      onPress={onPress}
    >
      <TpIcon name={icon} size={18} color={colors.text} strokeWidth={1.9} />
      {dot && (
        <View style={[styles.notifDot, { backgroundColor: colors.primary, borderColor: colors.background }]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 26 },
  headerBar: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandLogo: { width: 28, height: 28 },
  brandText: { fontSize: 16, letterSpacing: -0.3 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
  rewardsRow: { flexDirection: "row", gap: 12 },
  rewardCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
    minHeight: 130,
  },
  rewardImg: { width: 52, height: 52, resizeMode: "contain" },
  rewardLabel: { fontSize: 12, marginTop: 4 },
  rewardAmount: { fontSize: 18, letterSpacing: -0.5 },
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
