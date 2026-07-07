import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CardCarousel } from "@/components/CardCarousel";
import { Button } from "@/components/ui/Button";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Card } from "@/context/AppContext";

export default function CardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { cards, freezeCard, user } = useApp();
  const [selectedCard, setSelectedCard] = useState<Card>(cards[0]);
  const [showCVV, setShowCVV] = useState(false);
  const [controls, setControls] = useState({
    online: true,
    pos: true,
    atm: true,
    international: false,
  });
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const bottomPad = 90 + (Platform.OS === "web" ? 34 : 0);

  const handleFreeze = () => {
    Alert.alert(
      selectedCard.frozen ? "Unfreeze Card" : "Freeze Card",
      selectedCard.frozen
        ? "This will reactivate your card."
        : "This will temporarily disable all transactions.",
      [
        { text: "Cancel", style: "cancel" },
        { text: selectedCard.frozen ? "Unfreeze" : "Freeze", style: "destructive", onPress: () => freezeCard(selectedCard.id) },
      ],
    );
  };

  const ControlRow = ({ label, icon, k }: { label: string; icon: TpIconName; k: keyof typeof controls }) => (
    <View style={styles.controlRow}>
      <View style={styles.controlLeft}>
        <View style={[styles.controlIcon, { backgroundColor: colors.primary + "22" }]}>
          <TpIcon name={icon} size={16} color={colors.primary} strokeWidth={1.8} />
        </View>
        <Text style={[styles.controlLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>{label}</Text>
      </View>
      <Switch
        value={controls[k]}
        onValueChange={(v) => setControls((c) => ({ ...c, [k]: v }))}
        trackColor={{ false: colors.border, true: colors.primary + "88" }}
        thumbColor={controls[k] ? colors.primary : colors.mutedForeground}
        ios_backgroundColor={colors.border}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colors.background !== "#F4F5F7" ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 8, paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>My Cards</Text>

        <CardCarousel
          cards={cards}
          onCardPress={(c) => setSelectedCard(c)}
        />

        {/* Card Detail */}
        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Card Number
            </Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
              {selectedCard?.number ?? cards[0]?.number}
            </Text>
          </View>
          <View style={[styles.detailSep, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              CVV
            </Text>
            <Pressable onPress={() => setShowCVV((v) => !v)} style={styles.cvvRow}>
              <Text style={[styles.detailValue, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {showCVV ? (selectedCard?.cvv ?? "***") : "•••"}
              </Text>
              <TpIcon name={showCVV ? "eye-off" : "eye"} size={14} color={colors.mutedForeground} strokeWidth={1.8} />
            </Pressable>
          </View>
          <View style={[styles.detailSep, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Balance
            </Text>
            <Text style={[styles.detailValue, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
              ₦{(selectedCard?.balance ?? 0).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleFreeze}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <TpIcon
              name={(selectedCard?.frozen ?? false) ? "unlock" : "lock"}
              size={20}
              color={(selectedCard?.frozen ?? false) ? colors.success : colors.primary}
              strokeWidth={1.8}
            />
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              {(selectedCard?.frozen ?? false) ? "Unfreeze" : "Freeze"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <TpIcon name="refresh-cw" size={20} color={colors.warning} strokeWidth={1.8} />
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              Replace
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <TpIcon name="settings" size={20} color={colors.info} strokeWidth={1.8} />
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: "Inter_500Medium" }]}>
              Settings
            </Text>
          </Pressable>
        </View>

        {/* Controls */}
        <View style={[styles.controlsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.controlsTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
            Transaction Controls
          </Text>
          <ControlRow label="Online Payments" icon="globe" k="online" />
          <View style={[styles.detailSep, { backgroundColor: colors.border }]} />
          <ControlRow label="POS Transactions" icon="credit-card" k="pos" />
          <View style={[styles.detailSep, { backgroundColor: colors.border }]} />
          <ControlRow label="ATM Withdrawals" icon="dollar-sign" k="atm" />
          <View style={[styles.detailSep, { backgroundColor: colors.border }]} />
          <ControlRow label="International" icon="map-pin" k="international" />
        </View>

        <Button variant="secondary" fullWidth>
          + Add New Card
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20, gap: 20 },
  title: { fontSize: 28, letterSpacing: -1 },
  detailCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 4 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 14, letterSpacing: 0.5 },
  detailSep: { height: 0.5 },
  cvvRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  actionLabel: { fontSize: 12 },
  controlsCard: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 4 },
  controlsTitle: { fontSize: 15, marginBottom: 8, letterSpacing: -0.3 },
  controlRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  controlLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  controlIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  controlLabel: { fontSize: 14 },
});
