import React, { useState } from "react";
import {
  Image,
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
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

const SAVED_CARDS = [
  { id: "1", last4: "4532", type: "Visa",       expiry: "09/27", color: "#1A1F71" },
  { id: "2", last4: "8841", type: "Mastercard", expiry: "03/26", color: "#EB001B" },
];

export default function CardTopupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [amount,     setAmount]     = useState("");
  const [selectedId, setSelectedId] = useState<string>("1");
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);

  const topPad    = insets.top    + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);
  const isDark    = colors.background === "#000000" || colors.background === "#0A0A0A";

  const numAmount = Number(amount) || 0;

  const handleContinue = async () => {
    if (!numAmount || numAmount < 100) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setAmount(""); }, 3000);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Top-up with Card
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <Image
            source={require("@/assets/icons/business_card.webp")}
            style={styles.heroIllus}
            resizeMode="contain"
          />
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            Fund with Debit Card
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            Top up your account instantly using any Nigerian debit or credit card.
          </Text>
        </View>

        {/* Amount */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            How much do you want to add?
          </Text>
          <Input
            placeholder="0.00"
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
            prefixIcon={
              <Text style={{ color: colors.mutedForeground, fontSize: 18, fontFamily: "Inter_600SemiBold" }}>₦</Text>
            }
          />
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map((a) => {
              const active = amount === String(a);
              return (
                <Pressable
                  key={a}
                  onPress={() => setAmount(String(a))}
                  style={[styles.quickChip, {
                    backgroundColor: active ? colors.primary + "18" : colors.surface,
                    borderColor:     active ? colors.primary       : colors.border,
                  }]}
                >
                  <Text style={[styles.quickChipTxt, {
                    color:      active ? colors.primary : colors.mutedForeground,
                    fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                  }]}>
                    ₦{a >= 1000 ? `${a / 1000}k` : a}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Saved cards */}
        <View style={styles.cardSection}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Saved Cards
          </Text>
          <View style={styles.savedCards}>
            {SAVED_CARDS.map((card) => {
              const selected = selectedId === card.id;
              return (
                <Pressable
                  key={card.id}
                  onPress={() => setSelectedId(card.id)}
                  style={[styles.cardRow, {
                    backgroundColor: colors.card,
                    borderColor:     selected ? colors.primary : colors.border,
                    borderWidth:     selected ? 1.5 : 1,
                  }]}
                >
                  {/* Card colour strip */}
                  <View style={[styles.cardChip, { backgroundColor: card.color }]}>
                    <Text style={styles.cardChipTxt}>
                      {card.type === "Visa" ? "VISA" : "MC"}
                    </Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardMask, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                      •••• •••• •••• {card.last4}
                    </Text>
                    <Text style={[styles.cardExpiry, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {card.type} · Expires {card.expiry}
                    </Text>
                  </View>
                  {selected && (
                    <View style={[styles.cardCheck, { backgroundColor: colors.primary }]}>
                      <TpIcon name="check" size={12} color="#fff" strokeWidth={2.5} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Add new card */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.addCardBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.addCardIcon, { backgroundColor: colors.primary + "14" }]}>
              <TpIcon name="plus" size={18} color={colors.primary} strokeWidth={2.2} />
            </View>
            <Text style={[styles.addCardTxt, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Add New Card
            </Text>
            <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Security notice */}
        <View style={[styles.securityNote, {
          backgroundColor: colors.success + "0E",
          borderColor:     colors.success + "28",
        }]}>
          <TpIcon name="shield" size={16} color={colors.success} strokeWidth={1.8} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.securityTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Encrypted & Secure
            </Text>
            <Text style={[styles.securityBody, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Your card details are encrypted with 256-bit SSL. We never store your full card number.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky footer CTA */}
      <View style={[styles.footer, {
        backgroundColor: colors.background,
        borderTopColor:  colors.border,
        paddingBottom:   bottomPad + 16,
      }]}>
        {success ? (
          <View style={[styles.successBanner, {
            backgroundColor: colors.success + "18",
            borderColor:     colors.success + "40",
          }]}>
            <TpIcon name="check-circle" size={20} color={colors.success} strokeWidth={1.8} />
            <Text style={[styles.successTxt, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
              ₦{numAmount.toLocaleString()} added successfully!
            </Text>
          </View>
        ) : (
          <Button
            onPress={handleContinue}
            loading={loading}
            disabled={!amount || numAmount < 100}
            fullWidth
            size="large"
          >
            {numAmount > 0
              ? `Add ₦${numAmount.toLocaleString("en-NG")}`
              : "Enter an Amount"}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20, paddingBottom: 8,
  },
  backBtn:     { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },

  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },

  /* Hero */
  heroSection: { alignItems: "center", paddingVertical: 8, gap: 12 },
  heroIllus:   { width: 100, height: 100 },
  heroTitle:   { fontSize: 22, letterSpacing: -0.5 },
  heroSub:     { fontSize: 13.5, textAlign: "center", lineHeight: 20, maxWidth: 300 },

  /* Amount section */
  section: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 16 },
  sectionLabel: { fontSize: 16, letterSpacing: -0.3 },
  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
  },
  quickChipTxt: { fontSize: 13 },

  /* Cards */
  cardSection: { gap: 14 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  savedCards: { gap: 10 },
  cardRow: {
    flexDirection: "row", alignItems: "center",
    gap: 14, padding: 16, borderRadius: 16,
  },
  cardChip: {
    width: 48, height: 32, borderRadius: 6,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cardChipTxt: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  cardInfo:    { flex: 1, gap: 3 },
  cardMask:    { fontSize: 15, letterSpacing: 0.5 },
  cardExpiry:  { fontSize: 12 },
  cardCheck: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
  },

  addCardBtn: {
    flexDirection: "row", alignItems: "center",
    gap: 14, padding: 16, borderRadius: 16, borderWidth: 1,
  },
  addCardIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  addCardTxt:  { flex: 1, fontSize: 15 },

  /* Security */
  securityNote: {
    flexDirection: "row", gap: 12, padding: 16,
    borderRadius: 14, borderWidth: 1, alignItems: "flex-start",
  },
  securityTitle: { fontSize: 13.5 },
  securityBody:  { fontSize: 12.5, lineHeight: 18 },

  /* Footer */
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingTop: 12, paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  successBanner: {
    flexDirection: "row", alignItems: "center",
    gap: 10, padding: 16, borderRadius: 14, borderWidth: 1,
  },
  successTxt: { fontSize: 15 },
});
