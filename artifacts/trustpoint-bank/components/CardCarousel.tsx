import React, { useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Card } from "@/context/AppContext";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 48;
const CARD_H = 190;

interface CardCarouselProps {
  cards: Card[];
  onCardPress?: (card: Card) => void;
  onFreezeCard?: (id: string) => void;
}

export function CardCarousel({ cards, onCardPress, onFreezeCard }: CardCarouselProps) {
  const colors = useColors();
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const renderCard = ({ item }: { item: Card }) => {
    const isVirtual = item.type === "virtual";
    const bg1 = isVirtual ? "#0A0A0A" : "#C62828";
    const bg2 = isVirtual ? "#1A1A1A" : "#E63946";
    const chipColor = isVirtual ? "#E63946" : "#0A0A0A";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onCardPress?.(item)}
        style={[styles.card, { width: CARD_W }]}
      >
        <View
          style={[
            styles.cardInner,
            {
              backgroundColor: bg1,
              borderColor: isVirtual ? "#333" : "#C62828",
              opacity: item.frozen ? 0.6 : 1,
            },
          ]}
        >
          {/* Gradient overlay */}
          <View
            style={[
              styles.cardGradient,
              { backgroundColor: bg2 + "44", borderRadius: 20 },
            ]}
          />

          {/* Top row */}
          <View style={styles.cardTop}>
            <Text style={[styles.bankName, { color: "#fff", fontFamily: "Inter_700Bold" }]}>
              TrustPoint
            </Text>
            <View style={styles.cardTopRight}>
              {item.frozen && (
                <View style={styles.frozenBadge}>
                  <Feather name="lock" size={10} color="#fff" />
                  <Text style={[styles.frozenText, { fontFamily: "Inter_500Medium" }]}>Frozen</Text>
                </View>
              )}
              <Text style={[styles.cardType, { color: "#ffffff88", fontFamily: "Inter_400Regular" }]}>
                {isVirtual ? "Virtual" : "Physical"}
              </Text>
            </View>
          </View>

          {/* Chip */}
          <View style={[styles.chip, { backgroundColor: chipColor }]}>
            <View style={styles.chipLines}>
              <View style={[styles.chipLine, { backgroundColor: isVirtual ? "#E63946" : "#000" }]} />
              <View style={[styles.chipLine, { backgroundColor: isVirtual ? "#E63946" : "#000" }]} />
              <View style={[styles.chipLine, { backgroundColor: isVirtual ? "#E63946" : "#000" }]} />
            </View>
          </View>

          {/* Card number */}
          <Text style={[styles.cardNumber, { color: "#ffffffcc", fontFamily: "Inter_500Medium" }]}>
            {item.number}
          </Text>

          {/* Bottom row */}
          <View style={styles.cardBottom}>
            <View>
              <Text style={[styles.cardLabel, { color: "#ffffff66", fontFamily: "Inter_400Regular" }]}>
                CARD HOLDER
              </Text>
              <Text style={[styles.cardValue, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
                {item.holder.toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={[styles.cardLabel, { color: "#ffffff66", fontFamily: "Inter_400Regular" }]}>
                EXPIRES
              </Text>
              <Text style={[styles.cardValue, { color: "#fff", fontFamily: "Inter_600SemiBold" }]}>
                {item.expiry}
              </Text>
            </View>
            <View style={styles.visaLogo}>
              <Text style={[styles.visaText, { fontFamily: "Inter_700Bold" }]}>VISA</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatRef}
        data={cards}
        keyExtractor={(c) => c.id}
        renderItem={renderCard}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W + 16}
        decelerationRate="fast"
        contentContainerStyle={{ gap: 16, paddingHorizontal: 0 }}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 16));
          setActive(idx);
        }}
        scrollEnabled={cards.length > 1}
      />
      {cards.length > 1 && (
        <View style={styles.dots}>
          {cards.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === active ? "#E63946" : "#555", width: i === active ? 20 : 6 },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: CARD_H },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 12,
    overflow: "hidden",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bankName: { fontSize: 16, letterSpacing: 0.5 },
  cardTopRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  frozenText: { fontSize: 10, color: "#fff" },
  cardType: { fontSize: 11 },
  chip: {
    width: 42,
    height: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  chipLines: { gap: 5 },
  chipLine: { width: 28, height: 1 },
  cardNumber: { fontSize: 16, letterSpacing: 2, marginTop: 4 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: { fontSize: 9, letterSpacing: 0.5, marginBottom: 2 },
  cardValue: { fontSize: 13 },
  visaLogo: { alignSelf: "flex-end" },
  visaText: { fontSize: 20, color: "#fff", letterSpacing: 1 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
});
