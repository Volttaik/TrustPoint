import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PinPad } from "@/components/ui/PinPad";
import { useApp } from "@/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const { login, user } = useApp();
  const { width: winWidth, height: winHeight } = useWindowDimensions();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [displayPhone, setDisplayPhone] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("@tp_last_phone").then((p) => {
      if (p) setDisplayPhone(p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"));
    });
  }, []);

  const handleKey = async (key: string) => {
    if (pin.length >= 4 || loading) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setLoading(true);
      setTimeout(async () => {
        const success = await login(newPin);
        setLoading(false);
        if (success) {
          router.replace("/(main)");
        } else {
          setError(true);
          setAttempts((a) => a + 1);
          setTimeout(() => { setError(false); setPin(""); }, 700);
        }
      }, 300);
    }
  };

  const displayName = user?.name?.split(" ")[0] ?? "there";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={{ position: "absolute", top: 0, left: 0, width: winWidth, height: winHeight }}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      <View style={styles.top}>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={[styles.greeting, { fontFamily: "Inter_400Regular" }]}>Welcome back,</Text>
        <Text style={[styles.name, { fontFamily: "Inter_700Bold" }]}>{displayName}</Text>
        {displayPhone ? (
          <Text style={[styles.phone, { fontFamily: "Inter_400Regular" }]}>{displayPhone}</Text>
        ) : null}
      </View>

      <View style={styles.padArea}>
        {error && (
          <Text style={[styles.errorText, { fontFamily: "Inter_500Medium" }]}>
            Incorrect PIN.{attempts < 3 ? ` ${3 - attempts} attempt${3 - attempts === 1 ? "" : "s"} left.` : " Please try again."}
          </Text>
        )}
        {loading && (
          <Text style={[styles.verifyText, { fontFamily: "Inter_400Regular" }]}>Verifying…</Text>
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
          <Text style={[styles.linkText, { fontFamily: "Inter_400Regular" }]}>
            Forgot PIN? <Text style={{ color: "#E63946" }}>Reset</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text style={[styles.linkText, { fontFamily: "Inter_400Regular" }]}>
            New user? <Text style={{ color: "#E63946" }}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  overlay: { backgroundColor: "rgba(0,0,0,0.72)" },
  top: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 32,
    gap: 6,
  },
  icon: { width: 72, height: 72, marginBottom: 10 },
  greeting: { fontSize: 14, color: "#8E8E93" },
  name: { fontSize: 28, color: "#F1FAEE", letterSpacing: -1 },
  phone: { fontSize: 13, color: "#8E8E93" },
  padArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: { fontSize: 13, color: "#E63946" },
  verifyText: { fontSize: 13, color: "#8E8E93" },
  bottom: { paddingBottom: 52, alignItems: "center", gap: 14 },
  linkText: { fontSize: 14, color: "#8E8E93" },
});
