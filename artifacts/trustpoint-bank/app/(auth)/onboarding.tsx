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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/onboard_security.png"),
    title: "Bank with\nZero Worries.",
    subtitle: "Your money is protected with military-grade encryption and biometric security.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboard_speed.png"),
    title: "Lightning Fast\nTransactions.",
    subtitle: "Send and receive money instantly to any bank in Nigeria and beyond.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboard_control.png"),
    title: "Complete\nControl.",
    subtitle: "Manage cards, savings, investments, and loans — all in one app.",
  },
];

export default function OnboardingScreen() {
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const btnScale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const goNext = () => {
    if (active < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: active + 1, animated: true });
    } else {
      router.replace("/(auth)/register");
    }
  };

  const skip = () => router.replace("/(auth)/register");

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Skip */}
      <TouchableOpacity onPress={skip} style={styles.skipBtn}>
        <Text style={styles.skipText}>Skip</Text>
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
            <Image source={item.image} style={styles.illustration} resizeMode="contain" />
            <View style={styles.textArea}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActive(idx);
        }}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === active ? "#E63946" : "#333",
                width: i === active ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.bottom}>
        <Button onPress={goNext} size="large" fullWidth>
          {active === SLIDES.length - 1 ? "Get Started" : "Next"}
        </Button>
        {active < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text style={styles.loginHint}>
              Already have an account?{" "}
              <Text style={{ color: "#E63946" }}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  skipBtn: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff11",
  },
  skipText: {
    color: "#ffffff88",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 32,
  },
  textArea: { alignItems: "center", gap: 12 },
  title: {
    fontSize: 38,
    color: "#F1FAEE",
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: { height: 6, borderRadius: 3 },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 16,
    alignItems: "center",
  },
  loginHint: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "Inter_400Regular",
  },
});
