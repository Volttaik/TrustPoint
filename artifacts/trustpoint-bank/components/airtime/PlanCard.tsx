import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import type { DataPlan } from "./dataPlanData";

interface Props {
  plan: DataPlan;
  selected: boolean;
  onPress: () => void;
}

export function PlanCard({ plan, selected, onPress }: Props) {
  const colors = useColors();
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.wrap, aStyle]}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        onPressIn={() => { scale.value = withSpring(0.96, { damping: 14, stiffness: 220 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 14, stiffness: 220 }); }}
        style={[
          styles.card,
          {
            backgroundColor: selected ? colors.primary + "10" : colors.card,
            borderColor:     selected ? colors.primary : colors.border,
            borderWidth:     selected ? 1.5 : 1,
          },
        ]}
      >
        {/* Cashback badge */}
        {plan.cashback != null && (
          <View style={styles.cashbackBadge}>
            <Text style={[styles.cashbackText, { fontFamily: "Inter_600SemiBold" }]}>
              ₦{plan.cashback} cashback
            </Text>
          </View>
        )}

        {/* Popular badge */}
        {plan.popular && !plan.cashback && (
          <View style={[styles.popularBadge, { backgroundColor: colors.success + "22" }]}>
            <Text style={[styles.popularText, { color: colors.success, fontFamily: "Inter_600SemiBold" }]}>
              Popular
            </Text>
          </View>
        )}

        {/* Bundle size */}
        <Text
          style={[
            styles.size,
            { color: selected ? colors.primary : colors.text, fontFamily: "Inter_700Bold" },
          ]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {plan.size}
        </Text>

        {/* Price */}
        <Text
          style={[
            styles.price,
            { color: selected ? colors.primary : colors.text, fontFamily: "Inter_700Bold" },
          ]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          ₦{plan.price.toLocaleString()}
        </Text>

        {/* Validity */}
        <Text style={[styles.validity, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {plan.validity}
        </Text>

        {/* Description */}
        <Text
          style={[styles.desc, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
          numberOfLines={2}
        >
          {plan.description}
        </Text>

        {/* Bonus tag */}
        {plan.bonus && (
          <View style={[styles.bonusTag, { backgroundColor: colors.info + "18" }]}>
            <Text style={[styles.bonusText, { color: colors.info, fontFamily: "Inter_500Medium" }]}>
              {plan.bonus}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  /** 48% width → forced 2-column grid regardless of plan count */
  wrap: { flexBasis: "48%", flexGrow: 0, flexShrink: 0 },
  card: {
    borderRadius: 14,
    padding: 12,
    gap: 3,
    minHeight: 108,
  },
  cashbackBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#7C3AED22",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 5,
  },
  cashbackText: { fontSize: 9, color: "#7C3AED" },
  popularBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 5,
  },
  popularText: { fontSize: 9 },
  size:     { fontSize: 15, letterSpacing: -0.3 },
  price:    { fontSize: 13, letterSpacing: -0.2 },
  validity: { fontSize: 10, marginTop: 1 },
  desc:     { fontSize: 9,  lineHeight: 13, marginTop: 1 },
  bonusTag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginTop: 3,
  },
  bonusText: { fontSize: 9 },
});
