import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
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
import { useApp } from "@/context/AppContext";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const { isAuthenticated, user, isLoading } = useApp();
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0.4);
  const tagOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withTiming(1, { duration: 800 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    tagOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    glowOpacity.value = withRepeat(
      withSequence(withTiming(0.8, { duration: 1200 }), withTiming(0.3, { duration: 1200 })),
      -1,
      true,
    );

    const timer = setTimeout(() => {
      if (isLoading) return;
      if (isAuthenticated) {
        router.replace("/(main)");
      } else if (user?.onboarded) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(auth)/onboarding");
      }
    }, 2800);
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

      {/* Red glow blob */}
      <Animated.View style={[styles.glow, glowStyle]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoT}>T</Text>
        </View>
        <Text style={styles.logoText}>TrustPoint</Text>
        <Text style={styles.logoSub}>BANK</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, tagStyle]}>
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
  overlay: { backgroundColor: "rgba(0,0,0,0.65)" },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#E63946",
    opacity: 0.12,
    top: "30%",
  },
  logoContainer: { alignItems: "center", gap: 8 },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 8,
  },
  logoT: {
    fontSize: 44,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
  },
  logoText: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 13,
    color: "#E63946",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 6,
  },
  tagline: {
    position: "absolute",
    bottom: 80,
    fontSize: 13,
    color: "#ffffff66",
    fontFamily: "Inter_400Regular",
    letterSpacing: 2,
  },
});
