import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const CATEGORIES: { id: string; label: string; icon: TpIconName; color: string }[] = [
  { id: "electricity", label: "Electricity", icon: "zap", color: "#FF9500" },
  { id: "airtime", label: "Airtime", icon: "phone", color: "#34C759" },
  { id: "data", label: "Data", icon: "wifi", color: "#007AFF" },
  { id: "cable", label: "Cable TV", icon: "tv", color: "#8E44AD" },
  { id: "internet", label: "Internet", icon: "globe", color: "#1ABC9C" },
  { id: "betting", label: "Betting", icon: "dollar-sign", color: "#E67E22" },
  { id: "education", label: "Education", icon: "book", color: "#3498DB" },
  { id: "water", label: "Water", icon: "droplet", color: "#5DADE2" },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function PaymentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTransaction, user } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);

  const handlePay = async () => {
    const cat = CATEGORIES.find((c) => c.id === selected);
    if (!cat || !amount) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    addTransaction({
      title: cat.label,
      subtitle: selected === "airtime" || selected === "data" ? `Recharged ${phone}` : `${cat.label} payment`,
      amount: Number(amount),
      type: "debit",
      status: "success",
      category: cat.label,
      avatarColor: cat.color,
    });
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setSelected(null); setAmount(""); }, 2500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Bill Payments
        </Text>

        {/* Categories grid */}
        <View style={styles.grid}>
          {CATEGORIES.map((cat) => {
            const active = selected === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelected(cat.id)}
                style={[
                  styles.catCard,
                  {
                    backgroundColor: active ? cat.color + "22" : colors.card,
                    borderColor: active ? cat.color : colors.border,
                  },
                ]}
              >
                <View style={[styles.catIcon, { backgroundColor: cat.color + "22" }]}>
                  <TpIcon name={cat.icon} size={22} color={cat.color} strokeWidth={1.8} />
                </View>
                <Text style={[styles.catLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Form */}
        {selected && (
          <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {(selected === "airtime" || selected === "data") && (
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="e.g. 08012345678"
                prefixIcon={<TpIcon name="phone" size={18} color="#8E8E93" strokeWidth={1.8} />}
              />
            )}

            <View>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                Amount (₦)
              </Text>
              <View style={styles.quickAmounts}>
                {QUICK_AMOUNTS.map((a) => (
                  <Pressable
                    key={a}
                    onPress={() => setAmount(String(a))}
                    style={[
                      styles.quickChip,
                      {
                        backgroundColor: amount === String(a) ? colors.primary + "22" : colors.secondary,
                        borderColor: amount === String(a) ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.quickChipText, { color: amount === String(a) ? colors.primary : colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                      ₦{a.toLocaleString()}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Input
                placeholder="Or enter custom amount"
                value={amount}
                onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                prefixIcon={<Text style={{ color: "#8E8E93", fontSize: 16 }}>₦</Text>}
              />
            </View>

            {success ? (
              <View style={[styles.successBanner, { backgroundColor: colors.success + "22", borderColor: colors.success }]}>
                <TpIcon name="check-circle" size={18} color={colors.success} strokeWidth={1.8} />
                <Text style={[styles.successText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
                  Payment successful!
                </Text>
              </View>
            ) : (
              <Button
                onPress={handlePay}
                loading={loading}
                disabled={!amount || Number(amount) <= 0}
                fullWidth
              >
                Pay ₦{Number(amount || 0).toLocaleString()}
              </Button>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 24 },
  title: { fontSize: 28, letterSpacing: -1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: {
    width: "22%",
    aspectRatio: 0.9,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    flex: 1,
    minWidth: "20%",
  },
  catIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  catLabel: { fontSize: 11, textAlign: "center" },
  form: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 16 },
  fieldLabel: { fontSize: 13, marginBottom: 8 },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  quickChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  quickChipText: { fontSize: 13 },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  successText: { fontSize: 15 },
});
