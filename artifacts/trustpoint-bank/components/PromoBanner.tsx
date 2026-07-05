import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TpIcon } from "@/components/TpIcon";

interface PromoBannerProps {
  onPress?: () => void;
}

export function PromoBanner({ onPress }: PromoBannerProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
      <LinearGradient
        colors={["#2B0F14", "#1A0709", "#100404"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View pointerEvents="none" style={styles.edgeHighlight} />
        <View style={styles.iconCircle}>
          <TpIcon name="gift" size={19} color="#F5F6F7" strokeWidth={2} />
        </View>
        <View style={styles.textGroup}>
          <Text style={styles.title}>Refer a friend, earn ₦5,000</Text>
          <Text style={styles.subtitle}>Share your code and get rewarded instantly</Text>
        </View>
        <TpIcon name="chevron-right" size={18} color="rgba(255,255,255,0.5)" strokeWidth={2.2} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(225,29,51,0.18)",
    shadowColor: "#E11D33",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  edgeHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(225,29,51,0.22)",
    borderWidth: 1,
    borderColor: "rgba(225,29,51,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: { flex: 1, gap: 2 },
  title: { fontSize: 14, color: "#F5F6F7", fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
  subtitle: { fontSize: 11.5, color: "rgba(255,255,255,0.5)", fontFamily: "Inter_400Regular" },
});
