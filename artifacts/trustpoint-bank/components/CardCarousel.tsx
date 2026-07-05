import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";
import { Card } from "@/context/AppContext";

const GRADIENTS: Record<string, [string, string]> = {
  physical: ["#2A2C31", "#101114"],
  virtual: ["#3A1218", "#160607"],
  premium: ["#3B2C0F", "#141006"],
};

interface CardCarouselProps {
  cards: Card[];
  onCardPress?: (card: Card) => void;
  onFreezeCard?: (id: string) => void;
}

export function CardCarousel({ cards, onCardPress, onFreezeCard }: CardCarouselProps) {
  const colors = useColors();

  return (
    <View style={styles.stack}>
      {cards.slice(0, 2).map((item, idx) => {
        const gradient = GRADIENTS[item.type] ?? GRADIENTS.physical;
        const nickname = item.type === "virtual" ? "Virtual Card" : "Physical Card";
        const last4 = item.number.slice(-4);

        return (
          <Pressable
            key={item.id}
            onPress={() => onCardPress?.(item)}
            style={({ pressed }) => [
              styles.row,
              { opacity: pressed ? 0.92 : 1, marginTop: idx === 0 ? 0 : 12 },
            ]}
          >
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chip}
            >
              <View pointerEvents="none" style={styles.chipHighlight} />
              <TpIcon
                name="credit-card"
                size={18}
                color="rgba(255,255,255,0.85)"
                strokeWidth={2}
              />
            </LinearGradient>

            <View style={styles.info}>
              <View style={styles.infoTopRow}>
                <Text style={[styles.nickname, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
                  {nickname}
                </Text>
                {item.frozen && (
                  <View style={styles.frozenBadge}>
                    <TpIcon name="lock" size={9} color="#3E8BFF" strokeWidth={2.5} />
                    <Text style={styles.frozenText}>Frozen</Text>
                  </View>
                )}
              </View>
              <View style={styles.infoBottomRow}>
                <Text style={[styles.digits, { color: colors.mutedForeground, fontFamily: "Inter_500Medium" }]}>
                  •••• {last4}
                </Text>
                <View style={styles.dotSep} />
                <Text style={[styles.network, { fontFamily: "Inter_700Bold" }]}>
                  {item.type === "virtual" ? "Mastercard" : "VISA"}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => onFreezeCard?.(item.id)}
              hitSlop={8}
              style={[
                styles.manageBtn,
                { backgroundColor: colors.surfaceHigh, borderColor: colors.border },
              ]}
            >
              <TpIcon
                name={item.frozen ? "unlock" : "sliders"}
                size={15}
                color={colors.mutedForeground}
                strokeWidth={2}
              />
            </Pressable>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#131417",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  chip: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  chipHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  info: { flex: 1, gap: 4 },
  infoTopRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  nickname: { fontSize: 14.5, letterSpacing: -0.2 },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(62,139,255,0.12)",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  frozenText: { fontSize: 9.5, color: "#3E8BFF", fontFamily: "Inter_600SemiBold" },
  infoBottomRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  digits: { fontSize: 12.5, letterSpacing: 1, fontVariant: ["tabular-nums"] },
  dotSep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(255,255,255,0.2)" },
  network: { fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 0.4 },
  manageBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
