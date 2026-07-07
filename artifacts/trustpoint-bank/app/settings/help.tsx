import React, { useState } from "react";
import {
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const FAQS = [
  { q: "How do I transfer money?", a: "Go to the Transfers section on the home screen. Select your recipient, enter the amount, and confirm with your PIN." },
  { q: "What are the transfer limits?", a: "Tier 1 accounts can transfer up to ₦50,000 per day. Tier 2 accounts have a ₦500,000 daily limit. Upgrade your account to increase limits." },
  { q: "How do I freeze my card?", a: "Go to Cards > select the card > tap 'Freeze'. Your card will be immediately disabled for all transactions." },
  { q: "How long do I wait for airtime/data?", a: "Airtime and data are delivered instantly after payment confirmation." },
  { q: "How do I change my PIN?", a: "Go to Settings > Security > Change PIN. You'll need your current PIN to set a new one." },
  { q: "Is my money safe?", a: "Yes! TrustPoint Bank is licensed by the CBN and all deposits are insured by the NDIC up to ₦5,000,000." },
];

const CHANNELS: { icon: TpIconName; label: string; desc: string; color: string; action: () => void }[] = [
  { icon: "headset", label: "Live Chat", desc: "Chat with an agent", color: "#34C759", action: () => {} },
  { icon: "phone", label: "Call Us", desc: "0800-TRUST (87878)", color: "#007AFF", action: () => Linking.openURL("tel:0800878787") },
  { icon: "mail", label: "Email", desc: "support@trustpoint.ng", color: "#FF9500", action: () => Linking.openURL("mailto:support@trustpoint.ng") },
];

function FAQItem({ q, a, colors }: { q: string; a: string; colors: any }) {
  const [open, setOpen] = useState(false);
  const height = useSharedValue(0);
  const rotate = useSharedValue(0);

  const toggleOpen = () => {
    setOpen((v) => {
      height.value = withSpring(v ? 0 : 1, { damping: 15 });
      rotate.value = withSpring(v ? 0 : 1, { damping: 12 });
      return !v;
    });
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 180}deg` }],
  }));

  return (
    <View>
      <Pressable onPress={toggleOpen} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 16 }}>
        <Text style={{ flex: 1, color: colors.text, fontFamily: "Inter_500Medium", fontSize: 14, paddingRight: 12 }}>{q}</Text>
        <Animated.View style={chevronStyle}>
          <TpIcon name="chevron-down" size={16} color={colors.mutedForeground} strokeWidth={2} />
        </Animated.View>
      </Pressable>
      {open && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 14 }}>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13.5, lineHeight: 20 }}>{a}</Text>
        </View>
      )}
    </View>
  );
}

export default function HelpScreen() {
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
          Help & Support
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact channels */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Contact Us
        </Text>
        <View style={styles.channels}>
          {CHANNELS.map((ch) => (
            <Pressable
              key={ch.label}
              onPress={ch.action}
              style={[styles.channelCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.channelIcon, { backgroundColor: ch.color + "20" }]}>
                <TpIcon name={ch.icon} size={22} color={ch.color} strokeWidth={1.8} />
              </View>
              <Text style={[styles.channelLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {ch.label}
              </Text>
              <Text style={[styles.channelDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {ch.desc}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.hoursCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TpIcon name="calendar" size={18} color={colors.primary} strokeWidth={1.8} />
          <View>
            <Text style={[styles.hoursTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Support Hours
            </Text>
            <Text style={[styles.hoursText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Mon–Fri: 8am – 8pm · Sat–Sun: 9am – 5pm
            </Text>
          </View>
        </View>

        {/* FAQs */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Frequently Asked Questions
        </Text>

        <View style={[styles.faqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {FAQS.map((faq, idx) => (
            <React.Fragment key={idx}>
              <FAQItem q={faq.q} a={faq.a} colors={colors} />
              {idx < FAQS.length - 1 && <View style={[styles.sep, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>
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
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  channels: { flexDirection: "row", gap: 10 },
  channelCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 8,
  },
  channelIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  channelLabel: { fontSize: 13 },
  channelDesc: { fontSize: 11, textAlign: "center" },
  hoursCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  hoursTitle: { fontSize: 14, marginBottom: 3 },
  hoursText: { fontSize: 12.5 },
  faqCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  sep: { height: 0.5, marginLeft: 16 },
});
