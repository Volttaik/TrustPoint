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
import Svg, { Path, Circle, Rect, G } from "react-native-svg";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Tab = "airtime" | "data";

const NETWORKS = [
  { id: "mtn", name: "MTN", color: "#FFD700", bg: "#1A1A00" },
  { id: "airtel", name: "Airtel", color: "#E63946", bg: "#1A0000" },
  { id: "glo", name: "Glo", color: "#00B140", bg: "#001A00" },
  { id: "9mobile", name: "9Mobile", color: "#007A3D", bg: "#001A0D" },
];

const DATA_BUNDLES: Record<string, { id: string; size: string; validity: string; price: number }[]> = {
  mtn: [
    { id: "m1", size: "500MB", validity: "1 day", price: 150 },
    { id: "m2", size: "1GB", validity: "7 days", price: 300 },
    { id: "m3", size: "2GB", validity: "30 days", price: 500 },
    { id: "m4", size: "5GB", validity: "30 days", price: 1000 },
    { id: "m5", size: "10GB", validity: "30 days", price: 2000 },
    { id: "m6", size: "20GB", validity: "30 days", price: 3500 },
  ],
  airtel: [
    { id: "a1", size: "500MB", validity: "1 day", price: 150 },
    { id: "a2", size: "1.5GB", validity: "7 days", price: 350 },
    { id: "a3", size: "3GB", validity: "30 days", price: 600 },
    { id: "a4", size: "6GB", validity: "30 days", price: 1000 },
    { id: "a5", size: "10GB", validity: "30 days", price: 1800 },
    { id: "a6", size: "15GB", validity: "30 days", price: 2500 },
  ],
  glo: [
    { id: "g1", size: "500MB", validity: "1 day", price: 100 },
    { id: "g2", size: "1.5GB", validity: "7 days", price: 250 },
    { id: "g3", size: "3.6GB", validity: "30 days", price: 500 },
    { id: "g4", size: "7.5GB", validity: "30 days", price: 1000 },
    { id: "g5", size: "12GB", validity: "30 days", price: 1500 },
    { id: "g6", size: "25GB", validity: "30 days", price: 2500 },
  ],
  "9mobile": [
    { id: "e1", size: "300MB", validity: "1 day", price: 100 },
    { id: "e2", size: "1GB", validity: "7 days", price: 300 },
    { id: "e3", size: "2GB", validity: "30 days", price: 500 },
    { id: "e4", size: "5GB", validity: "30 days", price: 1000 },
    { id: "e5", size: "10GB", validity: "30 days", price: 2000 },
    { id: "e6", size: "15GB", validity: "30 days", price: 3000 },
  ],
};

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const RECENT_NUMBERS = ["08012345678", "08098765432", "07011223344"];

function NetworkLogo({ id, size = 36 }: { id: string; size?: number }) {
  if (id === "mtn") {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Rect width="40" height="40" rx="8" fill="#FFD700" />
        <Path d="M6 28L14 14l6 10 6-10 8 14" stroke="#001489" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    );
  }
  if (id === "airtel") {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Rect width="40" height="40" rx="8" fill="#E63946" />
        <Path d="M10 25c5-10 15-10 20 0" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <Path d="M14 20c3-6 9-6 12 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="20" cy="27" r="2.5" fill="#fff" />
      </Svg>
    );
  }
  if (id === "glo") {
    return (
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <Rect width="40" height="40" rx="8" fill="#00B140" />
        <Circle cx="20" cy="20" r="10" stroke="#fff" strokeWidth="3" fill="none" />
        <Path d="M20 10 A10 10 0 0 1 30 20 L24 20" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="20" cy="20" r="3" fill="#fff" />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      <Rect width="40" height="40" rx="8" fill="#007A3D" />
      <Path d="M12 28 Q20 10 28 28" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="20" cy="15" r="3" fill="#fff" />
    </Svg>
  );
}

export default function AirtimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addTransaction, user } = useApp();
  const [tab, setTab] = useState<Tab>("airtime");
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [amount, setAmount] = useState("");
  const [bundle, setBundle] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const selectedNet = NETWORKS.find((n) => n.id === network)!;
  const bundles = DATA_BUNDLES[network] ?? [];
  const selectedBundle = bundles.find((b) => b.id === bundle);

  const handleBuy = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    const isAirtime = tab === "airtime";
    addTransaction({
      title: isAirtime ? `${selectedNet.name} Airtime` : `${selectedNet.name} Data`,
      subtitle: isAirtime
        ? `₦${Number(amount).toLocaleString()} to ${phone}`
        : `${selectedBundle?.size} to ${phone}`,
      amount: isAirtime ? Number(amount) : (selectedBundle?.price ?? 0),
      type: "debit",
      status: "success",
      category: isAirtime ? "Airtime" : "Data",
      avatarColor: selectedNet.color,
    });
    setLoading(false);
    setSuccess(true);
  };

  const canSubmit = tab === "airtime"
    ? phone.length >= 10 && Number(amount) > 0
    : phone.length >= 10 && !!bundle;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background !== "#F4F5F7" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Airtime & Data
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tab switcher */}
        <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
          {(["airtime", "data"] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                tab === t && { backgroundColor: colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: tab === t ? "#fff" : colors.mutedForeground,
                    fontFamily: tab === t ? "Inter_600SemiBold" : "Inter_500Medium",
                  },
                ]}
              >
                {t === "airtime" ? "Airtime" : "Data"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Networks */}
        <View>
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
            Select Network
          </Text>
          <View style={styles.networks}>
            {NETWORKS.map((net) => (
              <Pressable
                key={net.id}
                onPress={() => { setNetwork(net.id); setBundle(""); }}
                style={[
                  styles.networkCard,
                  {
                    backgroundColor: network === net.id ? net.color + "20" : colors.card,
                    borderColor: network === net.id ? net.color : colors.border,
                  },
                ]}
              >
                <NetworkLogo id={net.id} size={40} />
                <Text
                  style={[
                    styles.networkName,
                    {
                      color: network === net.id ? net.color : colors.text,
                      fontFamily: "Inter_600SemiBold",
                    },
                  ]}
                >
                  {net.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Phone number */}
        <View>
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="08012345678"
            prefixIcon={<TpIcon name="phone" size={18} color={colors.placeholder} strokeWidth={1.8} />}
          />
          {RECENT_NUMBERS.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {RECENT_NUMBERS.map((num) => (
                  <Pressable
                    key={num}
                    onPress={() => setPhone(num)}
                    style={[styles.recentChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <TpIcon name="phone" size={12} color={colors.mutedForeground} strokeWidth={1.8} />
                    <Text style={[styles.recentText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                      {num}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Airtime amount */}
        {tab === "airtime" && (
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
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
                      backgroundColor: amount === String(a) ? colors.primary + "20" : colors.surface,
                      borderColor: amount === String(a) ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.quickChipText,
                      {
                        color: amount === String(a) ? colors.primary : colors.mutedForeground,
                        fontFamily: "Inter_500Medium",
                      },
                    ]}
                  >
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
              prefixIcon={<Text style={{ color: colors.placeholder, fontSize: 16, fontFamily: "Inter_400Regular" }}>₦</Text>}
            />
          </View>
        )}

        {/* Data bundles */}
        {tab === "data" && (
          <View>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
              Select Bundle
            </Text>
            <View style={styles.bundles}>
              {bundles.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => setBundle(b.id)}
                  style={[
                    styles.bundleCard,
                    {
                      backgroundColor: bundle === b.id ? colors.primary + "15" : colors.card,
                      borderColor: bundle === b.id ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.bundleSize,
                      {
                        color: bundle === b.id ? colors.primary : colors.text,
                        fontFamily: "Inter_700Bold",
                      },
                    ]}
                  >
                    {b.size}
                  </Text>
                  <Text style={[styles.bundleValidity, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {b.validity}
                  </Text>
                  <Text
                    style={[
                      styles.bundlePrice,
                      {
                        color: bundle === b.id ? colors.primary : colors.text,
                        fontFamily: "Inter_600SemiBold",
                      },
                    ]}
                  >
                    ₦{b.price.toLocaleString()}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

          <Button
            onPress={handleBuy}
            loading={loading}
            disabled={!canSubmit}
            fullWidth
            size="large"
          >
            {tab === "airtime"
              ? `Buy Airtime${amount ? ` — ₦${Number(amount).toLocaleString()}` : ""}`
              : `Buy ${selectedBundle ? selectedBundle.size : "Data"}${selectedBundle ? ` — ₦${selectedBundle.price.toLocaleString()}` : ""}`
            }
          </Button>
      </ScrollView>

      <SuccessModal
        visible={success}
        title={tab === "airtime" ? "Airtime Purchased!" : "Data Purchased!"}
        subtitle={
          tab === "airtime"
            ? `₦${Number(amount).toLocaleString()} to ${phone}`
            : `${selectedBundle?.size ?? ""} to ${phone}`
        }
        onDismiss={() => { setSuccess(false); setAmount(""); setBundle(""); }}
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
  tabs: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: "center",
  },
  tabText: { fontSize: 14 },
  sectionLabel: { fontSize: 13, marginBottom: 10 },
  networks: { flexDirection: "row", gap: 10 },
  networkCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  networkName: { fontSize: 12 },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  recentText: { fontSize: 12 },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  quickChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipText: { fontSize: 13 },
  bundles: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  bundleCard: {
    width: "30%",
    flex: 1,
    minWidth: "28%",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 4,
    alignItems: "center",
  },
  bundleSize: { fontSize: 16 },
  bundleValidity: { fontSize: 11 },
  bundlePrice: { fontSize: 13 },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  successText: { fontSize: 15 },
});
