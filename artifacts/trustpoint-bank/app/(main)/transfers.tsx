import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon } from "@/components/TpIcon";
import {
  TransferIcon,
  OtherBanksIcon,
  InternationalIcon,
  ScheduleIcon,
} from "@/components/BankIcons";
import { useApp } from "@/context/AppContext";

/* ─── Palette ───────────────────────────────────────────── */
const BG      = "#000000";
const CARD    = "#0F0F0F";
const BORDER  = "#1E1E1E";
const ICON_BG = "#111111";
const WHITE   = "#FFFFFF";
const MUTED   = "#666666";
const TEXT    = "#F5F5F5";
const RED     = "#E11D33";
const RED_DIM = "#9B1221";

/* ─── Icon size rendered inside the tile ───────────────── */
const ICON_SIZE = 34;

type OptionKey = "tp" | "bank" | "intl" | "schedule";

function OptionIcon({ k }: { k: OptionKey }) {
  switch (k) {
    case "tp":       return <TransferIcon      size={ICON_SIZE} />;
    case "bank":     return <OtherBanksIcon    size={ICON_SIZE} />;
    case "intl":     return <InternationalIcon size={ICON_SIZE} />;
    case "schedule": return <ScheduleIcon      size={ICON_SIZE} />;
  }
}

/* ═══════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export default function TransfersScreen() {
  const insets = useSafeAreaInsets();
  const { beneficiaries, transactions } = useApp();
  const topPad     = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad  = 90 + (Platform.OS === "web" ? 34 : 0);

  const favorites       = beneficiaries.filter((b) => b.favorite);
  const recentTransfers = transactions.filter((t) => t.category === "Transfer").slice(0, 5);

  const TransferOption = ({
    iconKey, label, subtitle, onPress,
  }: { iconKey: OptionKey; label: string; subtitle: string; onPress: () => void }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { opacity: pressed ? 0.85 : 1, borderColor: pressed ? RED_DIM : BORDER },
      ]}
    >
      {/* Solid icon circle — mirrors QuickActions iconCircle */}
      <View style={styles.optIcon}>
        <OptionIcon k={iconKey} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.optLabel}>{label}</Text>
        <Text style={styles.optSub}>{subtitle}</Text>
      </View>

      <TpIcon name="chevron-right" size={17} color={MUTED} strokeWidth={2.2} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Transfer</Text>

        <View style={styles.section}>
          <TransferOption
            iconKey="tp"
            label="TrustPoint to TrustPoint"
            subtitle="Instant, free transfer"
            onPress={() => router.push("/transfer")}
          />
          <TransferOption
            iconKey="bank"
            label="Other Banks"
            subtitle="Transfer to any Nigerian bank"
            onPress={() => router.push("/transfer")}
          />
          <TransferOption
            iconKey="intl"
            label="International"
            subtitle="Send money abroad"
            onPress={() => {}}
          />
          <TransferOption
            iconKey="schedule"
            label="Schedule Transfer"
            subtitle="Set a future payment"
            onPress={() => {}}
          />
        </View>

        {favorites.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favourite Contacts</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}
            >
              {favorites.map((b) => (
                <Pressable key={b.id} onPress={() => router.push("/transfer")} style={styles.favItem}>
                  <Avatar initials={b.initials} color={b.avatarColor} size={52} />
                  <Text style={styles.favName} numberOfLines={1}>{b.name.split(" ")[0]}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {recentTransfers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <View style={styles.txCard}>
              {recentTransfers.map((tx, idx) => (
                <React.Fragment key={tx.id}>
                  <TransactionItem tx={tx} onPress={() => router.push(`/transactions/${tx.id}` as any)} />
                  {idx < recentTransfers.length - 1 && <View style={styles.separator} />}
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
  container:    { flex: 1, backgroundColor: BG },
  scroll:       { paddingHorizontal: 20, gap: 24 },
  title:        { fontSize: 28, letterSpacing: -1, color: WHITE, fontFamily: "Inter_700Bold" },
  section:      { gap: 10 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3, color: TEXT, fontFamily: "Inter_600SemiBold" },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: CARD,
    borderColor: BORDER,
  },
  /* mirrors QuickActions iconCircle — solid dark circle, same size feel */
  optIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ICON_BG,
    overflow: "hidden",
  },
  optLabel:  { fontSize: 15, marginBottom: 2, letterSpacing: -0.3, color: WHITE, fontFamily: "Inter_600SemiBold" },
  optSub:    { fontSize: 12, color: MUTED, fontFamily: "Inter_400Regular" },
  favItem:   { alignItems: "center", gap: 6, width: 60 },
  favName:   { fontSize: 11, textAlign: "center", color: MUTED, fontFamily: "Inter_500Medium" },
  txCard:    { borderRadius: 16, borderWidth: 1, padding: 4, paddingHorizontal: 16, backgroundColor: CARD, borderColor: BORDER },
  separator: { height: 0.5, backgroundColor: BORDER },
});
