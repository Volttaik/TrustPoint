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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";

const { width } = Dimensions.get("window");

const PRIMARY = "#E11D33";

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/onboard_security_transparent.png"),
    isWebp: false,
    title: "Bank with\nZero Worries.",
    subtitle: "Your money is protected with military-grade encryption and biometric security keeping you safe.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboard_speed_transparent.png"),
    isWebp: false,
    title: "Lightning Fast\nTransfers.",
    subtitle: "Send and receive money instantly to any bank in Nigeria and beyond. No delays, no stress.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboard_control_transparent.png"),
    isWebp: false,
    title: "Smart\nBanking.",
    subtitle: "Manage cards, savings, investments and loans — all in one seamless, intelligent app.",
  },
  {
    id: "4",
    image: require("@/assets/icons/financial_goal.webp"),
    isWebp: true,
    title: "Financial\nFreedom.",
    subtitle: "Achieve your financial goals with smart budgeting tools, savings plans, and investment insights.",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [active, setActive] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const dotScale = useSharedValue(1);

  const goNext = () => {
    if (active < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: active + 1, animated: true });
      setActive((a) => a + 1);
    } else {
      router.replace("/(auth)/auth-landing");
    }
  };

  const skip = () => router.replace("/(auth)/auth-landing");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
            <View style={styles.imageWrapper}>
              <Image
                source={item.image}
                style={item.isWebp ? styles.illustrationIcon : styles.illustration}
                resizeMode="contain"
              />
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
                backgroundColor: PRIMARY,
                width: i === active ? 24 : 8,
                opacity: i === active ? 1 : 0.3,
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 24 }]}>
        <Button onPress={goNext} size="large" fullWidth>
          {active === SLIDES.length - 1 ? "Get Started" : "Continue"}
        </Button>
        <TouchableOpacity onPress={() => router.replace("/(auth)/auth-landing")}>
          <Text style={[styles.loginHint, { fontFamily: "Inter_400Regular" }]}>
            Already have an account?{"  "}
            <Text style={{ color: PRIMARY, fontFamily: "Inter_600SemiBold" }}>Sign in</Text>
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
    backgroundColor: "#ffffff0D",
  },
  skipText: { color: "#ffffff88", fontSize: 14 },
  slide: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  imageWrapper: {
    width: width * 0.72,
    height: width * 0.72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 44,
  },
  illustration: { width: "100%", height: "100%" },
  illustrationIcon: { width: "70%", height: "70%" },
  textArea: { alignItems: "center", gap: 16, paddingHorizontal: 8 },
  title: {
    fontSize: 40,
    color: "#F1FAEE",
    textAlign: "center",
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 28,
  },
  dot: { height: 6, borderRadius: 3 },
  bottom: {
    paddingHorizontal: 24,
    gap: 20,
    alignItems: "center",
  },
  loginHint: { fontSize: 14, color: "#666666" },
});
