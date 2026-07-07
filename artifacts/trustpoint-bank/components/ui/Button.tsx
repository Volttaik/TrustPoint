import React, { useCallback } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { TpSpinner } from "@/components/ui/TpSpinner";
import { useColors } from "@/hooks/useColors";

interface ButtonProps {
  variant?:  "primary" | "secondary" | "ghost" | "destructive";
  size?:     "small" | "medium" | "large";
  loading?:  boolean;
  disabled?: boolean;
  onPress?:  () => void;
  children:  React.ReactNode;
  style?:    ViewStyle;
  fullWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  variant   = "primary",
  size      = "medium",
  loading   = false,
  disabled  = false,
  onPress,
  children,
  style,
  fullWidth = false,
}: ButtonProps) {
  const colors = useColors();
  const scale  = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn  = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 170 });
  }, []);
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 170 });
  }, []);
  const handlePress    = useCallback(() => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  }, [disabled, loading, onPress]);

  const getBackground = () => {
    if (variant === "primary")     return colors.primary;
    if (variant === "destructive") return colors.destructive;
    return "transparent";
  };

  const getBorderColor = () => {
    if (variant === "secondary") return colors.primary;
    return "transparent";
  };

  const getTextColor = () => {
    if (variant === "primary" || variant === "destructive") return "#FFFFFF";
    return colors.primary;
  };

  const getPadding = () => {
    if (size === "small") return { paddingVertical: 8,  paddingHorizontal: 16 };
    if (size === "large") return { paddingVertical: 16, paddingHorizontal: 32 };
    return { paddingVertical: 14, paddingHorizontal: 24 };
  };

  const getFontSize = () => {
    if (size === "small") return 13;
    if (size === "large") return 17;
    return 16;
  };

  /* Spinner colour matches button text colour */
  const spinnerColor = getTextColor();

  const s = StyleSheet.create({
    btn: {
      backgroundColor: getBackground(),
      borderRadius: 12,
      borderWidth:  variant === "secondary" ? 2 : 0,
      borderColor:  getBorderColor(),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      opacity:   disabled ? 0.5 : 1,
      alignSelf: fullWidth ? "stretch" : "auto",
      ...getPadding(),
      shadowColor:    variant === "primary" ? colors.primary : "#000",
      shadowOffset:   { width: 0, height: 4 },
      shadowOpacity:  variant === "primary" ? 0.3 : 0.1,
      shadowRadius:   8,
      elevation:      variant === "primary" ? 6 : 0,
    },
    text: {
      color:       getTextColor(),
      fontSize:    getFontSize(),
      fontFamily:  "Inter_600SemiBold",
      letterSpacing: -0.3,
    },
  });

  return (
    <AnimatedPressable
      style={[animatedStyle, s.btn, style]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      {loading ? (
        <TpSpinner size="small" color={spinnerColor} />
      ) : (
        <Text style={s.text}>{children}</Text>
      )}
    </AnimatedPressable>
  );
}
