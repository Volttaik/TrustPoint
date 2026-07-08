import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PinPad } from "@/components/ui/PinPad";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onSuccess: (pin: string) => void;
  onDismiss: () => void;
  validatePin: (pin: string) => Promise<boolean>;
}

export function PinSheet({ visible, title, subtitle, onSuccess, onDismiss, validatePin }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const bottomPad = insets.bottom + (Platform.OS === "web" ? 24 : 12);

  const handleKey = (key: string) => {
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) {
      setTimeout(async () => {
        const ok = await validatePin(next);
        if (ok) {
          setPin("");
          onSuccess(next);
        } else {
          setError(true);
          setTimeout(() => { setError(false); setPin(""); }, 800);
        }
      }, 300);
    }
  };

  const handleDelete = () => setPin((p) => p.slice(0, -1));

  const handleDismiss = () => {
    setPin("");
    setError(false);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss} />

      <View style={[styles.sheet, {
        backgroundColor: colors.surfaceElevated,
        borderColor: colors.border,
        paddingBottom: bottomPad,
      }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
          <TpIcon name="x" size={18} color={colors.mutedForeground} strokeWidth={2} />
        </TouchableOpacity>

        {/* Lock icon */}
        <View style={styles.iconWrap}>
          <TpIcon name="lock" size={40} color={colors.primary} strokeWidth={1.6} />
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
            {title ?? "Authorize Purchase"}
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
            {subtitle ?? "Enter your 4-digit PIN to confirm"}
          </Text>
        </View>

        {/* Error pill */}
        {error && (
          <View style={[styles.errorPill, {
            backgroundColor: colors.destructive + "18",
            borderColor: colors.destructive + "44",
          }]}>
            <TpIcon name="alert-circle" size={14} color={colors.destructive} strokeWidth={2} />
            <Text style={[styles.errorTxt, { color: colors.destructive, fontFamily: "Inter_500Medium" }]}>
              Incorrect PIN. Please try again.
            </Text>
          </View>
        )}

        <PinPad
          pin={pin}
          onKeyPress={handleKey}
          onDelete={handleDelete}
          shake={error}
        />

        <TouchableOpacity style={styles.forgotLink}>
          <Text style={[styles.forgotText, { color: colors.primary, fontFamily: "Inter_500Medium" }]}>
            Forgot PIN?
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 24,
    gap: 18,
    alignItems: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 6,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 18,
    padding: 6,
  },
  iconWrap: { marginTop: 8 },
  textBlock: { alignItems: "center", gap: 6 },
  title:    { fontSize: 20, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  errorPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  errorTxt:   { fontSize: 13 },
  forgotLink: { marginTop: 4, paddingBottom: 8 },
  forgotText: { fontSize: 14 },
});
