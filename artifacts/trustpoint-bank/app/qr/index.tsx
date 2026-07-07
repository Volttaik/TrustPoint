import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Rect, Path } from "react-native-svg";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TpIcon } from "@/components/TpIcon";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type Tab = "show" | "scan";

function QRCodeDisplay({ accountNumber, name, colors }: { accountNumber: string; name: string; colors: any }) {
  const cell = 8;
  const size = 29;
  const padding = 2;
  const seed = accountNumber.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const grid: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      if (r < 7 && c < 7) return true;
      if (r < 7 && c > size - 8) return true;
      if (r > size - 8 && c < 7) return true;
      if ((r < 7 && (c === 6 || c === 7)) || (c < 7 && (r === 6 || r === 7))) return false;
      return ((seed * (r + 1) * (c + 1) * 31337) % 17) < 8;
    })
  );

  const totalSize = size * cell + padding * 2;
  return (
    <View style={{ padding: 20, backgroundColor: "#fff", borderRadius: 16 }}>
      <Svg width={totalSize} height={totalSize}>
        {grid.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <Rect
                key={`${r}-${c}`}
                x={c * cell + padding}
                y={r * cell + padding}
                width={cell}
                height={cell}
                fill="#0A0A0A"
                rx={1}
              />
            ) : null
          )
        )}
      </Svg>
    </View>
  );
}

export default function QRScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useApp();
  const [tab, setTab] = useState<Tab>("show");
  const topPad = insets.top + (Platform.OS === "web" ? 67 : 0);
  const isDark = colors.background !== "#F4F5F7";

  const accountNumber = user?.accountNumber ?? "1000000001";
  const name = user?.name ?? "John Doe";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
        >
          <TpIcon name="arrow-left" size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>
          QR Payment
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
        {(["show", "scan"] as Tab[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && { backgroundColor: colors.primary }]}
          >
            <TpIcon
              name={t === "show" ? "qr-code" : "camera"}
              size={16}
              color={tab === t ? "#fff" : colors.mutedForeground}
              strokeWidth={1.8}
            />
            <Text style={[styles.tabText, { color: tab === t ? "#fff" : colors.mutedForeground, fontFamily: tab === t ? "Inter_600SemiBold" : "Inter_500Medium" }]}>
              {t === "show" ? "My QR Code" : "Scan QR"}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.content}>
        {tab === "show" ? (
          <View style={{ alignItems: "center", gap: 24 }}>
            <View style={[styles.qrCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <QRCodeDisplay accountNumber={accountNumber} name={name} colors={colors} />
              <Text style={[styles.qrName, { color: colors.text, fontFamily: "Inter_700Bold" }]}>
                {name}
              </Text>
              <Text style={[styles.qrAccount, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
                {accountNumber} · TrustPoint MFB
              </Text>
            </View>
            <Text style={[styles.qrHint, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Show this QR code to receive payment from anyone
            </Text>
            <View style={styles.actions}>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TpIcon name="share-2" size={20} color={colors.primary} strokeWidth={1.8} />
                <Text style={[styles.actionText, { color: colors.primary, fontFamily: "Inter_600SemiBold" }]}>Share</Text>
              </Pressable>
              <Pressable style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TpIcon name="copy" size={20} color={colors.text} strokeWidth={1.8} />
                <Text style={[styles.actionText, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}>Copy Link</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: "center", gap: 24 }}>
            <View style={[styles.scanFrame, { borderColor: colors.primary }]}>
              <View style={[styles.corner, styles.cornerTL, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.cornerTR, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.cornerBL, { borderColor: colors.primary }]} />
              <View style={[styles.corner, styles.cornerBR, { borderColor: colors.primary }]} />
              <TpIcon name="qr-code" size={80} color={colors.mutedForeground + "44"} strokeWidth={1} />
            </View>
            <Text style={[styles.scanHint, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
              Point your camera at a QR code to pay
            </Text>
            <Pressable style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
              <TpIcon name="camera" size={20} color="#fff" strokeWidth={1.8} />
              <Text style={[styles.cameraBtnText, { fontFamily: "Inter_600SemiBold" }]}>Open Camera</Text>
            </Pressable>
          </View>
        )}
      </View>
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
  tabs: { flexDirection: "row", marginHorizontal: 20, borderRadius: 14, padding: 4, marginBottom: 8 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingVertical: 10, borderRadius: 11 },
  tabText: { fontSize: 14 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  qrCard: { borderRadius: 24, borderWidth: 1, padding: 24, alignItems: "center", gap: 12 },
  qrName: { fontSize: 18, letterSpacing: -0.4 },
  qrAccount: { fontSize: 13 },
  qrHint: { fontSize: 13.5, textAlign: "center" },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 14, borderWidth: 1 },
  actionText: { fontSize: 14 },
  scanFrame: {
    width: 240,
    height: 240,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  corner: { position: "absolute", width: 28, height: 28, borderWidth: 3 },
  cornerTL: { top: 16, left: 16, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 6 },
  cornerTR: { top: 16, right: 16, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 6 },
  cornerBL: { bottom: 16, left: 16, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 16, right: 16, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 6 },
  scanHint: { fontSize: 14, textAlign: "center" },
  cameraBtn: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14 },
  cameraBtnText: { color: "#fff", fontSize: 15 },
});
