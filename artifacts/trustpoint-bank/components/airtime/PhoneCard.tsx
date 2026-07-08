import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";
import { NetworkLogo } from "./NetworkLogo";
import { detectNetwork, NETWORKS, type NetworkId } from "./networkDetect";

interface Props {
  phone: string;
  onChangePhone: (v: string) => void;
  onSelfPress?: () => void;
  selfPhone?: string;
  onContactPress?: () => void;
}

export function PhoneCard({ phone, onChangePhone, onSelfPress, selfPhone, onContactPress }: Props) {
  const colors = useColors();
  const isDark = colors.background !== "#F4F5F7";

  const detectedId = phone.length >= 4 ? detectNetwork(phone) : null;
  const network = detectedId ? NETWORKS[detectedId] : null;

  const logoOpacity = useSharedValue(0);
  const logoScale   = useSharedValue(0.7);
  const prevId      = useRef<NetworkId | null>(null);

  useEffect(() => {
    if (detectedId !== prevId.current) {
      prevId.current = detectedId;
      if (detectedId) {
        logoOpacity.value = 0;
        logoScale.value   = 0.7;
        logoOpacity.value = withTiming(1, { duration: 200 });
        logoScale.value   = withSpring(1, { damping: 12, stiffness: 200 });
      } else {
        logoOpacity.value = withTiming(0, { duration: 150 });
        logoScale.value   = withTiming(0.7, { duration: 150 });
      }
    }
  }, [detectedId]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity:   logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  // Format display: 0801 234 5678
  const formatted = phone.replace(/\D/g, "").slice(0, 11);
  const display =
    formatted.length <= 4
      ? formatted
      : formatted.length <= 7
      ? `${formatted.slice(0, 4)} ${formatted.slice(4)}`
      : `${formatted.slice(0, 4)} ${formatted.slice(4, 7)} ${formatted.slice(7)}`;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Phone row */}
      <View style={styles.inputRow}>
        {/* Network logo / placeholder */}
        <View style={styles.logoSlot}>
          {detectedId ? (
            <Animated.View style={logoStyle}>
              <NetworkLogo id={detectedId} size={36} />
            </Animated.View>
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: isDark ? "#1A1A1A" : "#F0F0F0" }]}>
              <TpIcon name="smartphone" size={18} color={colors.mutedForeground} strokeWidth={1.6} />
            </View>
          )}
        </View>

        {/* Text input */}
        <TextInput
          value={display}
          onChangeText={(t) => onChangePhone(t.replace(/\D/g, "").slice(0, 11))}
          placeholder="0801 234 5678"
          placeholderTextColor={colors.placeholder}
          keyboardType="phone-pad"
          style={[
            styles.input,
            {
              color: colors.text,
              fontFamily: "Inter_600SemiBold",
            },
          ]}
          cursorColor={colors.primary}
          returnKeyType="done"
        />

        {/* Contact picker */}
        <TouchableOpacity
          onPress={onContactPress}
          style={[styles.contactBtn, { backgroundColor: isDark ? "#1A1A1A" : "#F0F0F0" }]}
        >
          <TpIcon name="users" size={18} color={colors.mutedForeground} strokeWidth={1.8} />
        </TouchableOpacity>
      </View>

      {/* Network label row */}
      {network && (
        <Animated.View style={[styles.networkRow, logoStyle]}>
          <View style={[styles.networkBadge, { backgroundColor: network.color + "18", borderColor: network.color + "33" }]}>
            <Text style={[styles.networkText, { color: network.color, fontFamily: "Inter_600SemiBold" }]}>
              {network.name}
            </Text>
          </View>
          <Text style={[styles.charCount, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {formatted.length}/11
          </Text>
        </Animated.View>
      )}

      {/* Buy for self */}
      {selfPhone && (
        <>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={({ pressed }) => [styles.selfRow, pressed && { opacity: 0.65 }]}
            onPress={onSelfPress}
          >
            <TpIcon name="user" size={14} color={colors.primary} strokeWidth={1.8} />
            <Text style={[styles.selfLabel, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>
              Buy For Self
            </Text>
            <Text style={[styles.selfPhone, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              · {selfPhone}
            </Text>
            <TpIcon name="chevron-right" size={14} color={colors.mutedForeground} strokeWidth={2.2} />
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  logoSlot: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 22,
    letterSpacing: 1,
    padding: 0,
  },
  contactBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  networkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  networkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  networkText: { fontSize: 12 },
  charCount:   { fontSize: 12 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  selfRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selfLabel: { fontSize: 13 },
  selfPhone: { flex: 1, fontSize: 13 },
});
