import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";

const PRIMARY = "#E11D33";

export default function AuthLandingScreen() {
  const insets = useSafeAreaInsets();

  const logoOpacity   = useSharedValue(0);
  const logoTranslate = useSharedValue(-16);
  const textOpacity   = useSharedValue(0);
  const textTranslate = useSharedValue(16);
  const iconsOpacity  = useSharedValue(0);
  const btnsOpacity   = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value   = withTiming(1, { duration: 560 });
    logoTranslate.value = withTiming(0, { duration: 560 });
    textOpacity.value   = withDelay(220, withTiming(1, { duration: 500 }));
    textTranslate.value = withDelay(220, withTiming(0, { duration: 500 }));
    iconsOpacity.value  = withDelay(380, withTiming(1, { duration: 520 }));
    btnsOpacity.value   = withDelay(500, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle  = useAnimatedStyle(() => ({ opacity: logoOpacity.value,  transform: [{ translateY: logoTranslate.value }] }));
  const textStyle  = useAnimatedStyle(() => ({ opacity: textOpacity.value,  transform: [{ translateY: textTranslate.value }] }));
  const iconsStyle = useAnimatedStyle(() => ({ opacity: iconsOpacity.value }));
  const btnsStyle  = useAnimatedStyle(() => ({ opacity: btnsOpacity.value }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Logo */}
      <Animated.View style={[styles.logoArea, logoStyle]}>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.brandName, { fontFamily: "Inter_700Bold" }]}>TrustPoint</Text>
        <Text style={[styles.brandSub, { fontFamily: "Inter_600SemiBold" }]}>BANK</Text>
      </Animated.View>

      {/* Heading */}
      <Animated.View style={[styles.headingArea, textStyle]}>
        <Text style={[styles.heading, { fontFamily: "Inter_700Bold" }]}>
          Your money,{"\n"}your control.
        </Text>
        <Text style={[styles.subheading, { fontFamily: "Inter_400Regular" }]}>
          Open a free account in minutes and experience banking built for modern Nigeria.
        </Text>
      </Animated.View>

      {/* Decorative icons row */}
      <Animated.View style={[styles.iconsRow, iconsStyle]}>
        <View style={styles.iconCard}>
          <Image source={require("@/assets/icons/financial_security.webp")} style={styles.iconImg} resizeMode="contain" />
          <Text style={[styles.iconLabel, { fontFamily: "Inter_500Medium" }]}>Secure</Text>
        </View>
        <View style={styles.iconCard}>
          <Image source={require("@/assets/icons/exchange_currency_rate.webp")} style={styles.iconImg} resizeMode="contain" />
          <Text style={[styles.iconLabel, { fontFamily: "Inter_500Medium" }]}>Fast</Text>
        </View>
        <View style={styles.iconCard}>
          <Image source={require("@/assets/icons/financial_goal.webp")} style={styles.iconImg} resizeMode="contain" />
          <Text style={[styles.iconLabel, { fontFamily: "Inter_500Medium" }]}>Smart</Text>
        </View>
        <View style={styles.iconCard}>
          <Image source={require("@/assets/icons/savings.webp")} style={styles.iconImg} resizeMode="contain" />
          <Text style={[styles.iconLabel, { fontFamily: "Inter_500Medium" }]}>Grow</Text>
        </View>
      </Animated.View>

      {/* Buttons */}
      <Animated.View style={[styles.btnArea, btnsStyle, { paddingBottom: insets.bottom + 32 }]}>
        <Button
          onPress={() => router.push("/(auth)/register")}
          size="large"
          fullWidth
        >
          Create Account
        </Button>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push("/(auth)/login")}
          activeOpacity={0.7}
        >
          <Text style={[styles.loginBtnText, { fontFamily: "Inter_600SemiBold" }]}>
            Sign In
          </Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { fontFamily: "Inter_400Regular" }]}>
          By continuing, you agree to our{" "}
          <Text style={{ color: PRIMARY }}>Terms of Service</Text> and{" "}
          <Text style={{ color: PRIMARY }}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingHorizontal: 24,
  },
  logoArea: {
    alignItems: "center",
    marginTop: 48,
    gap: 4,
  },
  logo: { width: 64, height: 64, marginBottom: 6 },
  brandName: { fontSize: 26, color: "#F1FAEE", letterSpacing: -0.8 },
  brandSub:  { fontSize: 11, color: PRIMARY, letterSpacing: 5 },

  headingArea: {
    marginTop: 40,
    gap: 14,
  },
  heading: {
    fontSize: 42,
    color: "#F1FAEE",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  subheading: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 24,
  },

  iconsRow: {
    flexDirection: "row",
    marginTop: 40,
    gap: 12,
  },
  iconCard: {
    flex: 1,
    backgroundColor: "#111111",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#1E1E1E",
  },
  iconImg: { width: 44, height: 44 },
  iconLabel: { fontSize: 11, color: "#666666" },

  btnArea: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 14,
  },
  loginBtn: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnText: {
    fontSize: 17,
    color: "#F1FAEE",
    letterSpacing: -0.3,
  },
  termsText: {
    fontSize: 12,
    color: "#444444",
    textAlign: "center",
    lineHeight: 18,
  },
});
