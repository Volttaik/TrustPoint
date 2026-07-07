import React from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { TpIcon, TpIconName } from "@/components/TpIcon";

export interface Action {
  icon: TpIconName;
  label: string;
  onPress: () => void;
  accent?: boolean;
}

interface QuickActionsProps {
  actions: Action[];
}

const H_PAD = 20;
const GAP   = 5;
const COLS  = 4;

export function QuickActions({ actions }: QuickActionsProps) {
  const screenW = Dimensions.get("window").width;
  const cardW   = Math.floor((screenW - H_PAD * 2 - GAP * (COLS - 1)) / COLS);
  const cardH   = Math.floor(cardW * 1.0);

  const rows: Action[][] = [];
  for (let i = 0; i < actions.length; i += COLS) {
    rows.push(actions.slice(i, i + COLS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((action) => (
            <ActionCard key={action.label} {...action} cardW={cardW} cardH={cardH} />
          ))}
        </View>
      ))}
    </View>
  );
}

function ActionCard({
  icon,
  label,
  onPress,
  accent,
  cardW,
  cardH,
}: Action & { cardW: number; cardH: number }) {
  const colors = useColors();
  const isDark = colors.background !== "#F4F5F7";
  const scale  = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const cardBg    = accent ? colors.primary : isDark ? "#161616" : "#F0F0F0";
  const iconColor = accent ? "#FFFFFF"      : isDark ? "#C8C8C8" : "#2A2A2A";
  const txtColor  = accent ? "#FFFFFF"      : colors.mutedForeground;

  return (
    <Animated.View style={[{ width: cardW, height: cardH }, aStyle]}>
      <Pressable
        style={[
          styles.card,
          {
            width: cardW,
            height: cardH,
            backgroundColor: cardBg,
            borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.92, { damping: 14, stiffness: 220 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 14, stiffness: 220 }); }}
      >
        <TpIcon name={icon} size={20} color={iconColor} strokeWidth={1.7} />
        <Text
          style={[styles.label, { color: txtColor, fontFamily: "Inter_500Medium" }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: GAP },
  row:  { flexDirection: "row", gap: GAP },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  label: {
    fontSize: 9.5,
    letterSpacing: -0.1,
    textAlign: "center",
  },
});
