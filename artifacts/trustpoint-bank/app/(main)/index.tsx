import React, { useCallback } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { BalanceShield } from "@/components/BalanceShield";
import { CardCarousel } from "@/components/CardCarousel";
import { QuickActions } from "@/components/QuickActions";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, transactions, cards, showBalance, toggleShowBalance, freezeCard } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const recentTx = transactions.slice(0, 6);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              {greeting()},
            </Text>
            <Text style={[styles.name, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {user?.name?.split(" ")[0] ?? "Friend"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable
              style={[styles.iconBtn, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/notifications")}
            >
              <TpIcon name="bell" size={20} color={colors.text} strokeWidth={1.8} />
              <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
            </Pressable>
            <Pressable onPress={() => router.push("/(main)/more")}>
              <Avatar
                initials={user?.initials ?? "JD"}
                color={user?.avatarColor ?? colors.primary}
                size={40}
              />
            </Pressable>
          </View>
        </View>

        {/* Balance Shield */}
        <BalanceShield
          balance={user?.balance ?? 247560}
          income={user?.income ?? 450000}
          expenses={user?.expenses ?? 76015}
          showBalance={showBalance}
          onToggle={toggleShowBalance}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActions
            actions={[
              { icon: "send", label: "Send", onPress: () => router.push("/transfer/method") },
              { icon: "arrow-down-left", label: "Request", onPress: () => {} },
              { icon: "zap", label: "Pay Bills", onPress: () => router.push("/(main)/payments") },
              { icon: "trending-up", label: "Invest", onPress: () => router.push("/savings") },
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
            <Pressable onPress={() => router.push("/transactions")}>
              <Text style={[styles.seeAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
                See all
              </Text>
            </Pressable>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 13 },
  name: { fontSize: 24, letterSpacing: -0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: { position: "absolute", width: 8, height: 8, borderRadius: 4, top: 8, right: 8 },
  section: { gap: 14 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  seeAll: { fontSize: 13 },
  txCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 16,
  },
  separator: { height: 0.5, marginHorizontal: 0 },
  empty: { alignItems: "center", gap: 8, paddingVertical: 32 },
  emptyText: { fontSize: 14 },
});
