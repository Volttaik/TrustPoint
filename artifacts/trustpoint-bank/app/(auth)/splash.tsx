import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { useApp } from "@/context/AppContext";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const { isAuthenticated, user, isLoading } = useApp();
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const tagOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 900 });
    logoOpacity.value = withTiming(1, { duration: 900 });
    tagOpacity.value = withDelay(700, withTiming(1, { duration: 600 }));
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.6, { duration: 1400 }), withTiming(0.2, { duration: 1400 })),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(main)");
      } else if (user?.onboarded) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }, 2600);
    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glowOpacity.value }));
  const tagStyle = useAnimatedStyle(() => ({ opacity: tagOpacity.value }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <Animated.View style={[styles.glow, glowStyle]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={styles.iconImg}
          resizeMode="contain"
        />
        <Text style={[styles.logoText, { fontFamily: "Inter_700Bold" }]}>TrustPoint</Text>
        <Text style={[styles.logoSub, { fontFamily: "Inter_600SemiBold" }]}>BANK</Text>
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
  overlay: { backgroundColor: "rgba(0,0,0,0.6)" },
  glow: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#E63946",
    opacity: 0.1,
  },
  logoContainer: { alignItems: "center", gap: 6 },
  iconImg: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 34,
    color: "#fff",
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 13,
    color: "#E63946",
    letterSpacing: 6,
  },
  tagline: {
    position: "absolute",
    bottom: 80,
    fontSize: 13,
    color: "#ffffff55",
    letterSpacing: 2,
  },
});
