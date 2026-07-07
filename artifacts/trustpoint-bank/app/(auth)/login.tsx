import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import Svg, { Path } from "react-native-svg";
import { PinPad } from "@/components/ui/PinPad";
import { TpSpinner } from "@/components/ui/TpSpinner";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type VerifyState = "idle" | "spinning" | "success" | "error";

export default function LoginScreen() {
  const { login, user } = useApp();
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const [pin,          setPin]          = useState("");
  const [error,        setError]        = useState(false);
  const [attempts,     setAttempts]     = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [verifyState,  setVerifyState]  = useState<VerifyState>("idle");
  const [displayPhone, setDisplayPhone] = useState("");

  /* ── Reanimated values ───────────────────────────────── */
  const cardScale   = useSharedValue(0.8);
  const resultScale = useSharedValue(0);

  const cardStyle   = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));
  const resultStyle = useAnimatedStyle(() => ({
    transform: [{ scale: resultScale.value }],
  }));

  useEffect(() => {
    AsyncStorage.getItem("@tp_last_phone").then((p) => {
      if (p) setDisplayPhone(p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"));
    });
  }, []);

  /* ── Spinner control ─────────────────────────────────── */
  const startSpinner = () => {
    resultScale.value = 0;
    cardScale.value   = 0.8;
    setVerifyState("spinning");
    cardScale.value   = withSpring(1, { damping: 14, stiffness: 200 });
  };

  const stopSpinnerSuccess = () => {
    setVerifyState("success");
    resultScale.value = withSpring(1, { damping: 11, stiffness: 220 });
  };

  const stopSpinnerError = () => {
    setVerifyState("error");
    resultScale.value = withSequence(
      withSpring(1.1, { damping: 8,  stiffness: 300 }),
      withSpring(1,   { damping: 12, stiffness: 200 }),
    );
    setTimeout(() => {
      cardScale.value = withTiming(0.8, { duration: 200 });
      setTimeout(() => setVerifyState("idle"), 220);
    }, 820);
  };

  /* ── PIN handling ────────────────────────────────────── */
  const handleKey = async (key: string) => {
    if (pin.length >= 4 || loading) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setLoading(true);
      startSpinner();
      await new Promise((r) => setTimeout(r, 400));
      const ok = await login(newPin);
      setLoading(false);
      if (ok) {
        stopSpinnerSuccess();
        await new Promise((r) => setTimeout(r, 900));
        router.replace("/(main)");
      } else {
        stopSpinnerError();
        setError(true);
        setAttempts((a) => a + 1);
        setTimeout(() => { setError(false); setPin(""); }, 700);
      }
    }
  };

  const displayName = user?.name?.split(" ")[0] ?? "there";
  const isVisible   = verifyState !== "idle";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={{ position: "absolute", top: 0, left: 0, width: winWidth, height: winHeight }}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {/* ── Brand header ─────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <Image
            source={require("@/assets/images/icon_transparent.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={[styles.headerTitle, { fontFamily: "Inter_700Bold" }]}>TrustPoint</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text style={[styles.headerLink, { fontFamily: "Inter_400Regular" }]}>
            Are you new?{"\n"}
            <Text style={{ color: "#E63946", fontFamily: "Inter_600SemiBold" }}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── User greeting ─────────────────────────────────── */}
      <View style={styles.top}>
        <Avatar initials={user?.initials ?? "?"} color={user?.avatarColor ?? "#E63946"} size={64} />
        <Text style={[styles.greeting, { fontFamily: "Inter_400Regular" }]}>Welcome back,</Text>
        <Text style={[styles.name,     { fontFamily: "Inter_700Bold" }]}>{displayName}</Text>
        {displayPhone ? (
          <Text style={[styles.phone, { fontFamily: "Inter_400Regular" }]}>{displayPhone}</Text>
        ) : null}
      </View>

      {/* ── PIN pad ───────────────────────────────────────── */}
      <View style={styles.padArea}>
        {error && !isVisible && (
          <Text style={[styles.errorText, { fontFamily: "Inter_500Medium" }]}>
            Incorrect PIN.{attempts < 3
              ? ` ${3 - attempts} attempt${3 - attempts === 1 ? "" : "s"} left.`
              : " Please try again."}
          </Text>
        )}
        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={() => { if (!loading) setPin((p) => p.slice(0, -1)); }}
          shake={error}
        />
      </View>

      {/* ── Footer ────────────────────────────────────────── */}
      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.linkTextSmall, { fontFamily: "Inter_400Regular" }]}>
            Forgot PIN?{" "}
            <Text style={{ color: "#E63946" }}>Reset</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* ══ Verify overlay modal ══════════════════════════ */}
      <Modal visible={isVisible} transparent animationType="none">
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />

        <View style={styles.modalBg} pointerEvents="none">
          <Animated.View style={[styles.verifyCard, cardStyle]}>

            {/* Spinning state — concentric ring spinner */}
            {verifyState === "spinning" && (
              <>
                <TpSpinner size="large" color="#E63946" />
                <Text style={[styles.verifyLabel, { fontFamily: "Inter_500Medium" }]}>
                  Verifying
                </Text>
              </>
            )}

            {/* Result state — success / error circle */}
            {(verifyState === "success" || verifyState === "error") && (
              <>
                <Animated.View style={[
                  styles.resultCircle,
                  { backgroundColor: verifyState === "success" ? "#1E9E5A" : "#E63946" },
                  resultStyle,
                ]}>
                  {verifyState === "success" ? (
                    <Svg width={58} height={58} viewBox="0 0 58 58" fill="none">
                      <Path
                        d="M11 29L23 43"
                        stroke="#fff" strokeWidth="5.5"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                      <Path
                        d="M23 43L47 16"
                        stroke="#fff" strokeWidth="5.5"
                        strokeLinecap="round" strokeLinejoin="round"
                      />
                    </Svg>
                  ) : (
                    <Svg width={58} height={58} viewBox="0 0 58 58" fill="none">
                      <Path
                        d="M16 16L42 42"
                        stroke="#fff" strokeWidth="5.5" strokeLinecap="round"
                      />
                      <Path
                        d="M42 16L16 42"
                        stroke="#fff" strokeWidth="5.5" strokeLinecap="round"
                      />
                    </Svg>
                  )}
                </Animated.View>
                <Text style={[styles.verifyLabel, { fontFamily: "Inter_500Medium" }]}>
                  {verifyState === "success" ? "Verified!" : "Incorrect PIN"}
                </Text>
              </>
            )}

          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  overlay:   { backgroundColor: "rgba(0,0,0,0.72)" },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 58,
    paddingHorizontal: 22,
  },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo:  { width: 34, height: 34 },
  headerTitle: { fontSize: 22, color: "#F1FAEE", letterSpacing: -0.5 },
  headerLink:  { fontSize: 11.5, color: "#8E8E93", textAlign: "right", lineHeight: 15 },

  top: { alignItems: "center", paddingTop: 28, paddingBottom: 20, gap: 5 },
  greeting: { fontSize: 12.5, color: "#8E8E93" },
  name:     { fontSize: 22,   color: "#F1FAEE", letterSpacing: -0.6 },
  phone:    { fontSize: 12,   color: "#8E8E93" },

  padArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: { fontSize: 12.5, color: "#E63946" },

  bottom: { paddingBottom: 40, alignItems: "center" },
  linkTextSmall: { fontSize: 12, color: "#6E6E73" },

  /* Modal */
  modalBg: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyCard: {
    alignItems: "center",
    gap: 30,
    minWidth: 200,
  },
  verifyLabel: {
    fontSize: 24,
    color: "#F1FAEE",
    letterSpacing: -0.2,
  },
  resultCircle: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: "center", justifyContent: "center",
  },
});
