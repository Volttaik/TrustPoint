import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";
import { Card } from "@/context/AppContext";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 48;
const CARD_H = 200;

const CARD_IMAGES: Record<string, any> = {
  physical: require("@/assets/images/card_physical_new.png"),
  virtual: require("@/assets/images/card_virtual_new.png"),
  premium: require("@/assets/images/card_premium.png"),
};

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
    const cardImage = CARD_IMAGES[item.type] ?? CARD_IMAGES.physical;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onCardPress?.(item)}
        style={[styles.card, { width: CARD_W }]}
      >
        <View style={[styles.cardInner, { opacity: item.frozen ? 0.65 : 1 }]}>
          {/* AI-generated card image as background */}
          <Image
            source={cardImage}
            style={styles.cardImage}
            resizeMode="cover"
          />

          {/* Text overlay — sits on top of image */}
          <View style={styles.overlay}>
            {/* Top row */}
            <View style={styles.cardTop}>
              <Text style={[styles.bankName, { fontFamily: "Inter_700Bold" }]}>TrustPoint</Text>
              <View style={styles.cardTopRight}>
                {item.frozen && (
                  <View style={styles.frozenBadge}>
                    <TpIcon name="lock" size={9} color="#fff" strokeWidth={2.5} />
                    <Text style={[styles.frozenText, { fontFamily: "Inter_500Medium" }]}>Frozen</Text>
                  </View>
                )}
                <Text style={[styles.cardType, { fontFamily: "Inter_400Regular" }]}>
                  {item.type === "virtual" ? "Virtual" : item.type === "premium" ? "Premium" : "Physical"}
                </Text>
              </View>
            </View>

            {/* Card number */}
            <Text style={[styles.cardNumber, { fontFamily: "Inter_500Medium" }]}>
              {item.number}
            </Text>

            {/* Bottom row */}
            <View style={styles.cardBottom}>
              <View>
                <Text style={[styles.cardLabel, { fontFamily: "Inter_400Regular" }]}>CARD HOLDER</Text>
                <Text style={[styles.cardValue, { fontFamily: "Inter_600SemiBold" }]}>
                  {item.holder.toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.cardLabel, { fontFamily: "Inter_400Regular" }]}>EXPIRES</Text>
                <Text style={[styles.cardValue, { fontFamily: "Inter_600SemiBold" }]}>{item.expiry}</Text>
              </View>
              <View style={styles.visaLogo}>
                <Text style={[styles.visaText, { fontFamily: "Inter_700Bold" }]}>VISA</Text>
              </View>
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
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    padding: 20,
    gap: 10,
    justifyContent: "space-between",
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bankName: { fontSize: 16, color: "#fff", letterSpacing: 0.5 },
  cardTopRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#00000033",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  frozenText: { fontSize: 10, color: "#fff" },
  cardType: { fontSize: 11, color: "#ffffff99" },
  cardNumber: { fontSize: 16, color: "#ffffffcc", letterSpacing: 2.5 },
  cardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardLabel: { fontSize: 9, color: "#ffffff66", letterSpacing: 0.5, marginBottom: 2 },
  cardValue: { fontSize: 13, color: "#fff" },
  visaLogo: { alignSelf: "flex-end" },
  visaText: { fontSize: 20, color: "#fff", letterSpacing: 1 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 12 },
  dot: { height: 6, borderRadius: 3 },
});
