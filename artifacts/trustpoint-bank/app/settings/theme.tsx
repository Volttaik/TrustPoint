import React from "react";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const THEMES = [
  { id: "dark", label: "Dark", subtitle: "Red Velvet Black", icon: "moon" },
  { id: "light", label: "Light", subtitle: "Classic white mode", icon: "sun" },
];

export default function ThemeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Theme</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        {THEMES.map((t) => {
          const active = theme === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => { if (!active) toggleTheme(); }}
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1 },
              ]}
            >
              <View style={[styles.iconWrapper, { backgroundColor: active ? colors.primary + "22" : colors.secondary }]}>
                <Feather name={t.icon as any} size={24} color={active ? colors.primary : colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{t.label}</Text>
                <Text style={[styles.cardSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{t.subtitle}</Text>
              </View>
              {active && (
                <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                  <Feather name="check" size={14} color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, gap: 14, paddingTop: 8 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderRadius: 18 },
  iconWrapper: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  cardLabel: { fontSize: 16, marginBottom: 3 },
  cardSub: { fontSize: 13 },
  checkCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
