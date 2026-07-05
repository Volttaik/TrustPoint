import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/onboard_security_transparent.png"),
    title: "Bank with\nZero Worries.",
    subtitle: "Your money is protected with military-grade encryption and biometric security.",
    accent: "#E63946",
  },
  {
    id: "2",
    image: require("@/assets/images/onboard_speed_transparent.png"),
    title: "Lightning Fast\nTransfers.",
    subtitle: "Send and receive money instantly to any bank in Nigeria and beyond.",
    accent: "#34C759",
  },
  {
    id: "3",
    image: require("@/assets/images/onboard_control_transparent.png"),
    title: "Complete\nControl.",
    subtitle: "Manage cards, savings, investments, and loans — all in one seamless app.",
    accent: "#007AFF",
  },
];

export default function OnboardingScreen() {
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const goNext = () => {
    if (active < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: active + 1, animated: true });
      setActive((a) => a + 1);
    } else {
      router.replace("/(auth)/register");
    }
  };

  const skip = () => router.replace("/(auth)/register");
  const accent = SLIDES[active]?.accent ?? "#E63946";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity onPress={skip} style={styles.skipBtn}>
        <Text style={[styles.skipText, { fontFamily: "Inter_500Medium" }]}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={(s) => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.imageWrapper, { backgroundColor: item.accent + "12" }]}>
              <Image source={item.image} style={styles.illustration} resizeMode="contain" />
            </View>
            <View style={styles.textArea}>
              <Text style={[styles.title, { fontFamily: "Inter_700Bold" }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { fontFamily: "Inter_400Regular" }]}>{item.subtitle}</Text>
            </View>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActive(idx);
        }}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === active ? accent : "#333",
                width: i === active ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.bottom}>
        <Button onPress={goNext} size="large" fullWidth>
          {active === SLIDES.length - 1 ? "Get Started" : "Next"}
        </Button>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={[styles.loginHint, { fontFamily: "Inter_400Regular" }]}>
            Already have an account?{" "}
            <Text style={{ color: "#E63946" }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  skipBtn: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff10",
  },
  skipText: { color: "#ffffff77", fontSize: 14 },
  slide: { flex: 1, alignItems: "center", paddingTop: 80, paddingHorizontal: 24 },
  imageWrapper: {
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  illustration: { width: "80%", height: "80%" },
  textArea: { alignItems: "center", gap: 14 },
  title: {
    fontSize: 40,
    color: "#F1FAEE",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 24 },
  dot: { height: 6, borderRadius: 3 },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
    alignItems: "center",
  },
  loginHint: { fontSize: 14, color: "#8E8E93" },
});
