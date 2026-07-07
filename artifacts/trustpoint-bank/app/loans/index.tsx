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
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const LOAN_PRODUCTS = [
  {
    id: "quick",
    name: "Quick Loan",
    desc: "Get up to ₦100,000 instantly",
    max: 100000,
    rate: "5%/mo",
    tenure: "1-3 months",
    icon: "zap" as TpIconName,
    color: "#FFD700",
  },
  {
    id: "salary",
    name: "Salary Advance",
    desc: "Up to 50% of your salary",
    max: 500000,
    rate: "3.5%/mo",
    tenure: "1-6 months",
    icon: "trending-up" as TpIconName,
    color: "#34C759",
  },
  {
    id: "business",
    name: "Business Loan",
    desc: "Grow your business",
    max: 5000000,
    rate: "2.5%/mo",
    tenure: "3-24 months",
    icon: "activity" as TpIconName,
    color: "#007AFF",
  },
];

export default function LoansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const product = LOAN_PRODUCTS.find((p) => p.id === selected);

  const monthlyRate = selected === "quick" ? 0.05 : selected === "salary" ? 0.035 : 0.025;
  const numAmount = Number(amount) || 0;
  const numTenure = Number(tenure) || 0;
  const monthly = numAmount > 0 && numTenure > 0
    ? (numAmount * monthlyRate + numAmount / numTenure)
    : 0;
  const total = monthly * numTenure;

  const handleApply = async () => {
    setApplying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setApplying(false);
    setApplied(true);
  };

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
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>Loans</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {applied ? (
          <View style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: colors.success + "20" }]}>
              <TpIcon name="check-circle" size={52} color={colors.success} strokeWidth={1.5} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Application Submitted!
            </Text>
            <Text style={[styles.successSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Your loan application is under review. We'll notify you within 24 hours.
            </Text>
            <Button onPress={() => { setApplied(false); setSelected(null); setAmount(""); setTenure(""); }} fullWidth variant="secondary">
              Apply for Another
            </Button>
          </View>
        ) : (
          <>
            {/* Credit Score Card */}
            <View style={[styles.scoreCard, { backgroundColor: colors.primary }]}>
              <View>
                <Text style={[styles.scoreLabel, { fontFamily: "Inter_400Regular" }]}>Credit Score</Text>
                <Text style={[styles.scoreValue, { fontFamily: "Inter_700Bold" }]}>712</Text>
                <Text style={[styles.scoreGrade, { fontFamily: "Inter_500Medium" }]}>Good ✓</Text>
              </View>
              <View style={styles.scoreRight}>
                <Text style={[styles.eligibleLabel, { fontFamily: "Inter_400Regular" }]}>Max Eligible</Text>
                <Text style={[styles.eligibleAmount, { fontFamily: "Inter_700Bold" }]}>₦500,000</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              Loan Products
            </Text>

            {LOAN_PRODUCTS.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setSelected(p.id === selected ? null : p.id)}
                style={[
                  styles.productCard,
                  {
                    backgroundColor: selected === p.id ? p.color + "12" : colors.card,
                    borderColor: selected === p.id ? p.color : colors.border,
                  },
                ]}
              >
                <View style={[styles.productIcon, { backgroundColor: p.color + "20" }]}>
                  <TpIcon name={p.icon} size={22} color={p.color} strokeWidth={1.8} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                    {p.name}
                  </Text>
                  <Text style={[styles.productDesc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                    {p.desc}
                  </Text>
                  <View style={styles.productMeta}>
                    <View style={[styles.metaBadge, { backgroundColor: p.color + "20" }]}>
                      <Text style={[styles.metaText, { color: p.color, fontFamily: "Inter_500Medium" }]}>
                        {p.rate}
                      </Text>
                    </View>
                    <View style={[styles.metaBadge, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.metaText, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                        {p.tenure}
                      </Text>
                    </View>
                  </View>
                </View>
                <TpIcon
                  name={selected === p.id ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.mutedForeground}
                  strokeWidth={2}
                />
              </Pressable>
            ))}

            {product && (
              <View style={[styles.applyForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.formTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  Apply for {product.name}
                </Text>

                <Input
                  label="Loan Amount (₦)"
                  value={amount}
                  onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  placeholder={`Up to ₦${product.max.toLocaleString()}`}
                  prefixIcon={<Text style={{ color: colors.placeholder, fontSize: 16, fontFamily: "Inter_400Regular" }}>₦</Text>}
                />

                <View>
                  <Text style={[styles.tenureLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                    Repayment Tenure
                  </Text>
                  <View style={styles.tenureRow}>
                    {["1", "2", "3", "6", "12", "24"].map((t) => (
                      <Pressable
                        key={t}
                        onPress={() => setTenure(t)}
                        style={[
                          styles.tenureChip,
                          {
                            backgroundColor: tenure === t ? colors.primary : colors.surface,
                            borderColor: tenure === t ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.tenureText,
                            {
                              color: tenure === t ? "#fff" : colors.mutedForeground,
                              fontFamily: "Inter_500Medium",
                            },
                          ]}
                        >
                          {t}mo
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {monthly > 0 && (
                  <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <SummaryRow label="Monthly Payment" value={`₦${Math.round(monthly).toLocaleString()}`} colors={colors} />
                    <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                    <SummaryRow label="Total Repayment" value={`₦${Math.round(total).toLocaleString()}`} colors={colors} />
                    <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                    <SummaryRow label="Interest" value={`₦${Math.round(total - numAmount).toLocaleString()}`} colors={colors} accent />
                  </View>
                )}

                <Button
                  onPress={handleApply}
                  loading={applying}
                  disabled={!amount || !tenure || Number(amount) <= 0}
                  fullWidth
                  size="large"
                >
                  Apply Now
                </Button>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function SummaryRow({ label, value, colors, accent }: { label: string; value: string; colors: any; accent?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular", fontSize: 13 }}>{label}</Text>
      <Text style={{ color: accent ? colors.destructive : colors.text, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>{value}</Text>
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
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  scroll: { paddingHorizontal: 20, gap: 16, paddingTop: 4 },
  scoreCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreLabel: { fontSize: 12, color: "#ffffff88" },
  scoreValue: { fontSize: 48, color: "#fff", letterSpacing: -2 },
  scoreGrade: { fontSize: 13, color: "#ffffffCC" },
  scoreRight: { alignItems: "flex-end" },
  eligibleLabel: { fontSize: 12, color: "#ffffff88" },
  eligibleAmount: { fontSize: 22, color: "#fff", letterSpacing: -0.5 },
  sectionTitle: { fontSize: 17, letterSpacing: -0.3 },
  productCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  productIcon: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  productName: { fontSize: 15, marginBottom: 3, letterSpacing: -0.3 },
  productDesc: { fontSize: 12.5, marginBottom: 8 },
  productMeta: { flexDirection: "row", gap: 8 },
  metaBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  metaText: { fontSize: 11 },
  applyForm: { borderRadius: 20, borderWidth: 1, padding: 20, gap: 16 },
  formTitle: { fontSize: 16, letterSpacing: -0.3 },
  tenureLabel: { fontSize: 13, marginBottom: 10 },
  tenureRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tenureChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  tenureText: { fontSize: 13 },
  summary: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 2 },
  summaryDivider: { height: 0.5, marginVertical: 2 },
  successContainer: { alignItems: "center", gap: 20, paddingTop: 40 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 24, letterSpacing: -0.5 },
  successSub: { fontSize: 14, textAlign: "center", lineHeight: 22, color: "#888" },
});
