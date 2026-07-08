import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useApp } from "@/context/AppContext";

const { width: SW, height: SH } = Dimensions.get("window");

export default function SplashScreen() {
  const { user, hasSession, isLoading } = useApp();

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const tagOpacity = useSharedValue(0);
  const tagTranslateY = useSharedValue(10);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoTranslateY.value = withTiming(0, { duration: 800 });
    tagOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    tagTranslateY.value = withDelay(600, withTiming(0, { duration: 600 }));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user && hasSession) {
        router.replace("/(auth)/pin-verify");
      } else if (user) {
        router.replace("/(auth)/auth-landing");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }, 2400);
    return () => clearTimeout(timer);
  }, [isLoading, user, hasSession]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: tagTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background swirl — natural size, left-anchored */}
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={styles.bgImage}
        resizeMode="contain"
      />

      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={styles.iconImg}
          resizeMode="contain"
        />
        <Text style={[styles.logoText, { fontFamily: "Inter_700Bold" }]}>TrustPoint</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, tagStyle, { fontFamily: "Inter_400Regular" }]}>
        Security Meets Modernity
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  bgImage: {
    position: "absolute",
    left: -SW * 0.12,
    top: SH * 0.1,
    width: SW * 0.9,
    height: SH * 0.7,
  },
  overlay: { backgroundColor: "rgba(0,0,0,0.52)" },
  logoContainer: { alignItems: "center", gap: 6 },
  iconImg: { width: 88, height: 88, marginBottom: 10 },
  logoText: { fontSize: 34, color: "#fff", letterSpacing: -1 },
  tagline: {
    position: "absolute",
    bottom: 80,
    fontSize: 13,
    color: "#ffffff44",
    letterSpacing: 2,
  },
});
