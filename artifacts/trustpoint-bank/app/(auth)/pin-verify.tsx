import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { PinPad } from "@/components/ui/PinPad";
import { TpIcon } from "@/components/TpIcon";

const PRIMARY = "#E11D33";
const PIN_LENGTH = 4;

export default function PinVerifyScreen() {
  const insets = useSafeAreaInsets();
  const { user, verifyPin, logout } = useApp();

  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const [attempts, setAttempts] = useState(0);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const shakeX = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const modalScale = useSharedValue(0.9);

  const handleKeyPress = useCallback((key: string) => {
    if (status === "checking" || status === "success") return;
    setPin((p) => (p.length < PIN_LENGTH ? p + key : p));
  }, [status]);

  const handleDelete = useCallback(() => {
    if (status === "checking" || status === "success") return;
    setPin((p) => p.slice(0, -1));
  }, [status]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) verifyNow();
  }, [pin]);

  const shake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
  };

  const verifyNow = async () => {
    setStatus("checking");
    await new Promise((r) => setTimeout(r, 400));
    const ok = await verifyPin(pin);
    if (ok) {
      setStatus("success");
      setTimeout(() => router.replace("/(main)"), 600);
    } else {
      shake();
      setAttempts((a) => a + 1);
      setStatus("error");
      setTimeout(() => {
        setPin("");
        setStatus("idle");
      }, 700);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setShowSignOutModal(false);
    router.replace("/(auth)/auth-landing");
  };

  const openSignOut = () => {
    setShowSignOutModal(true);
    overlayOpacity.value = withTiming(1, { duration: 220 });
    modalScale.value = withSpring(1, { damping: 18, stiffness: 220 });
  };

  const closeSignOut = () => {
    overlayOpacity.value = withTiming(0, { duration: 180 });
    modalScale.value = withTiming(0.92, { duration: 180 });
    setTimeout(() => setShowSignOutModal(false), 200);
  };

  const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }));
  const modalStyle   = useAnimatedStyle(() => ({ transform: [{ scale: modalScale.value }] }));
  const shakeStyle   = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const initials = user?.initials ?? "?";
  const avatarColor = user?.avatarColor ?? PRIMARY;

  const pinFillColor =
    status === "success" ? "#2FBE73" :
    status === "error"   ? PRIMARY :
    PRIMARY;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.signOutBtn} onPress={openSignOut}>
          <TpIcon name="log-out" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarArea}>
        {user?.profilePicture ? (
          <Image source={{ uri: user.profilePicture }} style={[styles.avatarImg, { borderColor: avatarColor + "44" }]} />
        ) : (
          <View style={[styles.avatarCircle, { backgroundColor: avatarColor + "22", borderColor: avatarColor + "44" }]}>
            <Text style={[styles.avatarInitials, { color: avatarColor, fontFamily: "Inter_700Bold" }]}>
              {initials}
            </Text>
          </View>
        )}
        <Text style={[styles.userName, { fontFamily: "Inter_600SemiBold" }]}>
          {user?.name ?? "Welcome back"}
        </Text>
        <Text style={[styles.userSub, { fontFamily: "Inter_400Regular" }]}>
          Enter your PIN to continue
        </Text>
      </View>

      {/* PIN dots */}
      <Animated.View style={[styles.dotsRow, shakeStyle]}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length;
          return (
            <View
              key={i}
              style={[
                styles.pinDot,
                {
                  backgroundColor: filled ? pinFillColor : "transparent",
                  borderColor: filled ? pinFillColor : "#2A2A2A",
                },
              ]}
            />
          );
        })}
      </Animated.View>

      {attempts > 0 && status === "idle" && (
        <Text style={[styles.attemptsText, { fontFamily: "Inter_400Regular" }]}>
          Incorrect PIN. {attempts >= 3 ? "Too many attempts — try again." : "Try again."}
        </Text>
      )}

      {/* PinPad */}
      <View style={styles.padContainer}>
        <PinPad
          pin={pin}
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          shake={false}
        />
      </View>

      {/* Forgot PIN */}
      <TouchableOpacity style={[styles.forgotBtn, { paddingBottom: insets.bottom + 28 }]} onPress={openSignOut}>
        <Text style={[styles.forgotText, { fontFamily: "Inter_400Regular" }]}>
          Forgot PIN?{" "}
          <Text style={{ color: PRIMARY, fontFamily: "Inter_600SemiBold" }}>Sign out</Text>
        </Text>
      </TouchableOpacity>

      {/* Sign out modal */}
      {showSignOutModal && (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]} />
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <View style={styles.modalOuter}>
              <Animated.View style={[styles.modal, modalStyle]}>
                <View style={[styles.modalIconWrap, { backgroundColor: PRIMARY + "22" }]}>
                  <TpIcon name="log-out" size={24} color={PRIMARY} />
                </View>
                <Text style={[styles.modalTitle, { fontFamily: "Inter_700Bold" }]}>Sign Out</Text>
                <Text style={[styles.modalDesc, { fontFamily: "Inter_400Regular" }]}>
                  You'll need to sign in again with your email and password.
                </Text>
                <TouchableOpacity style={[styles.modalPrimary, { backgroundColor: PRIMARY }]} onPress={handleSignOut}>
                  <Text style={[styles.modalPrimaryText, { fontFamily: "Inter_600SemiBold" }]}>Sign Out</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSecondary} onPress={closeSignOut}>
                  <Text style={[styles.modalSecondaryText, { fontFamily: "Inter_500Medium" }]}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signOutBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#111",
  },
  avatarArea: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 40,
    gap: 10,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    marginBottom: 4,
  },
  avatarInitials: { fontSize: 32 },
  userName: { fontSize: 22, color: "#F1FAEE", letterSpacing: -0.5 },
  userSub:  { fontSize: 14, color: "#555" },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 12,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  attemptsText: {
    textAlign: "center",
    color: "#E11D33",
    fontSize: 13,
    marginBottom: 8,
  },
  padContainer: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  forgotBtn: { alignItems: "center", paddingTop: 8 },
  forgotText: { fontSize: 14, color: "#555" },
  overlay: { backgroundColor: "rgba(0,0,0,0.84)" },
  modalOuter: { flex: 1, justifyContent: "flex-end", padding: 20 },
  modal: {
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
    borderColor: "#222222",
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: { fontSize: 22, color: "#F1FAEE", letterSpacing: -0.5 },
  modalDesc:  { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 22 },
  modalPrimary: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  modalPrimaryText: { fontSize: 16, color: "#fff" },
  modalSecondary: {
    width: "100%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSecondaryText: { fontSize: 15, color: "#666" },
});
