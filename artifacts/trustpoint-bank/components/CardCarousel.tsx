import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Card } from "@/context/AppContext";

interface CardCarouselProps {
  cards: Card[];
  onCardPress?: (card: Card) => void;
  onFreezeCard?: (id: string) => void;
}

export function CardCarousel({ cards, onCardPress }: CardCarouselProps) {
  return (
    <View style={styles.stack}>
      {cards
        .filter((item) => item.type === "virtual")
        .slice(0, 2)
        .map((item, idx) => (
          <Pressable
            key={item.id}
            onPress={() => onCardPress?.(item)}
            style={({ pressed }) => [
              styles.imageRow,
              { opacity: pressed ? 0.92 : 1, marginTop: idx === 0 ? 0 : 12 },
            ]}
          >
            <Image
              source={require("@/assets/images/trustpoint-card-transparent.png")}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </Pressable>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {},
  imageRow: {
    aspectRatio: 780 / 1000,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#E11D33",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 14,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
});
