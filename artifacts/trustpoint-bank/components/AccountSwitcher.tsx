/**
 * AccountSwitcher — modal bottom sheet for switching between linked bank accounts.
 * Shows TrustPoint + any linked accounts; can add new ones from the bank list.
 */

import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BankLogo } from "@/components/BankLogo";
import { TpIcon } from "@/components/TpIcon";
import { useApp, LinkedAccount } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { NIGERIAN_BANKS } from "@/constants/banks";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AccountSwitcher({ visible, onClose }: Props) {
  const colors = useColors();
  const { linkedAccounts, activeAccountId, switchAccount, addLinkedAccount, user } = useApp();
  const isDark = colors.background !== "#F4F5F7";

  const [showAddBank, setShowAddBank] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [adding, setAdding] = useState(false);

  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleAddAccount = async () => {
    if (!selectedBank || accountNumber.length < 10) return;
    setAdding(true);
    try {
      await addLinkedAccount(selectedBank, accountNumber);
      setShowAddBank(false);
      setSelectedBank(null);
      setAccountNumber("");
      setBankSearch("");
    } finally {
      setAdding(false);
    }
  };

  const handleSwitch = (id: string) => {
    switchAccount(id);
    onClose();
  };

  const formatAcct = (num: string) => {
    const d = num.replace(/\D/g, "");
    if (d.length >= 4) return `**** **** ${d.slice(-4)}`;
    return "**** **** ****";
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: isDark ? "#0F0F0F" : "#fff", borderColor: colors.border }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {!showAddBank ? (
          <>
            <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              Switch Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Select an account to use
            </Text>

            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {linkedAccounts.map((acct) => {
                const isActive = acct.id === activeAccountId;
                return (
                  <Pressable
                    key={acct.id}
                    onPress={() => handleSwitch(acct.id)}
                    style={({ pressed }) => [
                      styles.accountRow,
                      {
                        backgroundColor: isActive
                          ? colors.primary + "14"
                          : isDark ? "#1A1A1A" : "#F6F6F6",
                        borderColor: isActive ? colors.primary + "55" : colors.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <BankLogo bankName={acct.bankName} size={46} />
                    <View style={styles.acctInfo}>
                      <Text style={[styles.bankName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                        {acct.bankName}
                      </Text>
                      <Text style={[styles.acctNum, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                        {formatAcct(acct.accountNumber)}
                      </Text>
                      <Text style={[styles.balance, { color: colors.success, fontFamily: "Inter_700Bold" }]}>
                        ₦{acct.balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                    {isActive && (
                      <View style={[styles.activeDot, { backgroundColor: colors.primary }]}>
                        <TpIcon name="check" size={12} color="#fff" strokeWidth={2.5} />
                      </View>
                    )}
                  </Pressable>
                );
              })}

              {/* Add new account */}
              <Pressable
                onPress={() => setShowAddBank(true)}
                style={({ pressed }) => [
                  styles.addRow,
                  {
                    backgroundColor: "transparent",
                    borderColor: colors.border,
                    borderStyle: "dashed",
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <View style={[styles.addIcon, { backgroundColor: colors.primary + "18" }]}>
                  <TpIcon name="plus" size={20} color={colors.primary} strokeWidth={2} />
                </View>
                <Text style={[styles.addLabel, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
                  Add another bank account
                </Text>
              </Pressable>
            </ScrollView>
          </>
        ) : (
          <>
            {/* Add bank flow */}
            <View style={styles.addHeader}>
              <TouchableOpacity onPress={() => { setShowAddBank(false); setSelectedBank(null); setAccountNumber(""); }}>
                <TpIcon name="arrow-left" size={22} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
              <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold", flex: 1, textAlign: "center" }]}>
                Add Bank Account
              </Text>
              <View style={{ width: 30 }} />
            </View>

            {!selectedBank ? (
              <>
                <View style={[styles.searchWrap, { backgroundColor: isDark ? "#1A1A1A" : "#F0F0F0", borderColor: colors.border }]}>
                  <TpIcon name="search" size={16} color={colors.mutedForeground} strokeWidth={1.8} />
                  <TextInput
                    value={bankSearch}
                    onChangeText={setBankSearch}
                    placeholder="Search bank…"
                    placeholderTextColor={colors.placeholder}
                    style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
                    autoCapitalize="none"
                  />
                </View>
                <FlatList
                  data={filteredBanks}
                  keyExtractor={(b) => b.name}
                  style={styles.bankList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item: b }) => (
                    <Pressable
                      onPress={() => setSelectedBank(b.name)}
                      style={({ pressed }) => [
                        styles.bankRow,
                        { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                      ]}
                    >
                      <BankLogo bankName={b.name} size={38} />
                      <Text style={[styles.bankRowName, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
                        {b.name}
                      </Text>
                      <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
                    </Pressable>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.sep, { backgroundColor: colors.border }]} />
                  )}
                />
              </>
            ) : (
              <View style={styles.acctInputWrap}>
                <View style={styles.selectedBankRow}>
                  <BankLogo bankName={selectedBank} size={52} />
                  <Text style={[styles.selectedBankName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                    {selectedBank}
                  </Text>
                </View>
                <Text style={[styles.inputLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                  Enter your {selectedBank} account number
                </Text>
                <View style={[styles.numInput, { backgroundColor: isDark ? "#1A1A1A" : "#F0F0F0", borderColor: colors.border }]}>
                  <TextInput
                    value={accountNumber}
                    onChangeText={(t) => setAccountNumber(t.replace(/\D/g, "").slice(0, 10))}
                    placeholder="0000000000"
                    placeholderTextColor={colors.placeholder}
                    keyboardType="number-pad"
                    maxLength={10}
                    style={[styles.numInputField, { color: colors.text, fontFamily: "Inter_700Bold" }]}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleAddAccount}
                  disabled={accountNumber.length < 10 || adding}
                  style={[
                    styles.addBtn,
                    {
                      backgroundColor: accountNumber.length >= 10 ? colors.primary : colors.muted,
                      opacity: adding ? 0.7 : 1,
                    },
                  ]}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.addBtnText, { fontFamily: "Inter_700Bold" }]}>
                    {adding ? "Adding…" : "Link Account"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
    paddingTop: 12,
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 20,
  },
  list: { flex: 1 },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  acctInfo: { flex: 1, gap: 3 },
  bankName: { fontSize: 15, letterSpacing: -0.2 },
  acctNum: { fontSize: 12, letterSpacing: 1 },
  balance: { fontSize: 14, letterSpacing: -0.3 },
  activeDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  addIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: { fontSize: 15 },

  // Add bank flow
  addHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, padding: 0 },
  bankList: { flex: 1 },
  bankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
  },
  bankRowName: { flex: 1, fontSize: 14 },
  sep: { height: StyleSheet.hairlineWidth },

  acctInputWrap: { gap: 18 },
  selectedBankRow: { flexDirection: "row", alignItems: "center", gap: 16, paddingVertical: 8 },
  selectedBankName: { fontSize: 20, letterSpacing: -0.5 },
  inputLabel: { fontSize: 13 },
  numInput: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  numInputField: {
    fontSize: 28,
    letterSpacing: 6,
    textAlign: "center",
    padding: 0,
  },
  addBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    fontSize: 16,
    color: "#fff",
  },
});
