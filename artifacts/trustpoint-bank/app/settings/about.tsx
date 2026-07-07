import React from "react";
import {
  Image,
  Linking,
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
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const LINKS: { icon: TpIconName; label: string; url: string }[] = [
  { icon: "file-text", label: "Privacy Policy", url: "https://trustpoint.ng/privacy" },
  { icon: "file-text", label: "Terms of Service", url: "https://trustpoint.ng/terms" },
  { icon: "shield", label: "Security Policy", url: "https://trustpoint.ng/security" },
  { icon: "globe", label: "Website", url: "https://trustpoint.ng" },
];

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
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
          About
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.brandCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Image
            source={require("@/assets/images/icon_transparent.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.brandName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            TrustPoint Bank
          </Text>
          <Text style={[styles.brandVersion, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Version 1.0.0 (Build 100)
          </Text>
          <View style={[styles.badge, { backgroundColor: colors.success + "20" }]}>
            <View style={[styles.badgeDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.badgeText, { color: colors.success, fontFamily: "Inter_500Medium" }]}>
              CBN Licensed MFB
            </Text>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <InfoRow label="Company" value="TrustPoint Microfinance Bank Ltd." colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <InfoRow label="CBN License" value="MFB/ABJ/2024/001234" colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <InfoRow label="NDIC Insured" value="Up to ₦5,000,000" colors={colors} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <InfoRow label="Headquarters" value="Victoria Island, Lagos, Nigeria" colors={colors} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Legal
        </Text>

        <View style={[styles.linkCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LINKS.map((link, idx) => (
            <React.Fragment key={link.label}>
              <Pressable
                onPress={() => Linking.openURL(link.url)}
                style={({ pressed }) => [styles.linkRow, { opacity: pressed ? 0.7 : 1 }]}
              >
                <TpIcon name={link.icon} size={18} color={colors.mutedForeground} strokeWidth={1.8} />
                <Text style={[styles.linkLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                  {link.label}
                </Text>
                <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
              </Pressable>
              {idx < LINKS.length - 1 && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={[styles.disclaimer, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          TrustPoint Bank is a licensed microfinance bank regulated by the Central Bank of Nigeria (CBN). All deposits are insured by the Nigerian Deposit Insurance Corporation (NDIC).
        </Text>

        <Text style={[styles.copyright, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          © 2025 TrustPoint Bank. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 12, marginBottom: 3 }}>{label}</Text>
      <Text style={{ color: colors.text, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>{value}</Text>
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
  brandCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  logo: { width: 64, height: 64, marginBottom: 4 },
  brandName: { fontSize: 22, letterSpacing: -0.5 },
  brandVersion: { fontSize: 13 },
  badge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, marginTop: 4 },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontSize: 12 },
  infoCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  linkCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  linkLabel: { flex: 1, fontSize: 14 },
  sep: { height: 0.5, marginLeft: 16 },
  disclaimer: { fontSize: 12, lineHeight: 18, textAlign: "center" },
  copyright: { fontSize: 12, textAlign: "center", paddingBottom: 8 },
});
