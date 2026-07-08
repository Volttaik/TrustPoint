import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";
import { useColors } from "@/hooks/useColors";
import * as Haptics from "expo-haptics";

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

interface Props {
  selected: string;
  onSelect: (amount: string) => void;
}

export function AmountChips({ selected, onSelect }: Props) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {AMOUNTS.map((a) => {
        const isActive = selected === String(a);
        return (
          <AmountChip
            key={a}
            amount={a}
            active={isActive}
            colors={colors}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(String(a));
            }}
          />
        );
      })}
    </ScrollView>
  );
}

function AmountChip({ amount, active, colors, onPress }: any) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9, { damping: 14, stiffness: 260 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 260 }); }}
        style={[
          styles.chip,
          {
            backgroundColor: active ? colors.primary : colors.card,
            borderColor: active ? colors.primary : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: active ? "#fff" : colors.text,
              fontFamily: active ? "Inter_700Bold" : "Inter_500Medium",
            },
          ]}
        >
          ₦{amount.toLocaleString()}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: { paddingHorizontal: 20, gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
  },
  label: { fontSize: 14 },
});
