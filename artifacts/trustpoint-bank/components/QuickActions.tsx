import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

const H_PAD  = 20; // must match the parent ScrollView horizontal padding
const GAP    = 8;  // gap between every card
const COLS   = 4;

export function QuickActions({ actions }: QuickActionsProps) {
  const screenW = Dimensions.get("window").width;
  // Each card gets exactly ¼ of the usable width
  const cardW = Math.floor((screenW - H_PAD * 2 - GAP * (COLS - 1)) / COLS);
  const cardH = Math.floor(cardW * 1.0); // square cards

  // Slice into rows of 4
  const rows: Action[][] = [];
  for (let i = 0; i < actions.length; i += COLS) {
    rows.push(actions.slice(i, i + COLS));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((action) => (
            <ActionCard
              key={action.label}
              {...action}
              cardW={cardW}
              cardH={cardH}
            />
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
  const colors  = useColors();
  const isDark  = colors.background !== "#F4F5F7";
  const scale   = useSharedValue(1);
  const aStyle  = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const cardBg    = accent ? colors.primary  : (isDark ? "#161616" : "#F0F0F0");
  const iconColor = accent ? "#FFFFFF"        : (isDark ? "#D0D0D0" : "#2A2A2A");
  const txtColor  = accent ? "#FFFFFF"        : colors.mutedForeground;

  return (
    <Animated.View style={[{ width: cardW, height: cardH }, aStyle]}>
      <Pressable
        style={[
          styles.card,
          {
            width: cardW,
            height: cardH,
            backgroundColor: cardBg,
            borderColor: isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.07)",
          },
          Platform.select({
            web: {
              boxShadow:
                "inset 0 2px 7px rgba(0,0,0,0.70), inset 0 -1px 0 rgba(255,255,255,0.04)",
            } as any,
          }),
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
      >
        {/* Caved-in inset shadow overlay (native) */}
        {!accent && (
          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ["rgba(0,0,0,0.52)", "rgba(0,0,0,0.12)", "transparent"]
                : ["rgba(0,0,0,0.07)", "transparent"]
            }
            locations={isDark ? [0, 0.42, 1] : [0, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Icon — upper portion */}
        <TpIcon name={icon} size={26} color={iconColor} strokeWidth={1.75} />

        {/* Label — directly below icon */}
        <Text
          style={[
            styles.label,
            { color: txtColor, fontFamily: "Inter_500Medium" },
          ]}
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
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 4,
    paddingVertical: 10,
  },
  label: {
    fontSize: 11,
    letterSpacing: -0.15,
    textAlign: "center",
  },
});
