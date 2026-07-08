import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { PLAN_CATEGORIES, type PlanCategory } from "./dataPlanData";

interface Props {
  selected: PlanCategory;
  onSelect: (c: PlanCategory) => void;
}

export function PlanCategoryChips({ selected, onSelect }: Props) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {PLAN_CATEGORIES.map((cat) => (
        <CategoryChip
          key={cat.id}
          label={cat.label}
          active={cat.id === selected}
          colors={colors}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(cat.id);
          }}
        />
      ))}
    </ScrollView>
  );
}

function CategoryChip({
  label, active, colors, onPress,
}: {
  label: string; active: boolean; colors: any; onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.91, { damping: 14, stiffness: 260 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 14, stiffness: 260 }); }}
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
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: { paddingHorizontal: 20, gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
  },
  label: { fontSize: 13 },
});
