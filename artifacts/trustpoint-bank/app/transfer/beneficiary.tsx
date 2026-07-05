import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Beneficiary } from "@/context/AppContext";

export default function BeneficiaryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { beneficiaries, toggleFavorite } = useApp();
  const [query, setQuery] = useState("");
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);

  const filtered = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.bank.toLowerCase().includes(query.toLowerCase()),
  );

  const renderItem = ({ item }: { item: Beneficiary }) => (
    <Pressable
      onPress={() => router.push({ pathname: "/transfer/amount", params: { beneficiaryId: item.id } })}
      style={({ pressed }) => [
        styles.item,
        { borderBottomColor: colors.border, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Avatar initials={item.initials} color={item.avatarColor} size={48} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemBank, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {item.bank} · {item.account}
        </Text>
      </View>
      <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favBtn}>
        <Feather
          name="star"
          size={18}
          color={item.favorite ? "#FFD60A" : colors.mutedForeground}
          style={item.favorite ? undefined : undefined}
        />
      </TouchableOpacity>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background === "#0A0A0A" ? "light" : "dark"} />
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Select Beneficiary
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="search" size={18} color={colors.mutedForeground} />
        <TextInput
          style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
          placeholder="Search name or bank..."
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Add new */}
      <Pressable
        onPress={() => {}}
        style={[styles.addNew, { borderColor: colors.primary + "44", backgroundColor: colors.primary + "10" }]}
      >
        <View style={[styles.addIcon, { backgroundColor: colors.primary + "22" }]}>
          <Feather name="user-plus" size={18} color={colors.primary} />
        </View>
        <Text style={[styles.addText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
          Add New Beneficiary
        </Text>
      </Pressable>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: colors.border }]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="users" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              No beneficiaries found
            </Text>
          </View>
        }
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
    paddingBottom: 12,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15 },
  addNew: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  addText: { fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  itemName: { fontSize: 15, marginBottom: 2, letterSpacing: -0.3 },
  itemBank: { fontSize: 12 },
  favBtn: { padding: 6 },
  sep: { height: 0.5, marginLeft: 60 },
  empty: { alignItems: "center", gap: 8, paddingTop: 40 },
  emptyText: { fontSize: 14 },
});
