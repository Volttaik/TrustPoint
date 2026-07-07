import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const DEVICES = [
  { id: "1", name: "iPhone 15 Pro", os: "iOS 17.4", lastSeen: "Now", current: true },
  { id: "2", name: "Samsung Galaxy S24", os: "Android 14", lastSeen: "2 days ago", current: false },
  { id: "3", name: "MacBook Pro", os: "macOS 14.4", lastSeen: "5 days ago", current: false },
];

export default function DevicesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [devices, setDevices] = useState(DEVICES);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const removeDevice = (id: string) => {
    Alert.alert("Remove Device", "This device will be signed out immediately.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setDevices((prev) => prev.filter((d) => d.id !== id)),
      },
    ]);
  };

  const removeAll = () => {
    Alert.alert("Sign Out All Devices", "All other devices will be signed out. You'll remain logged in on this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out All",
        style: "destructive",
        onPress: () => setDevices((prev) => prev.filter((d) => d.current)),
      },
    ]);
  };

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
          Trusted Devices
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.infoCard, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
          <TpIcon name="shield" size={18} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.infoText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            These are devices that are currently signed in to your TrustPoint account.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {devices.map((d, idx) => (
            <React.Fragment key={d.id}>
              <View style={styles.deviceRow}>
                <View style={[styles.deviceIcon, { backgroundColor: d.current ? colors.primary + "20" : colors.surface }]}>
                  <TpIcon
                    name="smartphone"
                    size={20}
                    color={d.current ? colors.primary : colors.mutedForeground}
                    strokeWidth={1.8}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Text style={[styles.deviceName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      {d.name}
                    </Text>
                    {d.current && (
                      <View style={[styles.currentBadge, { backgroundColor: colors.success + "20" }]}>
                        <Text style={[styles.currentText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                          This device
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.deviceOs, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {d.os} · {d.lastSeen}
                  </Text>
                </View>
                {!d.current && (
                  <Pressable
                    onPress={() => removeDevice(d.id)}
                    style={[styles.removeBtn, { backgroundColor: colors.destructive + "15" }]}
                  >
                    <TpIcon name="trash-2" size={16} color={colors.destructive} strokeWidth={1.8} />
                  </Pressable>
                )}
              </View>
              {idx < devices.length - 1 && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>

        {devices.length > 1 && (
          <Pressable
            onPress={removeAll}
            style={[styles.removeAllBtn, { backgroundColor: colors.destructive + "12", borderColor: colors.destructive + "30" }]}
          >
            <TpIcon name="log-out" size={18} color={colors.destructive} strokeWidth={1.8} />
            <Text style={[styles.removeAllText, { color: colors.destructive, fontFamily: "Inter_600SemiBold" }]}>
              Sign Out All Other Devices
            </Text>
          </Pressable>
        )}
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
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  infoCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  deviceRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  deviceIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  deviceName: { fontSize: 14 },
  deviceOs: { fontSize: 12, marginTop: 2 },
  currentBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  currentText: { fontSize: 10 },
  removeBtn: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  sep: { height: 0.5, marginLeft: 70 },
  removeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  removeAllText: { fontSize: 14 },
});
