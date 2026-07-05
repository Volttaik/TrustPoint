import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { TpIcon, TpIconName } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

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
  return (
    <View style={styles.grid}>
      {actions.map((action, idx) => (
        <ActionButton key={idx} {...action} />
      ))}
    </View>
  );
}

function ActionButton({ icon, label, onPress, accent }: Action) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  const gradientColors: [string, string] = accent
    ? ["#EF3349", "#C0142A"]
    : [colors.charcoal, colors.graphite];

  return (
    <View style={styles.item}>
      <Animated.View style={aStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          onPressIn={() => { scale.value = withSpring(0.9, { damping: 14, stiffness: 220 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 220 }); }}
          style={styles.touchable}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[
              styles.iconSquare,
              {
                shadowColor: accent ? colors.primary : "#000",
                shadowOpacity: accent ? 0.35 : 0.3,
              },
            ]}
          >
            <View pointerEvents="none" style={styles.topHighlight} />
            <TpIcon name={icon} size={21} color="#fff" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 18,
  },
  item: { width: "25%", alignItems: "center", gap: 8 },
  touchable: { borderRadius: 18 },
  iconSquare: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  label: { fontSize: 11.5, letterSpacing: -0.1 },
});
