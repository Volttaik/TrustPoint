import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

// ── Inject autofill / focus suppression CSS once on web ──────────────────────
// Browsers apply an intrusive yellow/blue overlay when autofilling. This CSS
// forces the background to match the app's dark inputBackground (#161618) and
// keeps text readable. The `transition: background-color 5000s` trick delays
// the browser's own background animation long enough to be invisible.
if (Platform.OS === "web") {
  const STYLE_ID = "tp-input-global-styles";
  if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 200px #161618 inset !important;
        box-shadow:         0 0 0 200px #161618 inset !important;
        -webkit-text-fill-color: #F1FAEE !important;
        caret-color: #E11D33 !important;
        transition: background-color 5000s ease-in-out 0s;
      }
      input:focus { outline: none !important; box-shadow: none !important; }
      input:focus-visible { outline: none !important; }
    `;
    document.head.appendChild(el);
  }
}

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

  // Subtle border color on focus: translucent primary (muted red at 45% opacity)
  // Matches brand without harsh contrast against the dark background.
  const borderColor = focused ? colors.primary + "73" : "transparent";

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
            backgroundColor: colors.inputBackground,
            borderWidth: 1,
            borderColor,
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
    // Suppress browser's native focus ring and autofill styling at the element level
    outlineStyle: "none",
    outlineWidth: 0,
    outline: "none",
    // Prevent browser autofill background from flashing
    WebkitBoxShadow: "0 0 0 200px #161618 inset",
  } as any,
  prefix: { marginRight: 10 },
  suffix: { marginLeft: 10, padding: 4 },
  error: { fontSize: 12, marginTop: 4, marginLeft: 4 },
});
