/**
 * BankLogo — renders a bank's logo at the requested size.
 *
 * • TrustPoint Bank  → TP icon image
 * • GTBank           → orange square with white GT mark (SVG-derived)
 * • UBA              → white bg with red V-arrows (SVG-derived)
 * • Opay             → teal square with PNG logo
 * • Access Bank      → red square with white A mark
 * • First Bank       → blue circle with FB
 * • Moniepoint       → blue square with M mark
 * • Stanbic IBTC     → blue square with SI mark
 * • PremiumTrust     → green square with PT mark
 * • All others       → brand-color circle with initials
 */

import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Rect, G } from "react-native-svg";
import { getBankInfo } from "@/constants/banks";

interface BankLogoProps {
  bankName?: string | null;
  size?: number;
  /** If true, forces a circular clip even on logos that use square backgrounds */
  circular?: boolean;
}

export function BankLogo({ bankName, size = 40, circular = true }: BankLogoProps) {
  const bank = getBankInfo(bankName);
  const r = circular ? size / 2 : size * 0.22;

  // ── TrustPoint Bank ───────────────────────────────────────────────
  if (bank.name === "TrustPoint Bank") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#E11D33" }]}>
        <Image
          source={require("@/assets/images/icon_transparent.png")}
          style={{ width: size * 0.75, height: size * 0.75 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // ── Opay (PNG logo) ───────────────────────────────────────────────
  if (bank.name === "Opay") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#09C99A", overflow: "hidden" }]}>
        <Image
          source={require("@/assets/images/opay-logo.png")}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // ── GTBank (Guaranty Trust Bank) ─────────────────────────────────
  if (bank.name === "GTBank") {
    const s = size;
    return (
      <Svg width={s} height={s} viewBox="0 0 581 588">
        {/* orange background square clipped to circle */}
        <Rect x="0" y="0" width="581" height="588" rx={circular ? 290 : 80} fill="#D94F00" />
        {/* white T mark (top right square) */}
        <Rect x="330" y="114" width="149" height="149" rx="6" fill="#fff" />
        {/* white letter marks */}
        <Path d="M150.5 338.75v14.6h25.67v77.24h17.7v-77.83h23.9v-14.6l-67.27.6zM137.28 356.85v-14.6c-14.2-6.42-30.53-8.36-47.25 0-27.42 12.26-28.4 72.97-.97 84.84 15.75 7.98 48.6 4.28 51.91-2.73V376.3h-32.66v12.65h14.38v25.3c-47.25 22.96-56-87.37 14.59-57.4zM246.56 388.17h16.91c14 .59 17.7 27.05-.58 26.85h-16.33v-26.85zm0-37.16h16.91c14 2.53 8.95 23.35-.58 23.93h-16.33v-23.93zm-17.5-14.2v93h46.47c23.72-8.56 24.7-45.33 0-49.23 22.75-2.52 23.92-44.36-15.36-44.36l-31.11.59zM311.11 362.88v13.81c12.44-3.5 39.47-13.23 36.94 7.4-23.72-1.56-39.86 2.72-42.58 17.5-4.47 31.92 29.75 35.03 44.14 19.27v7.59h16.33v-56.04c-4.08-18.1-31.1-20.43-54.83-9.53zm13.8 36c3.7-4.87 15.56-4.68 23.53-2.34v12.26c-13.02 14-34.02 7.59-23.52-9.93zM399.78 379.42c4.28-4.67 27.03-13.43 30.53 0v49.42h18.27V376.5c-3.89-21.8-24.7-25.69-49.97-10.9v-8.17h-17.3v71.8h18.27l.2-49.81z"
          fill="#fff" />
      </Svg>
    );
  }

  // ── UBA (United Bank for Africa) ─────────────────────────────────
  if (bank.name === "UBA") {
    const s = size;
    return (
      <Svg width={s} height={s} viewBox="0 0 500 500">
        <Rect width="500" height="500" rx={circular ? 250 : 70} fill="#fff" />
        {/* red V-arrows */}
        <Path d="M277.353 126.125C242.336 126.374 220.861 164.578 238.832 194.621L320.801 331.499L372.772 125.447L277.353 126.125Z" fill="#D42E12" />
        <Path d="M179.628 168.851L127.657 374.903L223.076 374.224C258.093 373.976 279.568 335.772 261.597 305.729L179.628 168.851Z" fill="#D42E12" />
      </Svg>
    );
  }

  // ── Access Bank ───────────────────────────────────────────────────
  if (bank.name === "Access Bank") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#CC0000" }]}>
        <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 60 60" fill="none">
          {/* Simplified A glyph */}
          <Path d="M30 5L5 55h10l5-12h20l5 12h10L30 5zm0 14l7 17H23l7-17z" fill="#fff" />
        </Svg>
      </View>
    );
  }

  // ── First Bank ───────────────────────────────────────────────────
  if (bank.name === "First Bank") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#00A0DC" }]}>
        <Text style={[styles.initText, { fontSize: size * 0.3, color: "#fff", fontFamily: "Inter_700Bold" }]}>1st</Text>
      </View>
    );
  }

  // ── Moniepoint ───────────────────────────────────────────────────
  if (bank.name === "Moniepoint") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#0357EE" }]}>
        <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 66 66" fill="none">
          {/* M letter shape */}
          <Path d="M8 52V14l14 20 13-20 13 20 13-20v38h-9V30l-4 8-13-18-13 18-4-8v22H8z" fill="#fff" />
        </Svg>
      </View>
    );
  }

  // ── Stanbic IBTC ─────────────────────────────────────────────────
  if (bank.name === "Stanbic IBTC") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#009BDE" }]}>
        <Text style={[styles.initText, { fontSize: size * 0.26, color: "#fff", fontFamily: "Inter_700Bold" }]}>SI</Text>
      </View>
    );
  }

  // ── PremiumTrust Bank ────────────────────────────────────────────
  if (bank.name === "PremiumTrust Bank") {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: "#006B3F" }]}>
        <Text style={[styles.initText, { fontSize: size * 0.26, color: "#fff", fontFamily: "Inter_700Bold" }]}>PT</Text>
      </View>
    );
  }

  // ── Generic fallback: brand-color circle with initials ────────────
  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: r, backgroundColor: bank.color }]}>
      <Text style={[styles.initText, { fontSize: size * 0.32, color: "#fff", fontFamily: "Inter_700Bold" }]}>
        {bank.initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initText: {
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
