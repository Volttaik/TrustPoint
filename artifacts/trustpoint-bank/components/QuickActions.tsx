import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import {
  TransferIcon,
  DepositIcon,
  AirtimeIcon,
  DataIcon,
  BillsIcon,
  CardsIcon,
  SavingsIcon,
  MoreIcon,
} from "@/components/BankIcons";
import { TpIcon, TpIconName } from "@/components/TpIcon";

export type BankIconName =
  | "transfer"
  | "deposit"
  | "airtime"
  | "data"
  | "bills"
  | "cards"
  | "savings"
  | "more";

export type ActionIconName = BankIconName | TpIconName;

interface Action {
  icon: ActionIconName;
  label: string;
  onPress: () => void;
  accent?: boolean;
}

interface QuickActionsProps {
  actions: Action[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const rows: Action[][] = [];
  for (let i = 0; i < actions.length; i += 4) {
    rows.push(actions.slice(i, i + 4));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((action, idx) => (
            <View key={idx} style={[styles.item, idx < 3 && styles.itemGap]}>
              <ActionButton {...action} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const BANK_ICON_SET = new Set<BankIconName>([
  "transfer", "deposit", "airtime", "data", "bills", "cards", "savings", "more",
]);

const ICON_SIZE = 34;

function BankIconRenderer({ name }: { name: BankIconName }) {
  switch (name) {
    case "transfer": return <TransferIcon size={ICON_SIZE} />;
    case "deposit":  return <DepositIcon  size={ICON_SIZE} />;
    case "airtime":  return <AirtimeIcon  size={ICON_SIZE} />;
    case "data":     return <DataIcon     size={ICON_SIZE} />;
    case "bills":    return <BillsIcon    size={ICON_SIZE} />;
    case "cards":    return <CardsIcon    size={ICON_SIZE} />;
    case "savings":  return <SavingsIcon  size={ICON_SIZE} />;
    case "more":     return <MoreIcon     size={ICON_SIZE} />;
  }
}

function ActionButton({ icon, label, onPress, accent }: Action) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  const isBankIcon = BANK_ICON_SET.has(icon as BankIconName);

  return (
    <View style={styles.item}>
      <Animated.View style={aStyle}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handlePress}
          onPressIn={() => { scale.value = withSpring(0.93, { damping: 14, stiffness: 220 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 220 }); }}
          style={[
            styles.tile,
            {
              backgroundColor: accent ? colors.primaryDeep : colors.card,
              borderColor: accent ? "rgba(225,29,51,0.55)" : colors.borderStrong,
            },
          ]}
        >
          <LinearGradient
            pointerEvents="none"
            colors={
              accent
                ? ["rgba(255,255,255,0.07)", "rgba(0,0,0,0)", "rgba(0,0,0,0.2)"]
                : ["rgba(255,255,255,0.05)", "rgba(0,0,0,0)", "rgba(0,0,0,0.15)"]
            }
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[
              styles.iconCircle,
              accent
                ? { backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(225,29,51,0.4)" }
                : { backgroundColor: colors.charcoal, borderColor: colors.borderStrong },
            ]}
          >
            {isBankIcon ? (
              <BankIconRenderer name={icon as BankIconName} />
            ) : (
              <TpIcon
                name={icon as TpIconName}
                size={20}
                color={accent ? "#fff" : colors.text}
                strokeWidth={2}
              />
            )}
          </View>
          <Text
            style={[
              styles.label,
              { color: accent ? "#FFFFFF" : colors.mutedForeground, fontFamily: "Inter_500Medium" },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { rowGap: 12 },
  row: { flexDirection: "row" },
  item: { flex: 1 },
  itemGap: { marginRight: 10 },
  tile: {
    aspectRatio: 1,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  label: { fontSize: 11, letterSpacing: -0.1 },
});
