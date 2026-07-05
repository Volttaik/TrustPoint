import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

export default function SecurityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [biometric, setBiometric] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const MenuItem = ({ icon, label, subtitle, onPress, toggle, value, color }: { icon: TpIconName; label: string; subtitle?: string; onPress: () => void; toggle?: boolean; value?: boolean; color?: string }) => (
    <TouchableOpacity onPress={onPress} style={styles.item} activeOpacity={0.7}>
      <View style={[styles.itemIcon, { backgroundColor: (color ?? colors.primary) + "20" }]}>
        <TpIcon name={icon} size={18} color={color ?? colors.primary} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>{label}</Text>
        {subtitle && <Text style={[styles.itemSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: colors.border, true: colors.primary + "88" }}
          thumbColor={value ? colors.primary : colors.mutedForeground}
          ios_backgroundColor={colors.border}
        />
      ) : (
        <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Security</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuItem icon="key" label="Change PIN" subtitle="Update your transaction PIN" onPress={() => {}} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <MenuItem icon="fingerprint" label="Biometric Login" subtitle="Use face ID or fingerprint" toggle value={biometric} onPress={() => setBiometric((v) => !v)} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield" label="Two-Factor Auth" subtitle="Extra layer of security" toggle value={twoFA} onPress={() => setTwoFA((v) => !v)} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <MenuItem icon="smartphone" label="Trusted Devices" subtitle="Manage logged-in devices" onPress={() => {}} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          DANGER ZONE
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuItem icon="alert-triangle" label="Report Suspicious Activity" subtitle="Flag unauthorized access" color={colors.warning} onPress={() => {}} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <MenuItem icon="trash-2" label="Delete Account" subtitle="Permanently close your account" color={colors.destructive} onPress={() => {}} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 8, paddingBottom: 40 },
  sectionTitle: { fontSize: 11, letterSpacing: 0.8 },
  card: { borderRadius: 16, borderWidth: 1 },
  item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 },
  itemIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  itemLabel: { fontSize: 14, marginBottom: 2 },
  itemSub: { fontSize: 12 },
  sep: { height: 0.5, marginLeft: 66 },
});
