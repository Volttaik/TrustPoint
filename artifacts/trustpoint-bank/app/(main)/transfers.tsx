import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TransfersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaries, transactions } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);

  const favorites = beneficiaries.filter((b) => b.favorite);
  const recentTransfers = transactions.filter((t) => t.category === "Transfer").slice(0, 5);

  const TransferOption = ({ icon, label, subtitle, color, onPress }: { icon: TpIconName; label: string; subtitle: string; color: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: colors.card, borderColor: pressed ? colors.primary : colors.border, opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.optIcon, { backgroundColor: color + "22" }]}>
        <TpIcon name={icon} size={22} color={color} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.optLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{label}</Text>
        <Text style={[styles.optSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{subtitle}</Text>
      </View>
      <TpIcon name="chevron-right" size={18} color={colors.mutedForeground} strokeWidth={2} />
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Transfer</Text>

        <View style={styles.section}>
          <TransferOption
            icon="send"
            label="TrustPoint to TrustPoint"
            subtitle="Instant, free transfer"
            color={colors.primary}
            onPress={() => router.push("/transfer/method")}
          />
          <TransferOption
            icon="shuffle"
            label="Other Banks"
            subtitle="Transfer to any Nigerian bank"
            color={colors.success}
            onPress={() => router.push("/transfer/method")}
          />
          <TransferOption
            icon="globe"
            label="International"
            subtitle="Send money abroad"
            color={colors.info}
            onPress={() => {}}
          />
          <TransferOption
            icon="calendar"
            label="Schedule Transfer"
            subtitle="Set a future payment"
            color={colors.warning}
            onPress={() => {}}
          />
        </View>

        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Favourite Contacts
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>
              {favorites.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => router.push("/transfer/method")}
                  style={styles.favItem}
                >
                  <Avatar initials={b.initials} color={b.avatarColor} size={52} />
                  <Text style={[styles.favName, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]} numberOfLines={1}>
                    {b.name.split(" ")[0]}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {recentTransfers.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Recent
            </Text>
            <View style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {recentTransfers.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem tx={tx} onPress={() => router.push(`/transactions/${tx.id}` as any)} />
                  {idx < recentTransfers.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  title: { fontSize: 28, letterSpacing: -1 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  optIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  optLabel: { fontSize: 15, marginBottom: 2, letterSpacing: -0.3 },
  optSub: { fontSize: 12 },
  favItem: { alignItems: "center", gap: 6, width: 60 },
  favName: { fontSize: 11, textAlign: "center" },
  txCard: { borderRadius: 16, borderWidth: 1, padding: 4, paddingHorizontal: 16 },
  separator: { height: 0.5 },
});
