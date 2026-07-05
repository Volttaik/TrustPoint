import React from "react";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const METHODS = [
  {
    id: "internal",
    label: "TrustPoint to TrustPoint",
    subtitle: "Instant, zero charges",
    icon: "zap",
    badge: "Free",
    badgeColor: "#34C759",
  },
  {
    id: "external",
    label: "Other Banks",
    subtitle: "Transfer to any Nigerian bank",
    icon: "shuffle",
    badge: "₦10",
    badgeColor: "#FF9500",
  },
  {
    id: "international",
    label: "International",
    subtitle: "Send money abroad",
    icon: "globe",
    badge: "FX rate applies",
    badgeColor: "#007AFF",
  },
];

export default function TransferMethodScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Transfer Money
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          How would you like to send money?
        </Text>

        {METHODS.map((m, idx) => (
          <Pressable
            key={m.id}
            onPress={() => router.push("/transfer/beneficiary")}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: pressed ? colors.primary : colors.border,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <View style={[styles.cardIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name={m.icon as any} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {m.label}
              </Text>
              <Text style={[styles.cardSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {m.subtitle}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: m.badgeColor + "22" }]}>
              <Text style={[styles.badgeText, { color: m.badgeColor, fontFamily: "Inter_600SemiBold" }]}>
                {m.badge}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { flex: 1, paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  subtitle: { fontSize: 15, marginBottom: 8 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  cardIcon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, marginBottom: 3, letterSpacing: -0.3 },
  cardSub: { fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 11 },
});
