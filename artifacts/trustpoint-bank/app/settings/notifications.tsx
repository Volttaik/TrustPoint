import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface NotifSetting {
  id: string;
  label: string;
  desc: string;
  icon: TpIconName;
  color: string;
  enabled: boolean;
}

const SECTIONS: { title: string; items: NotifSetting[] }[] = [
  {
    title: "Transactions",
    items: [
      { id: "credit", label: "Money Received", desc: "When money is credited to your account", icon: "arrow-down-left", color: "#34C759", enabled: true },
      { id: "debit", label: "Money Sent", desc: "When money is debited from your account", icon: "arrow-up-right", color: "#E63946", enabled: true },
      { id: "failed", label: "Failed Transactions", desc: "When a transaction fails", icon: "alert-circle", color: "#FF9500", enabled: true },
    ],
  },
  {
    title: "Account",
    items: [
      { id: "login", label: "Login Alerts", desc: "When someone logs into your account", icon: "shield", color: "#007AFF", enabled: true },
      { id: "pin_change", label: "PIN Changes", desc: "When your PIN is changed", icon: "key", color: "#8E44AD", enabled: true },
      { id: "device", label: "New Device", desc: "When a new device is added", icon: "smartphone", color: "#00B140", enabled: false },
    ],
  },
  {
    title: "Promotions",
    items: [
      { id: "offers", label: "Special Offers", desc: "Exclusive deals and cashback", icon: "gift", color: "#E63946", enabled: false },
      { id: "news", label: "News & Updates", desc: "Product updates and announcements", icon: "bell", color: "#FF9500", enabled: true },
    ],
  },
];

export default function NotificationsSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.flatMap((s) => s.items).map((i) => [i.id, i.enabled]))
  );
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const toggle = (id: string) => setSettings((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Notification Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((section) => (
          <View key={section.title}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              {section.title.toUpperCase()}
            </Text>
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={styles.row}>
                    <View style={[styles.iconWrap, { backgroundColor: item.color + "20" }]}>
                      <TpIcon name={item.icon} size={17} color={item.color} strokeWidth={1.8} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.itemLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                        {item.label}
                      </Text>
                      <Text style={[styles.itemDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                        {item.desc}
                      </Text>
                    </View>
                    <Switch
                      value={settings[item.id]}
                      onValueChange={() => toggle(item.id)}
                      trackColor={{ false: colors.border, true: colors.primary + "88" }}
                      thumbColor={settings[item.id] ? colors.primary : colors.mutedForeground}
                      ios_backgroundColor={colors.border}
                    />
                  </View>
                  {idx < section.items.length - 1 && (
                    <View style={[styles.sep, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  scroll: { paddingHorizontal: 20, gap: 8, paddingTop: 4 },
  sectionTitle: { fontSize: 11, letterSpacing: 0.8, marginBottom: 8, marginLeft: 4, marginTop: 12 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemLabel: { fontSize: 14, marginBottom: 2 },
  itemDesc: { fontSize: 12 },
  sep: { height: 0.5, marginLeft: 64 },
});
