import React from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const NOTIFS = [
  { id: "1", type: "credit", title: "Money Received", body: "₦85,000 credited to your account from Adebayo Okafor", time: "2 mins ago", read: false },
  { id: "2", type: "security", title: "New Login Detected", body: "A new login was detected on your TrustPoint account from Lagos, NG", time: "1 hour ago", read: false },
  { id: "3", type: "promo", title: "Refer & Earn", body: "Invite friends and earn ₦500 per successful referral. Start earning today!", time: "Yesterday", read: true },
  { id: "4", type: "bill", title: "Bill Payment Successful", body: "Your EKEDC electricity payment of ₦5,000 was successful", time: "2 days ago", read: true },
  { id: "5", type: "loan", title: "Loan Offer Available", body: "You are eligible for a loan of up to ₦500,000. Tap to apply.", time: "3 days ago", read: true },
];

const ICON_MAP: Record<string, { icon: string; color: string }> = {
  credit: { icon: "arrow-down-left", color: "#34C759" },
  security: { icon: "shield", color: "#E63946" },
  promo: { icon: "gift", color: "#FF9500" },
  bill: { icon: "zap", color: "#007AFF" },
  loan: { icon: "dollar-sign", color: "#8E44AD" },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Notifications</Text>
        <TouchableOpacity>
          <Text style={[styles.markAll, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={NOTIFS}
        keyExtractor={(n) => n.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: colors.border }]} />}
        renderItem={({ item }) => {
          const meta = ICON_MAP[item.type] ?? { icon: "bell", color: colors.primary };
          return (
            <View style={[styles.item, { backgroundColor: !item.read ? colors.primary + "08" : "transparent" }]}>
              <View style={[styles.icon, { backgroundColor: meta.color + "22" }]}>
                <Feather name={meta.icon as any} size={20} color={meta.color} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <View style={styles.itemTop}>
                  <Text style={[styles.itemTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{item.title}</Text>
                  {!item.read && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.itemBody, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {item.body}
                </Text>
                <Text style={[styles.itemTime, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  {item.time}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  markAll: { fontSize: 13 },
  list: { paddingHorizontal: 20 },
  item: { flexDirection: "row", gap: 12, paddingVertical: 14 },
  icon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center", marginTop: 2 },
  itemTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  itemTitle: { fontSize: 14, letterSpacing: -0.3 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  itemBody: { fontSize: 13, lineHeight: 19 },
  itemTime: { fontSize: 11 },
  sep: { height: 0.5, marginLeft: 58 },
});
