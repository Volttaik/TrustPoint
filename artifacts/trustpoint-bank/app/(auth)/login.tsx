import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { PinPad } from "@/components/ui/PinPad";
import { Avatar } from "@/components/Avatar";
import { useApp } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Circle, Defs, Path, RadialGradient, Stop } from "react-native-svg";

type VerifyState = "idle" | "spinning" | "success" | "error";

export default function LoginScreen() {
  const { login, user } = useApp();
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [displayPhone, setDisplayPhone] = useState("");

  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("@tp_last_phone").then((p) => {
      if (p) setDisplayPhone(p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"));
    });
  }, []);

  const startSpinner = () => {
    spinAnim.setValue(0);
    scaleAnim.setValue(0);
    checkAnim.setValue(0);
    setVerifyState("spinning");

    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 80 }).start();

    spinLoopRef.current = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoopRef.current.start();
  };

  const stopSpinnerSuccess = () => {
    spinLoopRef.current?.stop();
    setVerifyState("success");
    Animated.spring(checkAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 90 }).start();
  };

  const stopSpinnerError = () => {
    spinLoopRef.current?.stop();
    setVerifyState("error");
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(scaleAnim, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.in(Easing.ease) }).start(() => {
          setVerifyState("idle");
        });
      }, 700);
    });
  };

  const handleKey = async (key: string) => {
    if (pin.length >= 4 || loading) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setLoading(true);
      startSpinner();
      await new Promise((r) => setTimeout(r, 400));
      const success = await login(newPin);
      setLoading(false);
      if (success) {
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

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const isVisible = verifyState !== "idle";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={{ position: "absolute", top: 0, left: 0, width: winWidth, height: winHeight }}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

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

      <View style={styles.top}>
        <Avatar initials={user?.initials ?? "?"} color={user?.avatarColor ?? "#E63946"} size={64} />
        <Text style={[styles.greeting, { fontFamily: "Inter_400Regular" }]}>Welcome back,</Text>
        <Text style={[styles.name, { fontFamily: "Inter_700Bold" }]}>{displayName}</Text>
        {displayPhone ? (
          <Text style={[styles.phone, { fontFamily: "Inter_400Regular" }]}>{displayPhone}</Text>
        ) : null}
      </View>

      <View style={styles.padArea}>
        {error && !isVisible && (
          <Text style={[styles.errorText, { fontFamily: "Inter_500Medium" }]}>
            Incorrect PIN.{attempts < 3 ? ` ${3 - attempts} attempt${3 - attempts === 1 ? "" : "s"} left.` : " Please try again."}
          </Text>
        )}
        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={() => { if (!loading) setPin((p) => p.slice(0, -1)); }}
          shake={error}
        />
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.linkTextSmall, { fontFamily: "Inter_400Regular" }]}>
            Forgot PIN? <Text style={{ color: "#E63946" }}>Reset</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isVisible} transparent animationType="none">
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View style={styles.modalBg} pointerEvents="none">
          <Animated.View
            style={[
              styles.verifyCard,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            {verifyState === "spinning" && (
              <>
                <Animated.View style={{ transform: [{ rotate: spinRotate }] }}>
                  <Svg width={winWidth * 0.62} height={winWidth * 0.62} viewBox="0 0 112 112" fill="none">
                    <Defs>
                      <RadialGradient id="spinnerHead" cx="0.5" cy="0.5" r="0.5">
                        <Stop offset="0" stopColor="#FF7A85" />
                        <Stop offset="1" stopColor="#E63946" />
                      </RadialGradient>
                    </Defs>
                    <Path
                      d="M56 8a48 48 0 0 1 48 48"
                      stroke="#E63946"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </Svg>
                </Animated.View>
                <Text style={[styles.verifyLabel, { fontFamily: "Inter_500Medium" }]}>Login</Text>
              </>
            )}
            {(verifyState === "success" || verifyState === "error") && (
              <>
                <Animated.View style={[
                  styles.resultCircle,
                  {
                    backgroundColor: verifyState === "success" ? "#1E9E5A" : "#E63946",
                    transform: [{ scale: checkAnim }],
                  },
                ]}>
                  {verifyState === "success" ? (
                    <Svg width={58} height={58} viewBox="0 0 58 58" fill="none">
                      <Path
                        d="M11 29L23 43"
                        stroke="#fff"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M23 43L47 16"
                        stroke="#fff"
                        strokeWidth="5.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
  overlay: { backgroundColor: "rgba(0,0,0,0.72)" },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 58,
    paddingHorizontal: 22,
  },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: { width: 34, height: 34 },
  headerTitle: { fontSize: 22, color: "#F1FAEE", letterSpacing: -0.5 },
  headerLink: { fontSize: 11.5, color: "#8E8E93", textAlign: "right", lineHeight: 15 },
  top: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 20,
    gap: 5,
  },
  icon: { width: 72, height: 72, marginBottom: 10 },
  greeting: { fontSize: 12.5, color: "#8E8E93" },
  name: { fontSize: 22, color: "#F1FAEE", letterSpacing: -0.6 },
  phone: { fontSize: 12, color: "#8E8E93" },
  padArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: { fontSize: 12.5, color: "#E63946" },
  bottom: { paddingBottom: 40, alignItems: "center", gap: 10 },
  linkText: { fontSize: 14, color: "#8E8E93" },
  linkTextSmall: { fontSize: 12, color: "#6E6E73" },
  modalBg: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyCard: {
    backgroundColor: "transparent",
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
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
