import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const SAVING_GOALS: { id: string; name: string; target: number; saved: number; icon: TpIconName; color: string }[] = [
  { id: "1", name: "New iPhone", target: 800000, saved: 350000, icon: "smartphone", color: "#007AFF" },
  { id: "2", name: "Emergency Fund", target: 500000, saved: 500000, icon: "shield", color: "#34C759" },
  { id: "3", name: "Vacation", target: 1000000, saved: 120000, icon: "map", color: "#FF9500" },
];

const PRODUCTS = [
  { id: "fd", name: "Fixed Deposit", rate: "12% p.a.", minAmount: "₦100,000", risk: "Low", color: "#34C759" },
  { id: "hh", name: "Halal Savings", rate: "8% p.a.", minAmount: "₦10,000", risk: "Low", color: "#007AFF" },
  { id: "mf", name: "Mutual Fund", rate: "18-24% p.a.", minAmount: "₦5,000", risk: "Medium", color: "#FF9500" },
  { id: "eq", name: "Equity Portfolio", rate: "25%+ p.a.", minAmount: "₦50,000", risk: "High", color: "#E63946" },
];

export default function SavingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const totalSaved = SAVING_GOALS.reduce((s, g) => s + g.saved, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Savings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.totalCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.totalLabel, { fontFamily: "Inter_500Medium" }]}>Total Saved</Text>
          <Text style={[styles.totalAmount, { fontFamily: "Inter_700Bold" }]}>
            ₦{totalSaved.toLocaleString("en-NG")}
          </Text>
          <Text style={[styles.totalSub, { fontFamily: "Inter_400Regular" }]}>
            Across {SAVING_GOALS.length} goals
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Savings Goals
            </Text>
            <TouchableOpacity>
              <Text style={[styles.addGoal, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                + Add Goal
              </Text>
            </TouchableOpacity>
          </View>
          {SAVING_GOALS.map((goal) => {
            const progress = (goal.saved / goal.target) * 100;
            const done = progress >= 100;
            return (
              <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.goalTop}>
                  <View style={[styles.goalIcon, { backgroundColor: goal.color + "22" }]}>
                    <TpIcon name={goal.icon} size={20} color={goal.color} strokeWidth={1.8} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.goalName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{goal.name}</Text>
                    <Text style={[styles.goalProgress, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      ₦{goal.saved.toLocaleString()} of ₦{goal.target.toLocaleString()}
                    </Text>
                  </View>
                  {done && (
                    <View style={[styles.doneBadge, { backgroundColor: colors.success + "22" }]}>
                      <Text style={[styles.doneText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>Done!</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` as any, backgroundColor: done ? colors.success : goal.color }]} />
                </View>
                <Text style={[styles.pct, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {progress.toFixed(0)}% completed
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Investment Products
          </Text>
          {PRODUCTS.map((p) => (
            <Pressable
              key={p.id}
              style={({ pressed }) => [styles.productCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
            >
              <View>
                <Text style={[styles.productName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{p.name}</Text>
                <Text style={[styles.productMin, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>Min: {p.minAmount}</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text style={[styles.productRate, { color: p.color, fontFamily: "Inter_700Bold" }]}>{p.rate}</Text>
                <View style={[styles.riskBadge, { backgroundColor: p.color + "20" }]}>
                  <Text style={[styles.riskText, { color: p.color, fontFamily: "Inter_500Medium" }]}>{p.risk} Risk</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 20, gap: 24, paddingTop: 8 },
  totalCard: {
    borderRadius: 20, padding: 24, gap: 6,
  },
  totalLabel: { fontSize: 13, color: "#ffffff88" },
  totalAmount: { fontSize: 40, color: "#fff", letterSpacing: -1.5 },
  totalSub: { fontSize: 13, color: "#ffffff88" },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 18, letterSpacing: -0.5 },
  addGoal: { fontSize: 14 },
  goalCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  goalTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  goalIcon: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  goalName: { fontSize: 15, letterSpacing: -0.3, marginBottom: 2 },
  goalProgress: { fontSize: 12 },
  doneBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  doneText: { fontSize: 11 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  pct: { fontSize: 11 },
  productCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 14, borderWidth: 1 },
  productName: { fontSize: 15, marginBottom: 3, letterSpacing: -0.3 },
  productMin: { fontSize: 12 },
  productRate: { fontSize: 16 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  riskText: { fontSize: 11 },
});
