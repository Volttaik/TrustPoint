import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";

const PRIMARY = "#E11D33";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { loginWithCredentials } = useApp();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const shakeX = useSharedValue(0);

  const shake = useCallback(() => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); } catch {}
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10,  { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10,  { duration: 50 }),
      withTiming(-6,  { duration: 40 }),
      withTiming(6,   { duration: 40 }),
      withTiming(0,   { duration: 40 }),
    );
  }, []);

  const handleLogin = useCallback(async () => {
    if (!identifier.trim()) { setError("Please enter your email or username."); shake(); return; }
    if (!password)           { setError("Please enter your password."); shake(); return; }

    setLoading(true);
    setError("");
    try {
      const ok = await loginWithCredentials(identifier.trim(), password);
      if (ok) {
        router.replace("/(auth)/pin-verify");
      } else {
        setError("Incorrect email/username or password. Please check and try again.");
        shake();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      shake();
    } finally {
      setLoading(false);
    }
  }, [identifier, password, loginWithCredentials, shake]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#0A0A0A" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 48 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.replace("/(auth)/auth-landing")}
        >
          <TpIcon name="arrow-left" size={20} color="#F1FAEE" />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoArea}>
          <Image
            source={require("@/assets/images/icon_transparent.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Heading */}
        <View style={styles.headingArea}>
          <Text style={[styles.heading, { fontFamily: "Inter_700Bold" }]}>Welcome back</Text>
          <Text style={[styles.subheading, { fontFamily: "Inter_400Regular" }]}>
            Sign in to continue to TrustPoint
          </Text>
        </View>

        {/* Form */}
        <Animated.View style={[styles.form, shakeStyle]}>
          <Input
            label="Email or Username"
            placeholder="Enter your email or username"
            value={identifier}
            onChangeText={(t) => { setIdentifier(t); setError(""); }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            prefixIcon={<TpIcon name="user" size={18} color="#555" strokeWidth={1.8} />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
            secureTextEntry
            secureToggle
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            prefixIcon={<TpIcon name="lock" size={18} color="#555" strokeWidth={1.8} />}
          />

          {error ? (
            <View style={styles.errorBox}>
              <TpIcon name="alert-circle" size={14} color={PRIMARY} />
              <Text style={[styles.errorText, { fontFamily: "Inter_400Regular" }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.forgotRow}
            onPress={() =>
              Alert.alert(
                "Forgot Password",
                "Please contact TrustPoint support to reset your password.",
                [{ text: "OK" }],
              )
            }
          >
            <Text style={[styles.forgotText, { fontFamily: "Inter_500Medium" }]}>Forgot password?</Text>
          </TouchableOpacity>

          <Button onPress={handleLogin} loading={loading} fullWidth size="large">
            Sign In
          </Button>
        </Animated.View>

        {/* Create account */}
        <View style={styles.registerRow}>
          <Text style={[styles.registerLabel, { fontFamily: "Inter_400Regular" }]}>
            New to TrustPoint?{"  "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/auth-landing")}>
            <Text style={{ fontSize: 14, color: PRIMARY, fontFamily: "Inter_600SemiBold" }}>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoArea: { alignItems: "center", marginBottom: 32 },
  logo: { width: 64, height: 64 },
  headingArea: { gap: 8, marginBottom: 40 },
  heading:    { fontSize: 34, color: "#F1FAEE", letterSpacing: -1 },
  subheading: { fontSize: 15, color: "#666", lineHeight: 22 },
  form: { gap: 20 },
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#E11D3315",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E11D3330",
  },
  errorText: { fontSize: 13, color: "#FF6B6B", flex: 1, lineHeight: 18 },
  forgotRow: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: { fontSize: 13, color: PRIMARY },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  registerLabel: { fontSize: 14, color: "#555" },
});
