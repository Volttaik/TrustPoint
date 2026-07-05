import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function TransactionDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { transactions } = useApp();
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.text, fontFamily: "Inter_400Regular" }}>Transaction not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.primary, marginTop: 12, fontFamily: "Inter_500Medium" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const amountColor =
    tx.status === "failed" ? colors.destructive :
    tx.type === "credit" ? colors.success : colors.primary;

  const statusColor =
    tx.status === "success" ? colors.success :
    tx.status === "pending" ? colors.warning : colors.destructive;

  const Detail = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Transaction Detail
        </Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="share-2" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 80 }]} showsVerticalScrollIndicator={false}>
        {/* Avatar + amount hero */}
        <View style={styles.hero}>
          <Avatar
            initials={tx.title.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            color={tx.avatarColor}
            size={72}
          />
          <Text style={[styles.heroTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            {tx.title}
          </Text>
          <Text
            style={[styles.heroAmount, { color: amountColor, fontFamily: "Inter_700Bold" }]}
          >
            {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "22" }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor, fontFamily: "Inter_600SemiBold" }]}>
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Detail label="Description" value={tx.subtitle} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Category" value={tx.category} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Date" value={new Date(tx.date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Time" value={new Date(tx.date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })} />
          {tx.bank && (
            <>
              <View style={[styles.sep, { backgroundColor: colors.border }]} />
              <Detail label="Bank" value={tx.bank} />
            </>
          )}
          <View style={[styles.sep, { backgroundColor: colors.border }]} />
          <Detail label="Reference" value={tx.reference} />
        </View>

        {tx.status === "failed" && (
          <View style={[styles.failedBanner, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "44" }]}>
            <Feather name="alert-circle" size={16} color={colors.destructive} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.failedTitle, { color: colors.destructive, fontFamily: "Inter_600SemiBold" }]}>
                Transaction Failed
              </Text>
              <Text style={[styles.failedSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                Reason: Network timeout. Your account was not debited.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: bottomPad + 16, borderTopColor: colors.border }]}>
        <Button variant="secondary" fullWidth onPress={() => {}}>
          {tx.status === "failed" ? "Try Again" : "Dispute Transaction"}
        </Button>
      </View>
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
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, letterSpacing: -0.3 },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 12 },
  hero: { alignItems: "center", gap: 10, paddingVertical: 16 },
  heroTitle: { fontSize: 20, letterSpacing: -0.5 },
  heroAmount: { fontSize: 40, letterSpacing: -1.5 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 13 },
  card: { borderRadius: 18, borderWidth: 1, padding: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13 },
  label: { fontSize: 13 },
  value: { fontSize: 13, letterSpacing: -0.2, maxWidth: "55%", textAlign: "right" },
  sep: { height: 0.5, marginHorizontal: 16 },
  failedBanner: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, alignItems: "flex-start" },
  failedTitle: { fontSize: 14, marginBottom: 3 },
  failedSub: { fontSize: 12, lineHeight: 18 },
  cta: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 0.5 },
});
