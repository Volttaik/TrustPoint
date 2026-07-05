import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
}

interface QuickActionsProps {
  actions: Action[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const colors = useColors();
  return (
    <View style={styles.grid}>
      {actions.map((action, idx) => (
        <ActionButton key={idx} {...action} colors={colors} />
      ))}
    </View>
  );
}

function ActionButton({ icon, label, onPress, colors }: Action & { colors: any }) {
  const scale = useSharedValue(1);

  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [onPress]);

  return (
    <View style={styles.item}>
      <Animated.View style={aStyle}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={() => { scale.value = withSpring(0.9, { damping: 12, stiffness: 200 }); }}
          onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 200 }); }}
          style={[
            styles.iconCircle,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
        >
          <TpIcon name={icon} size={22} color="#fff" strokeWidth={1.8} />
        </TouchableOpacity>
      </Animated.View>
      <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  item: { alignItems: "center", gap: 8, flex: 1 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  label: { fontSize: 12 },
});
