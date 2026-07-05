import React, { useCallback, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface PinPadProps {
  pin: string;
  pinLength?: number;
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  shake?: boolean;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinPad({ pin, pinLength = 4, onKeyPress, onDelete, shake }: PinPadProps) {
  const colors = useColors();
  const shakeAnim = useSharedValue(0);

  useEffect(() => {
    if (shake) {
      shakeAnim.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    }
  }, [shake]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeAnim.value }],
  }));

  const handleKey = useCallback((key: string) => {
    if (!key) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (key === "del") onDelete();
    else if (pin.length < pinLength) onKeyPress(key);
  }, [pin, pinLength, onKeyPress, onDelete]);

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.dots, shakeStyle]}>
        {Array.from({ length: pinLength }).map((_, i) => (
          <PinDot key={i} filled={i < pin.length} color={colors.primary} />
        ))}
      </Animated.View>

      <View style={styles.grid}>
        {KEYS.map((key, idx) => (
          <PinKey
            key={idx}
            label={key}
            onPress={() => handleKey(key)}
            textColor={colors.text}
            bgColor={key ? colors.surface : "transparent"}
          />
        ))}
      </View>
    </View>
  );
}

function PinDot({ filled, color }: { filled: boolean; color: string }) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (filled) {
      scale.value = withSpring(1.2, { damping: 10, stiffness: 200 }, () => {
        scale.value = withSpring(1);
      });
    }
  }, [filled]);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View
      style={[
        aStyle,
        styles.dot,
        { backgroundColor: filled ? color : "transparent", borderColor: filled ? color : "#555" },
      ]}
    />
  );
}

function PinKey({ label, onPress, textColor, bgColor }: any) {
  const scale = useSharedValue(1);
  if (!label) return <View style={styles.keyBtn} />;
  return (
    <Animated.View style={[{ transform: [{ scale: scale.value }] }, styles.keyBtn]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.9, { damping: 10, stiffness: 300 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10, stiffness: 300 }); }}
        style={[styles.keyInner, { backgroundColor: bgColor }]}
      >
        {label === "del" ? (
          <TpIcon name="delete" size={22} color={textColor} strokeWidth={1.8} />
        ) : (
          <Text style={[styles.keyText, { color: textColor, fontFamily: "Inter_600SemiBold" }]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 32 },
  dots: { flexDirection: "row", gap: 16 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5 },
  grid: { flexDirection: "row", flexWrap: "wrap", width: 264, gap: 12, justifyContent: "center" },
  keyBtn: { width: 76, height: 76 },
  keyInner: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center" },
  keyText: { fontSize: 24 },
});
