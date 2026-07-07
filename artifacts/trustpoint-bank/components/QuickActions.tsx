import React, { useCallback } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";
import { TpIcon, TpIconName } from "@/components/TpIcon";

interface Action {
  icon: TpIconName;
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
            <View key={idx} style={styles.item}>
              <ActionButton {...action} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function ActionButton({ icon, label, onPress, accent }: Action) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const isDark = colors.background !== "#F4F5F7";

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  const boxBg = accent
    ? colors.primary
    : isDark
      ? "#161616"
      : "#EFEFEF";

  return (
    <Animated.View style={aStyle}>
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={handlePress}
        onPressIn={() => {
          scale.value = withSpring(0.93, { damping: 14, stiffness: 220 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        style={styles.tile}
      >
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: boxBg,
              borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
            },
            Platform.select({ web: { boxShadow: "inset 0 2px 6px rgba(0,0,0,0.7), inset 0 -1px 0 rgba(255,255,255,0.04)" } as any }),
          ]}
        >
          {/* Inset shadow overlay (native) */}
          {!accent && (
            <LinearGradient
              pointerEvents="none"
              colors={
                isDark
                  ? ["rgba(0,0,0,0.55)", "rgba(0,0,0,0.1)", "transparent"]
                  : ["rgba(0,0,0,0.08)", "transparent"]
              }
              locations={isDark ? [0, 0.45, 1] : [0, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <TpIcon
            name={icon}
            size={22}
            color={accent ? "#fff" : isDark ? "#D8D8D8" : "#2A2A2A"}
            strokeWidth={1.85}
          />
        </View>
        <Text
          style={[
            styles.label,
            {
              color: accent ? colors.primary : colors.mutedForeground,
              fontFamily: "Inter_500Medium",
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 20 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  item: { flex: 1, alignItems: "center" },
  tile: { alignItems: "center", gap: 9 },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
  label: { fontSize: 10.5, letterSpacing: -0.1, textAlign: "center" },
});
