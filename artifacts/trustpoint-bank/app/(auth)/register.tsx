import React, { useState } from "react";
import {
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
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { PinPad } from "@/components/ui/PinPad";
import { useApp } from "@/context/AppContext";

const STEPS = ["BVN", "OTP", "Profile", "PIN", "Success"];

export default function RegisterScreen() {
  const { registerUser } = useApp();
  const [step, setStep] = useState(0);
  const [bvn, setBvn] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"set" | "confirm">("set");
  const [pinError, setPinError] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = (step / (STEPS.length - 1)) * 100;

  const handleBVN = () => {
    if (bvn.length !== 11) {
      setBvnError("BVN must be 11 digits");
      return;
    }
    setBvnError("");
    setStep(1);
  };

  const handleOTP = (code: string) => {
    if (code.length === 4) setTimeout(() => setStep(2), 400);
  };

  const handleProfile = () => {
    if (!name.trim()) return;
    setStep(3);
  };

  const handlePin = (key: string) => {
    if (pinStep === "set") {
      const newPin = pin + key;
      setPin(newPin);
      if (newPin.length === 4) setTimeout(() => { setPinStep("confirm"); setPin(""); }, 300);
    } else {
      const newConfirm = confirmPin + key;
      setConfirmPin(newConfirm);
      if (newConfirm.length === 4) {
        setTimeout(() => {
          if (newConfirm !== (pin || "")) {
            setPinError(true);
            setConfirmPin("");
            setTimeout(() => setPinError(false), 1000);
          } else {
            setStep(4);
            setTimeout(() => finishRegister(newConfirm), 600);
          }
        }, 300);
      }
    }
  };

  const handlePinDelete = () => {
    if (pinStep === "set") setPin((p) => p.slice(0, -1));
    else setConfirmPin((p) => p.slice(0, -1));
  };

  const finishRegister = async (userPin: string) => {
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    await registerUser({
      name: name.trim() || "John Doe",
      email: email.trim() || "user@email.com",
      phone: phone.trim() || "08012345678",
      bvn,
      pin: userPin,
      initials,
      onboarded: true,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Verify your identity</Text>
            <Text style={styles.stepSub}>Enter your 11-digit Bank Verification Number</Text>
            <Input
              label="BVN"
              value={bvn}
              onChangeText={(t) => { setBvn(t.replace(/[^0-9]/g, "").slice(0, 11)); setBvnError(""); }}
              keyboardType="number-pad"
              placeholder="e.g. 12345678901"
              error={bvnError}
              maxLength={11}
              prefixIcon={<Feather name="shield" size={18} color="#8E8E93" />}
            />
            <Button onPress={handleBVN} fullWidth disabled={bvn.length !== 11}>
              Continue
            </Button>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Verify your phone</Text>
            <Text style={styles.stepSub}>We sent a 4-digit code to 080*****678</Text>
            <OTPInput length={4} onComplete={handleOTP} timerSeconds={45} onResend={() => {}} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Create your profile</Text>
            <Text style={styles.stepSub}>Tell us a bit about yourself</Text>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. John Doe"
              prefixIcon={<Feather name="user" size={18} color="#8E8E93" />}
            />
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. john@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              prefixIcon={<Feather name="mail" size={18} color="#8E8E93" />}
            />
            <Input
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. 08012345678"
              keyboardType="phone-pad"
              prefixIcon={<Feather name="phone" size={18} color="#8E8E93" />}
            />
            <Button onPress={handleProfile} fullWidth disabled={!name.trim()}>
              Continue
            </Button>
          </View>
        );
      case 3:
        return (
          <View style={styles.pinContent}>
            <Text style={styles.stepTitle}>
              {pinStep === "set" ? "Set your PIN" : "Confirm your PIN"}
            </Text>
            <Text style={styles.stepSub}>
              {pinStep === "set"
                ? "Create a 4-digit transaction PIN"
                : "Re-enter your PIN to confirm"}
            </Text>
            <PinPad
              pin={pinStep === "set" ? pin : confirmPin}
              onKeyPress={handlePin}
              onDelete={handlePinDelete}
              shake={pinError}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.successContent}>
            <View style={styles.checkCircle}>
              <Feather name="check" size={48} color="#fff" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome to TrustPoint.</Text>
            <Text style={styles.stepSub}>Your account has been created successfully.</Text>
            <Button onPress={() => router.replace("/(main)")} fullWidth size="large">
              Go to Dashboard
            </Button>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        {step > 0 && step < 4 && (
          <TouchableOpacity onPress={() => setStep((s) => Math.max(0, s - 1))} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color="#F1FAEE" />
          </TouchableOpacity>
        )}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Create Account</Text>
          {step < 4 && (
            <Text style={styles.headerStep}>Step {step + 1} of {STEPS.length - 1}</Text>
          )}
        </View>
      </View>

      {/* Progress bar */}
      {step < 4 && (
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: `${((step + 1) / (STEPS.length - 1)) * 100}%` },
            ]}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 18,
    color: "#F1FAEE",
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.5,
  },
  headerStep: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  progressBar: {
    height: 3,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: 3,
    backgroundColor: "#E63946",
    borderRadius: 2,
  },
  content: { padding: 24, paddingBottom: 48 },
  stepContent: { gap: 20 },
  pinContent: { alignItems: "center", gap: 24, paddingTop: 24 },
  successContent: { alignItems: "center", gap: 20, paddingTop: 40 },
  stepTitle: {
    fontSize: 28,
    color: "#F1FAEE",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  stepSub: {
    fontSize: 15,
    color: "#8E8E93",
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    marginBottom: 8,
  },
  welcomeTitle: {
    fontSize: 32,
    color: "#F1FAEE",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    textAlign: "center",
  },
});
