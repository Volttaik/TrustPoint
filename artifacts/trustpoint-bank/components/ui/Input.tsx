import React, { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  secureToggle?: boolean;
}

export function Input({
  label,
  error,
  prefixIcon,
  suffixIcon,
  secureToggle,
  secureTextEntry,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...rest
}: InputProps) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry ?? false);

  const handleFocus = useCallback((e: any) => {
    setFocused(true);
    onFocusProp?.(e);
  }, [onFocusProp]);

  const handleBlur = useCallback((e: any) => {
    setFocused(false);
    onBlurProp?.(e);
  }, [onBlurProp]);

  const bg = focused
    ? colors.inputBackground === "#FFFFFF" ? "#EBEBED" : "#1E2022"
    : colors.inputBackground;

  return (
    <View style={{ width: "100%" }}>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: bg,
          },
        ]}
      >
        {prefixIcon && <View style={styles.prefix}>{prefixIcon}</View>}
        <TextInput
          {...rest}
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: "Inter_400Regular",
              flex: 1,
            },
          ]}
          placeholderTextColor={colors.placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secure}
        />
        {secureToggle && (
          <Pressable onPress={() => setSecure((v) => !v)} style={styles.suffix}>
            <TpIcon name={secure ? "eye-off" : "eye"} size={18} color={colors.mutedForeground} strokeWidth={1.8} />
          </Pressable>
        )}
        {suffixIcon && !secureToggle && <View style={styles.suffix}>{suffixIcon}</View>}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.destructive, fontFamily: "Inter_400Regular" }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, marginBottom: 6, marginLeft: 4 },
  container: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 15,
    letterSpacing: -0.2,
    outlineStyle: "none",
  } as any,
  prefix: { marginRight: 10 },
  suffix: { marginLeft: 10, padding: 4 },
  error: { fontSize: 12, marginTop: 4, marginLeft: 4 },
});
