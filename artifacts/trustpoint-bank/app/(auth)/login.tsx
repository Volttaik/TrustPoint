import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { PinPad } from "@/components/ui/PinPad";
import { useApp } from "@/context/AppContext";

export default function LoginScreen() {
  const { login, user } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleKey = (key: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);
    if (newPin.length === 4) {
      setTimeout(() => {
        const success = login(newPin);
        if (success) {
          router.replace("/(main)");
        } else {
          setError(true);
          setAttempts((a) => a + 1);
          setTimeout(() => {
            setError(false);
            setPin("");
          }, 600);
        }
      }, 200);
    }
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));

  const displayName = user?.name?.split(" ")[0] ?? "there";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("@/assets/images/splash_bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={[StyleSheet.absoluteFill, styles.overlay]} />

      {/* Logo */}
      <View style={styles.top}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoT}>T</Text>
        </View>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.name}>{displayName}</Text>
      </View>

      {/* PIN Pad */}
      <View style={styles.padArea}>
        {error && (
          <Text style={styles.errorText}>Incorrect PIN. {3 - attempts} attempts left.</Text>
        )}
        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={handleDelete}
          shake={error}
        />
      </View>

      {/* Bottom links */}
      <View style={styles.bottom}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotText}>
            Forgot PIN? <Text style={{ color: "#E63946" }}>Reset</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(auth)/register")}>
          <Text style={styles.forgotText}>
            New user? <Text style={{ color: "#E63946" }}>Create account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  overlay: { backgroundColor: "rgba(0,0,0,0.75)" },
  top: {
    alignItems: "center",
    paddingTop: 100,
    paddingBottom: 40,
    gap: 8,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  logoT: {
    fontSize: 36,
    color: "#fff",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  greeting: {
    fontSize: 15,
    color: "#8E8E93",
    fontFamily: "Inter_400Regular",
  },
  name: {
    fontSize: 28,
    color: "#F1FAEE",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  padArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  errorText: {
    fontSize: 13,
    color: "#E63946",
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  bottom: {
    paddingBottom: 52,
    alignItems: "center",
    gap: 12,
  },
  forgotText: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "Inter_400Regular",
  },
});
