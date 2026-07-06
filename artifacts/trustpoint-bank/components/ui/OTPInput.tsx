import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  timerSeconds?: number;
  onResend?: () => void;
}

export function OTPInput({ length = 4, onComplete, timerSeconds = 45, onResend }: OTPInputProps) {
  const colors = useColors();
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(timerSeconds);
  const inputRef = useRef<TextInput>(null);
  const shakeAnim = useSharedValue(0);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (code.length === length) onComplete(code);
  }, [code, length]);

  const handleChange = useCallback((text: string) => {
    const filtered = text.replace(/[^0-9]/g, "").slice(0, length);
    setCode(filtered);
  }, [length]);

  const shake = () => {
    shakeAnim.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeAnim.value }] }));

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus
      />
      <Animated.View style={[styles.boxes, shakeStyle]}>
        {Array.from({ length }).map((_, i) => {
          const isFocused = i === code.length;
          const filled = i < code.length;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => inputRef.current?.focus()}
              style={[
                styles.box,
                {
                  backgroundColor: filled ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text style={[styles.boxText, { color: filled ? "#fff" : colors.text, fontFamily: "Inter_600SemiBold" }]}>
                {code[i] ?? ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
      <View style={styles.timerRow}>
        <Text style={[styles.timerText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {timer > 0 ? `Resend in ` : ""}
        </Text>
        {timer > 0 ? (
          <Text style={[styles.timerText, { color: timer < 10 ? colors.destructive : colors.primary, fontFamily: "Inter_600SemiBold" }]}>
            {timerStr}
          </Text>
        ) : (
          <TouchableOpacity onPress={() => { setTimer(timerSeconds); setCode(""); onResend?.(); }}>
            <Text style={[styles.timerText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 16 },
  hiddenInput: { position: "absolute", width: 0, height: 0, opacity: 0 },
  boxes: { flexDirection: "row", gap: 12 },
  box: {
    width: 56,
    height: 60,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  boxText: { fontSize: 22 },
  timerRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timerText: { fontSize: 14 },
});
