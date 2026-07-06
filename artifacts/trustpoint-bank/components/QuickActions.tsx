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
        <React.Fragment key={rowIdx}>
          {rowIdx > 0 && (
            <LinearGradient
              pointerEvents="none"
              colors={[
                "rgba(255,255,255,0)",
                "rgba(255,255,255,0.28)",
                "rgba(255,255,255,0)",
              ]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.rowSeparator}
            />
          )}
          <View style={styles.row}>
            {row.map((action, idx) => (
              <View key={idx} style={[styles.item, idx < 3 && styles.itemGap]}>
                <ActionButton {...action} />
              </View>
            ))}
          </View>
        </React.Fragment>
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
          style={styles.tile}
        >
          <View
            style={[
              styles.iconCircle,
              accent
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.charcoal },
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
              { color: accent ? colors.primary : colors.mutedForeground, fontFamily: "Inter_500Medium" },
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
  grid: { rowGap: 22 },
  row: { flexDirection: "row" },
  rowSeparator: { height: 2, marginVertical: 8, borderRadius: 1 },
  item: { flex: 1 },
  itemGap: { marginRight: 10 },
  tile: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  label: { fontSize: 10, letterSpacing: -0.1 },
});
