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
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

export default function BiometricsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [fingerprint, setFingerprint] = useState(false);
  const [faceId, setFaceId] = useState(false);
  const [transferAuth, setTransferAuth] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

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
          Biometrics
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.heroIcon, { backgroundColor: colors.primary + "18" }]}>
            <TpIcon name="fingerprint" size={40} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Biometric Authentication
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Use your fingerprint or face to log in quickly and securely without entering your PIN every time.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          AUTHENTICATION METHODS
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="fingerprint"
            color="#E63946"
            label="Fingerprint"
            desc="Use your fingerprint to log in"
            value={fingerprint}
            onToggle={() => setFingerprint((v) => !v)}
            colors={colors}
          />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <SettingRow
            icon="camera"
            color="#007AFF"
            label="Face ID"
            desc="Use your face to log in"
            value={faceId}
            onToggle={() => setFaceId((v) => !v)}
            colors={colors}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          USAGE
        </Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="shuffle"
            color="#34C759"
            label="Authorize Transfers"
            desc="Use biometrics instead of PIN for transfers"
            value={transferAuth}
            onToggle={() => setTransferAuth((v) => !v)}
            colors={colors}
          />
        </View>

        <View style={[styles.note, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TpIcon name="shield" size={16} color={colors.primary} strokeWidth={1.8} />
          <Text style={[styles.noteText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Your biometric data is stored securely on your device and never shared with TrustPoint Bank.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({ icon, color, label, desc, value, onToggle, colors }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: color + "20", alignItems: "center", justifyContent: "center" }}>
        <TpIcon name={icon} size={17} color={color} strokeWidth={1.8} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontFamily: "Inter_500Medium", fontSize: 14, marginBottom: 2 }}>{label}</Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12 }}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary + "88" }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
        ios_backgroundColor={colors.border}
      />
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
  scroll: { paddingHorizontal: 20, gap: 12, paddingTop: 4 },
  heroCard: { borderRadius: 20, borderWidth: 1, padding: 24, alignItems: "center", gap: 14 },
  heroIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 20, letterSpacing: -0.5 },
  heroSub: { fontSize: 13.5, textAlign: "center", lineHeight: 20 },
  sectionTitle: { fontSize: 11, letterSpacing: 0.8, marginLeft: 4, marginTop: 8 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sep: { height: 0.5, marginLeft: 64 },
  note: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
});
