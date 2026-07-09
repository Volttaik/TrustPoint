import React from "react";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WHATSAPP_GREEN = "#25D366";

interface ShareAccountSheetProps {
  visible: boolean;
  onClose: () => void;
  accountName: string;
  accountNumber: string;
  bankName: string;
  onCopied?: () => void;
}

export function ShareAccountSheet({
  visible,
  onClose,
  accountName,
  accountNumber,
  bankName,
  onCopied,
}: ShareAccountSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const shareText = `Send money to:\nName: ${accountName}\nAccount Number: ${accountNumber}\nBank: ${bankName}`;

  async function copyAccount() {
    await Clipboard.setStringAsync(accountNumber);
    onCopied?.();
    onClose();
  }

  async function shareToWhatsApp() {
    const url = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else await Share.share({ message: shareText });
    onClose();
  }

  async function shareLink() {
    await Share.share({ message: shareText, title: "TrustPoint Account Details" });
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text style={[styles.sheetTitle, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
          Share via
        </Text>
        <Text style={[styles.sheetSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {accountName} · {accountNumber} · {bankName}
        </Text>

        <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />

        <SheetOption
          icon={<TpIcon name="send" size={20} color={WHATSAPP_GREEN} strokeWidth={1.8} />}
          iconBg={WHATSAPP_GREEN + "18"}
          label="WhatsApp"
          sublabel="Send account details on WhatsApp"
          onPress={shareToWhatsApp}
          colors={colors}
        />
        <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />
        <SheetOption
          icon={<TpIcon name="share-2" size={20} color={colors.primary} strokeWidth={1.8} />}
          iconBg={colors.primary + "18"}
          label="Share"
          sublabel="Share via any app on your device"
          onPress={shareLink}
          colors={colors}
        />
        <View style={[styles.sheetDivider, { backgroundColor: colors.border }]} />
        <SheetOption
          icon={<TpIcon name="copy" size={20} color={colors.text} strokeWidth={1.8} />}
          iconBg={colors.surface}
          label="Copy Account Number"
          sublabel={accountNumber}
          onPress={copyAccount}
          colors={colors}
        />

        <TouchableOpacity
          style={[styles.cancelBtn, { backgroundColor: colors.surface }]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={[styles.cancelTxt, { color: colors.mutedForeground, fontFamily: "Inter_600SemiBold" }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function SheetOption({
  icon, iconBg, label, sublabel, onPress, colors,
}: {
  icon: React.ReactNode; iconBg: string; label: string;
  sublabel: string; onPress: () => void; colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sheetOpt, pressed && { opacity: 0.65 }]}
    >
      <View style={[styles.optIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.optInfo}>
        <Text style={[styles.optLabel, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          {label}
        </Text>
        <Text style={[styles.optSub, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          {sublabel}
        </Text>
      </View>
      <TpIcon name="chevron-right" size={16} color={colors.mutedForeground} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1,
    paddingHorizontal: 20, paddingTop: 12, gap: 0,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    alignSelf: "center", marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, letterSpacing: -0.4, marginBottom: 4 },
  sheetSub: { fontSize: 13, marginBottom: 20 },
  sheetDivider: { height: StyleSheet.hairlineWidth },

  sheetOpt: {
    flexDirection: "row", alignItems: "center", gap: 14,
    paddingVertical: 16,
  },
  optIcon: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  optInfo: { flex: 1, gap: 3 },
  optLabel: { fontSize: 15 },
  optSub: { fontSize: 12.5 },

  cancelBtn: {
    marginTop: 16, borderRadius: 14,
    paddingVertical: 16, alignItems: "center",
  },
  cancelTxt: { fontSize: 15 },
});
