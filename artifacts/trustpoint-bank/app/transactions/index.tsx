import React, { useState } from "react";
import {
  FlatList,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TransactionItem } from "@/components/TransactionItem";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Transaction } from "@/context/AppContext";

function groupByDate(transactions: Transaction[]) {
  const groups: { [key: string]: Transaction[] } = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    let key: string;
    if (diffDays === 0) key = "Today";
    else if (diffDays === 1) key = "Yesterday";
    else if (diffDays < 7) key = "This Week";
    else key = date.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(tx);
  });
  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

const FILTERS = ["All", "Credit", "Debit", "Pending", "Failed"];

export default function TransactionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  const filtered = transactions.filter((tx) => {
    const matchQuery = tx.title.toLowerCase().includes(query.toLowerCase()) || tx.subtitle.toLowerCase().includes(query.toLowerCase());
    const matchFilter =
      filter === "All" ||
      (filter === "Credit" && tx.type === "credit") ||
      (filter === "Debit" && tx.type === "debit") ||
      (filter === "Pending" && tx.status === "pending") ||
      (filter === "Failed" && tx.status === "failed");
    return matchQuery && matchFilter;
  });

  const sections = groupByDate(filtered);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Transactions
        </Text>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <TpIcon name="sliders" size={18} color={colors.text} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TpIcon name="search" size={17} color={colors.mutedForeground} strokeWidth={1.8} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
          placeholder="Search transactions..."
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <TpIcon name="x" size={15} color={colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={FILTERS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(f) => f}
        contentContainerStyle={styles.filterList}
        renderItem={({ item }) => {
          const active = filter === item;
          return (
            <TouchableOpacity
              onPress={() => setFilter(item)}
              style={[
                styles.filterChip,
                { backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border },
              ]}
            >
              <Text style={[styles.filterText, { color: active ? "#fff" : colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <SectionList
        sections={sections}
        keyExtractor={(tx) => tx.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 24 }]}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: colors.mutedForeground, backgroundColor: colors.background, fontFamily: "Inter_500Medium" }]}>
            {title}
          </Text>
        )}
        renderItem={({ item }) => (
          <TransactionItem tx={item} onPress={() => router.push(`/transactions/${item.id}` as any)} />
        )}
        ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: colors.border }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <TpIcon name="inbox" size={36} color={colors.mutedForeground} strokeWidth={1.5} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No transactions found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, height: 46, borderRadius: 23, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  filterList: { paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13 },
  list: { paddingHorizontal: 20 },
  sectionHeader: { fontSize: 12, paddingVertical: 8, marginTop: 8 },
  sep: { height: 0.5, marginLeft: 60 },
  empty: { alignItems: "center", gap: 8, paddingTop: 60 },
  emptyText: { fontSize: 15 },
});
