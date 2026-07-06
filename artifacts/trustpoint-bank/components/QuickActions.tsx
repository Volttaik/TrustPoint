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

const BANK_ICONS = new Set<BankIconName>(["transfer", "deposit", "airtime", "data", "bills", "cards", "savings", "more"]);

function renderBankIcon(name: BankIconName, colors: any, accent: boolean) {
  const iconColor = accent ? colors.primary : colors.text;
  const iconAccent = accent ? "#fff" : colors.primary;
  const size = 22;
  switch (name) {
    case "transfer": return <TransferIcon size={size} color={iconColor} accent={iconAccent} />;
    case "deposit": return <DepositIcon size={size} color={iconColor} accent={accent ? "#fff" : "#2FBE73"} />;
    case "airtime": return <AirtimeIcon size={size} color={iconColor} accent={iconAccent} />;
    case "data": return <DataIcon size={size} color={iconColor} accent={accent ? "#fff" : "#3E8BFF"} />;
    case "bills": return <BillsIcon size={size} color={iconColor} accent={accent ? "#fff" : "#E3A008"} />;
    case "cards": return <CardsIcon size={size} color={iconColor} accent={accent ? "#fff" : "#3E8BFF"} />;
    case "savings": return <SavingsIcon size={size} color={iconColor} accent={accent ? "#fff" : "#2FBE73"} />;
    case "more": return <MoreIcon size={size} color={iconColor} accent={iconAccent} />;
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

  const isBankIcon = BANK_ICONS.has(icon as BankIconName);

  return (
    <View style={styles.item}>
      <Animated.View style={aStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          onPressIn={() => { scale.value = withSpring(0.94, { damping: 14, stiffness: 220 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 220 }); }}
          style={[
            styles.tile,
            {
              backgroundColor: accent ? colors.primaryDeep : colors.card,
              borderColor: accent ? colors.primary : colors.borderStrong,
            },
          ]}
        >
          <View
            style={[
              styles.iconCircle,
              accent
                ? { backgroundColor: "#000000", borderColor: colors.primary }
                : { backgroundColor: colors.charcoal, borderColor: colors.borderStrong },
            ]}
          >
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0)", "rgba(255,255,255,0.08)"]}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
            {isBankIcon
              ? renderBankIcon(icon as BankIconName, colors, !!accent)
              : <TpIcon name={icon as TpIconName} size={18} color={accent ? colors.primary : colors.text} strokeWidth={2} />
            }
          </View>
          <Text
            style={[styles.label, { color: accent ? "#FFFFFF" : colors.mutedForeground, fontFamily: "Inter_500Medium" }]}
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
  grid: {
    rowGap: 12,
  },
  row: {
    flexDirection: "row",
  },
  item: { flex: 1 },
  itemGap: { marginRight: 12 },
  tile: {
    aspectRatio: 1,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 9,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    overflow: "hidden",
  },
  label: { fontSize: 10.5, letterSpacing: -0.1 },
});
