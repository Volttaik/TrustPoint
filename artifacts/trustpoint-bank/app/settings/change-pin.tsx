import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PinPad } from "@/components/ui/PinPad";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

type Step = "current" | "new" | "confirm";

const STEP_CONFIG: Record<Step, { title: string; subtitle: string }> = {
  current: { title: "Current PIN", subtitle: "Enter your current 4-digit PIN" },
  new: { title: "New PIN", subtitle: "Choose a new 4-digit PIN" },
  confirm: { title: "Confirm PIN", subtitle: "Re-enter your new PIN to confirm" },
};

export default function ChangePinScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("current");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const config = STEP_CONFIG[step];

  const handleKey = (key: string) => {
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        if (step === "current") {
          setStep("new");
          setPin("");
        } else if (step === "new") {
          setNewPin(next);
          setStep("confirm");
          setPin("");
        } else {
          if (next === newPin) {
            setSuccess(true);
          } else {
            setError(true);
            setTimeout(() => {
              setError(false);
              setPin("");
              setStep("new");
              setNewPin("");
            }, 900);
          }
        }
      }, 300);
    }
  };

  const stepIndex = step === "current" ? 0 : step === "new" ? 1 : 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => {
            if (step === "current") router.back();
            else if (step === "new") { setStep("current"); setPin(""); }
            else { setStep("new"); setPin(""); setNewPin(""); }
          }}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          Change PIN
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress */}
      <View style={styles.progress}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              {
                backgroundColor: i <= stepIndex ? colors.primary : colors.border,
                width: i === stepIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <View style={[styles.lockWrap, { backgroundColor: colors.primary + "18" }]}>
          <TpIcon name="lock" size={30} color={colors.primary} strokeWidth={1.8} />
        </View>

        <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          {config.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {config.subtitle}
        </Text>

        {error && (
          <Text style={[styles.errorText, { color: colors.destructive, fontFamily: "Inter_500Medium" }]}>
            PINs do not match. Try again.
          </Text>
        )}

        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={() => setPin((p) => p.slice(0, -1))}
          shake={error}
        />
      </View>

      <SuccessModal
        visible={success}
        title="PIN Changed!"
        subtitle="Your transaction PIN has been updated successfully."
        onDismiss={() => { setSuccess(false); router.back(); }}
        autoDismissMs={2000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, letterSpacing: -0.5 },
  progress: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 },
  progressDot: { height: 8, borderRadius: 4 },
  content: { flex: 1, alignItems: "center", gap: 20, paddingHorizontal: 20, paddingTop: 20 },
  lockWrap: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: "center" },
  errorText: { fontSize: 13 },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, paddingHorizontal: 40 },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  successTitle: { fontSize: 28, letterSpacing: -0.5 },
  successSub: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  doneBtn: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginTop: 8 },
  doneBtnText: { color: "#fff", fontSize: 16 },
});
