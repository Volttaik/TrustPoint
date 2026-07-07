/**
 * SuccessModal — reusable animated success overlay.
 *
 * Mirrors the visual language of the transfer success screen but as a
 * compact centered modal, not a full-screen route.  Auto-dismisses after
 * `autoDismissMs` (default 2 200 ms) and calls `onDismiss`.
 *
 * Props
 *   visible        — controls the modal
 *   title          — primary success message ("Payment Successful!")
 *   subtitle       — optional detail line ("₦1,000 to 08012345678")
 *   onDismiss      — called when the overlay auto-dismisses or user taps it
 *   autoDismissMs  — delay before auto-dismiss (default 2200)
 */
import React, { useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface SuccessModalProps {
  visible:        boolean;
  title:          string;
  subtitle?:      string;
  onDismiss?:     () => void;
  autoDismissMs?: number;
}

export function SuccessModal({
  visible,
  title,
  subtitle,
  onDismiss,
  autoDismissMs = 2200,
}: SuccessModalProps) {
  const colors = useColors();

  /* ── Animated values ─────────────────────────────────── */
  const backdropOp = useSharedValue(0);

  const cardScale   = useSharedValue(0.7);
  const cardOpacity = useSharedValue(0);

  const pulseScale   = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  const circleScale   = useSharedValue(0);
  const circleOpacity = useSharedValue(0);

  const iconScale = useSharedValue(0);

  const textOpacity    = useSharedValue(0);
  const textTranslateY = useSharedValue(10);

  useEffect(() => {
    if (!visible) return;

    /* Reset */
    backdropOp.value     = 0;
    cardScale.value      = 0.8;
    cardOpacity.value    = 0;
    pulseScale.value     = 1;
    pulseOpacity.value   = 0;
    circleScale.value    = 0;
    circleOpacity.value  = 0;
    iconScale.value      = 0;
    textOpacity.value    = 0;
    textTranslateY.value = 10;

    /* Backdrop */
    backdropOp.value = withTiming(1, { duration: 200 });

    /* Card entrance */
    cardOpacity.value = withTiming(1, { duration: 180 });
    cardScale.value   = withSpring(1, { damping: 16, stiffness: 220 });

    /* Pulse ring — flash & expand */
    pulseOpacity.value = withSequence(
      withTiming(0.5, { duration: 80 }),
      withDelay(80, withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }))
    );
    pulseScale.value = withTiming(1.9, {
      duration: 700,
      easing: Easing.out(Easing.quad),
    });

    /* Check circle */
    circleOpacity.value = withTiming(1, { duration: 200 });
    circleScale.value   = withSpring(1, { damping: 11, stiffness: 220 });

    /* Check icon */
    iconScale.value = withDelay(200, withSpring(1, { damping: 9, stiffness: 200 }));

    /* Text */
    textOpacity.value    = withDelay(380, withTiming(1,  { duration: 400 }));
    textTranslateY.value = withDelay(380, withSpring(0,  { damping: 20, stiffness: 160 }));

    /* Auto-dismiss */
    const t = setTimeout(() => {
      backdropOp.value  = withTiming(0, { duration: 220 });
      cardOpacity.value = withTiming(0, { duration: 220 });
      cardScale.value   = withTiming(0.88, { duration: 220 });
      setTimeout(() => onDismiss?.(), 240);
    }, autoDismissMs);

    return () => clearTimeout(t);
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdropOp.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity:   cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity:   pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));
  const circleStyle = useAnimatedStyle(() => ({
    opacity:   circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity:   textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      </Animated.View>

      {/* Centered card */}
      <View style={styles.centerer} pointerEvents="box-none">
        <Animated.View
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, cardStyle]}
        >
          {/* Success circle + pulse */}
          <View style={styles.circleWrap}>
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.pulseRing,
                { borderColor: colors.success },
                pulseStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.checkCircle,
                { backgroundColor: colors.success },
                circleStyle,
              ]}
            >
              <Animated.View style={iconStyle}>
                <TpIcon name="check" size={34} color="#fff" strokeWidth={2.5} />
              </Animated.View>
            </Animated.View>
          </View>

          {/* Text */}
          <Animated.View style={[styles.textWrap, textStyle]}>
            <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {subtitle}
              </Text>
            ) : null}
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const CIRCLE_SZ = 72;

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.70)",
  },
  centerer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  card: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 28,
    borderWidth: 1,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: "center",
    gap: 20,
  },

  /* Circle */
  circleWrap: {
    width: CIRCLE_SZ,
    height: CIRCLE_SZ,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    borderRadius: CIRCLE_SZ / 2,
    borderWidth: 2.5,
  },
  checkCircle: {
    width: CIRCLE_SZ,
    height: CIRCLE_SZ,
    borderRadius: CIRCLE_SZ / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Text */
  textWrap: { alignItems: "center", gap: 6 },
  title:    { fontSize: 20, letterSpacing: -0.5, textAlign: "center" },
  subtitle: { fontSize: 13.5, textAlign: "center", lineHeight: 20 },
});
