import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, Ellipse, G, Line, LinearGradient as SvgGrad, Path, Rect, Stop } from "react-native-svg";
import { Avatar } from "@/components/Avatar";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";

/* ─── Palette ───────────────────────────────────────────── */
const BG       = "#000000";
const CARD     = "#0F0F0F";
const BORDER   = "#1E1E1E";
const ICON_BG  = "#1A0508";
const RED      = "#E11D33";
const RED_DIM  = "#9B1221";
const WHITE    = "#FFFFFF";
const MUTED    = "#666666";
const TEXT     = "#F5F5F5";

/* ─── Detailed SVG Icons ────────────────────────────────── */

/** TrustPoint-to-TrustPoint: paper plane with speed-lines & circuit node */
function IconSend({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* main plane body */}
      <Path
        d="M23 3L2 10.5L11 14M23 3L16 23L11 14M23 3L11 14"
        stroke={RED}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* speed lines */}
      <Line x1="2" y1="17" x2="7" y2="17" stroke={RED} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.5" />
      <Line x1="4" y1="20" x2="8" y2="20" stroke={RED} strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.3" />
      {/* node dot at tip */}
      <Circle cx="23" cy="3" r="1.5" fill={RED} />
      {/* circuit node */}
      <Circle cx="11" cy="14" r="1.2" fill={RED} fillOpacity="0.7" />
    </Svg>
  );
}

/** Other Banks: detailed bank building with columns & windows */
function IconBank({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* pediment / roof */}
      <Path d="M3 9L13 3L23 9H3Z" stroke={RED} strokeWidth="1.5" strokeLinejoin="round" fill={RED} fillOpacity="0.12" />
      {/* base platform */}
      <Rect x="2" y="21" width="22" height="2.5" rx="0.8" stroke={RED} strokeWidth="1.4" fill={RED} fillOpacity="0.08" />
      {/* sub-base */}
      <Rect x="3.5" y="19" width="19" height="2" rx="0.5" stroke={RED} strokeWidth="1.2" fill="none" />
      {/* columns */}
      <Rect x="5"  y="10" width="2.2" height="9" rx="1" fill={RED} fillOpacity="0.25" stroke={RED} strokeWidth="1.2" />
      <Rect x="9.4" y="10" width="2.2" height="9" rx="1" fill={RED} fillOpacity="0.25" stroke={RED} strokeWidth="1.2" />
      <Rect x="13.8" y="10" width="2.2" height="9" rx="1" fill={RED} fillOpacity="0.25" stroke={RED} strokeWidth="1.2" />
      <Rect x="18.2" y="10" width="2.2" height="9" rx="1" fill={RED} fillOpacity="0.25" stroke={RED} strokeWidth="1.2" />
      {/* keystone dot */}
      <Circle cx="13" cy="6.5" r="1.1" fill={RED} />
    </Svg>
  );
}

/** International: globe with meridians + flight arc */
function IconGlobe({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* outer ring */}
      <Circle cx="13" cy="13" r="10" stroke={RED} strokeWidth="1.5" fill={RED} fillOpacity="0.07" />
      {/* equator */}
      <Line x1="3" y1="13" x2="23" y2="13" stroke={RED} strokeWidth="1.2" strokeOpacity="0.6" />
      {/* vertical meridian */}
      <Line x1="13" y1="3" x2="13" y2="23" stroke={RED} strokeWidth="1.2" strokeOpacity="0.4" />
      {/* longitude curves */}
      <Path d="M13 3C10 7 10 19 13 23" stroke={RED} strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <Path d="M13 3C16 7 16 19 13 23" stroke={RED} strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      {/* latitude arcs */}
      <Path d="M4.5 8.5C7 9.5 19 9.5 21.5 8.5" stroke={RED} strokeWidth="1" strokeOpacity="0.35" fill="none" />
      <Path d="M4.5 17.5C7 16.5 19 16.5 21.5 17.5" stroke={RED} strokeWidth="1" strokeOpacity="0.35" fill="none" />
      {/* tiny plane dot + trail */}
      <Circle cx="18.5" cy="7.5" r="1.4" fill={RED} />
      <Path d="M10 10C13 8 16 7 18.5 7.5" stroke={RED} strokeWidth="1" strokeDasharray="1.5 1.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Schedule Transfer: calendar with embedded clock face */
function IconSchedule({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* calendar body */}
      <Rect x="2" y="5" width="17" height="17" rx="2.5" stroke={RED} strokeWidth="1.5" fill={RED} fillOpacity="0.07" />
      {/* header band */}
      <Rect x="2" y="5" width="17" height="5" rx="2.5" fill={RED} fillOpacity="0.18" />
      {/* date peg lines */}
      <Line x1="7" y1="3" x2="7" y2="7" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="13" y1="3" x2="13" y2="7" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      {/* day dots */}
      <Circle cx="6"  cy="14" r="1" fill={RED} fillOpacity="0.5" />
      <Circle cx="10.5" cy="14" r="1" fill={RED} fillOpacity="0.5" />
      {/* clock circle (overlapping bottom-right) */}
      <Circle cx="19.5" cy="19.5" r="5.5" fill={CARD} stroke={RED} strokeWidth="1.4" />
      {/* clock face ticks */}
      <Line x1="19.5" y1="15.5" x2="19.5" y2="16.4" stroke={RED} strokeWidth="1.1" strokeLinecap="round" />
      <Line x1="19.5" y1="22.6" x2="19.5" y2="23.5" stroke={RED} strokeWidth="1.1" strokeLinecap="round" />
      <Line x1="15.5" y1="19.5" x2="16.4" y2="19.5" stroke={RED} strokeWidth="1.1" strokeLinecap="round" />
      <Line x1="22.6" y1="19.5" x2="23.5" y2="19.5" stroke={RED} strokeWidth="1.1" strokeLinecap="round" />
      {/* clock hands */}
      <Line x1="19.5" y1="19.5" x2="19.5" y2="17" stroke={RED} strokeWidth="1.3" strokeLinecap="round" />
      <Line x1="19.5" y1="19.5" x2="21.5" y2="20.5" stroke={RED} strokeWidth="1.3" strokeLinecap="round" />
      {/* center dot */}
      <Circle cx="19.5" cy="19.5" r="0.8" fill={RED} />
    </Svg>
  );
}

/* ─── Transfer option icons map ─────────────────────────── */
type OptionKey = "tp" | "bank" | "intl" | "schedule";
const OPTION_ICONS: Record<OptionKey, React.ReactNode> = {
  tp:       <IconSend size={26} />,
  bank:     <IconBank size={26} />,
  intl:     <IconGlobe size={26} />,
  schedule: <IconSchedule size={26} />,
};

/* ═══════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export default function TransfersScreen() {
  const insets = useSafeAreaInsets();
  const { beneficiaries, transactions } = useApp();
  const topPad    = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);

  const favorites      = beneficiaries.filter((b) => b.favorite);
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
      {/* Solid icon container — no transparency */}
      <View style={styles.optIcon}>
        {OPTION_ICONS[iconKey]}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.optLabel}>{label}</Text>
        <Text style={styles.optSub}>{subtitle}</Text>
      </View>

      {/* Chevron */}
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
  optIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ICON_BG,
    borderWidth: 1,
    borderColor: "#2A0A10",
  },
  optLabel:  { fontSize: 15, marginBottom: 2, letterSpacing: -0.3, color: WHITE, fontFamily: "Inter_600SemiBold" },
  optSub:    { fontSize: 12, color: MUTED, fontFamily: "Inter_400Regular" },
  favItem:   { alignItems: "center", gap: 6, width: 60 },
  favName:   { fontSize: 11, textAlign: "center", color: MUTED, fontFamily: "Inter_500Medium" },
  txCard:    { borderRadius: 16, borderWidth: 1, padding: 4, paddingHorizontal: 16, backgroundColor: CARD, borderColor: BORDER },
  separator: { height: 0.5, backgroundColor: BORDER },
});
