import React, { useState } from "react";
import {
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
import { SuccessModal } from "@/components/ui/SuccessModal";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type BillCategory = "electricity" | "tv" | "internet" | "water" | "betting";

const CATEGORIES: { id: BillCategory; label: string; icon: TpIconName; color: string }[] = [
  { id: "electricity", label: "Electricity", icon: "zap", color: "#FF9500" },
  { id: "tv", label: "Cable TV", icon: "tv", color: "#007AFF" },
  { id: "internet", label: "Internet", icon: "wifi", color: "#34C759" },
  { id: "water", label: "Water", icon: "droplet", color: "#5AC8FA" },
  { id: "betting", label: "Betting", icon: "activity", color: "#8E44AD" },
];

const PROVIDERS: Record<BillCategory, { id: string; name: string }[]> = {
  electricity: [
    { id: "ibedc", name: "IBEDC" },
    { id: "ekedc", name: "EKEDC (EKEDC)" },
    { id: "phed", name: "PHED" },
    { id: "aedc", name: "AEDC (Abuja)" },
    { id: "kedco", name: "KEDCO" },
  ],
  tv: [
    { id: "dstv", name: "DStv" },
    { id: "gotv", name: "GOtv" },
    { id: "startimes", name: "StarTimes" },
  ],
  internet: [
    { id: "smile", name: "Smile" },
    { id: "spectranet", name: "Spectranet" },
    { id: "swift", name: "Swift Networks" },
  ],
  water: [
    { id: "lwsc", name: "Lagos Water Corp" },
    { id: "abujawater", name: "Abuja Water Board" },
  ],
  betting: [
    { id: "bet9ja", name: "Bet9ja" },
    { id: "sportybet", name: "SportyBet" },
    { id: "1xbet", name: "1xBet" },
    { id: "betway", name: "Betway" },
  ],
};

export default function BillsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTransaction } = useApp();
  const [category, setCategory] = useState<BillCategory>("electricity");
  const [provider, setProvider] = useState<string>("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const providers = PROVIDERS[category];
  const catInfo = CATEGORIES.find((c) => c.id === category)!;
  const selectedProvider = providers.find((p) => p.id === provider);

  const fieldLabel = category === "electricity" ? "Meter Number" :
    category === "tv" ? "Smart Card / Decoder Number" :
    category === "internet" ? "Account / Username" :
    category === "betting" ? "Bettor ID / Username" :
    "Account Number";

  const canPay = provider && meterNumber && Number(amount) > 0;

  const handlePay = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    addTransaction({
      title: `${selectedProvider?.name ?? catInfo.label} Bill`,
      subtitle: `Ref: ${meterNumber}`,
      amount: Number(amount),
      type: "debit",
      status: "success",
      category: catInfo.label,
      avatarColor: catInfo.color,
    });
    setLoading(false);
    setSuccess(true);
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
          Pay Bills
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Categories */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Bill Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }}>
            <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20 }}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => { setCategory(cat.id); setProvider(""); }}
                  style={[
                    styles.catCard,
                    {
                      backgroundColor: category === cat.id ? cat.color + "18" : colors.card,
                      borderColor: category === cat.id ? cat.color : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.catIcon, { backgroundColor: cat.color + "20" }]}>
                    <TpIcon name={cat.icon} size={20} color={cat.color} strokeWidth={1.8} />
                  </View>
                  <Text
                    style={[
                      styles.catLabel,
                      {
                        color: category === cat.id ? cat.color : colors.text,
                        fontFamily: category === cat.id ? "Inter_600SemiBold" : "Inter_500Medium",
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Providers */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Service Provider
          </Text>
          <View style={styles.providerGrid}>
            {providers.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setProvider(p.id)}
                style={[
                  styles.providerChip,
                  {
                    backgroundColor: provider === p.id ? catInfo.color + "18" : colors.card,
                    borderColor: provider === p.id ? catInfo.color : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.providerName,
                    {
                      color: provider === p.id ? catInfo.color : colors.text,
                      fontFamily: provider === p.id ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {p.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Input
          label={fieldLabel}
          value={meterNumber}
          onChangeText={setMeterNumber}
          keyboardType="default"
          placeholder={`Enter your ${fieldLabel.toLowerCase()}`}
          prefixIcon={<TpIcon name="key" size={18} color={colors.placeholder} strokeWidth={1.8} />}
        />

        <Input
          label="Amount (₦)"
          value={amount}
          onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          placeholder="Enter amount"
          prefixIcon={<Text style={{ color: colors.placeholder, fontSize: 16, fontFamily: "Inter_400Regular" }}>₦</Text>}
        />

          <Button onPress={handlePay} loading={loading} disabled={!canPay} fullWidth size="large">
            Pay ₦{amount ? Number(amount).toLocaleString() : "0"}
          </Button>
      </ScrollView>

      <SuccessModal
        visible={success}
        title="Payment Successful!"
        subtitle={`${selectedProvider?.name ?? catInfo.label} — ₦${Number(amount).toLocaleString()}`}
        onDismiss={() => { setSuccess(false); setProvider(""); setMeterNumber(""); setAmount(""); }}
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
  scroll: { paddingHorizontal: 20, gap: 20, paddingTop: 4 },
  sectionLabel: { fontSize: 13, marginBottom: 10 },
  catCard: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    minWidth: 88,
  },
  catIcon: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  catLabel: { fontSize: 12 },
  providerGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  providerChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  providerName: { fontSize: 13 },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  successTitle: { fontSize: 15 },
  successSub: { fontSize: 13, marginTop: 2 },
});
