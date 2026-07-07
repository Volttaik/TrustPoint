/**
 * BankIcons — now backed by the investment_funding_icons pack.
 * All exports keep their original names so every import site
 * across the app continues to work without changes.
 *
 * QRIcon is the only exception — it remains SVG because it is a
 * functional scanning UI glyph that must adapt its stroke color
 * to the current theme.  SupportIcon and BellIcon are image-based
 * and do NOT respond to the `color` prop (kept for API compat).
 */
import React from "react";
import { Image } from "react-native";
import Svg, { Rect, Line } from "react-native-svg";

interface BankIconProps {
  size?: number;
  /** Only honored by QRIcon. Image-backed icons ignore this prop. */
  color?: string;
}

function PackImg({ src, size }: { src: any; size: number }) {
  return (
    <Image
      source={src}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}

/* ── Quick-action / nav icons ─────────────────────────── */

export function TransferIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/investment_flow.webp")} size={size} />;
}

export function DepositIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/funding.webp")} size={size} />;
}

export function AirtimeIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/payment_info.webp")} size={size} />;
}

export function DataIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/it_investment.webp")} size={size} />;
}

export function BillsIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/financial_calculation.webp")} size={size} />;
}

export function CardsIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/business_card.webp")} size={size} />;
}

export function SavingsIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/savings.webp")} size={size} />;
}

export function MoreIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/portfolio.webp")} size={size} />;
}

export function OtherBanksIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/building_bank.webp")} size={size} />;
}

export function InternationalIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/global_stock_market.webp")} size={size} />;
}

export function ScheduleIcon({ size = 24 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/time_schedule.webp")} size={size} />;
}

/* ── Header icons ─────────────────────────────────────── */

/**
 * QRIcon — kept as SVG; color prop is fully honored so it adapts
 * to light/dark theme like every other UI glyph.
 */
export function QRIcon({ size = 20, color = "#fff" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2"  y="2"  width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="4.5" y="4.5" width="3" height="3" fill={color} fillOpacity="0.85" />
      <Rect x="14" y="2"  width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="16.5" y="4.5" width="3" height="3" fill={color} fillOpacity="0.85" />
      <Rect x="2"  y="14" width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="4.5" y="16.5" width="3" height="3" fill={color} fillOpacity="0.85" />
      <Line x1="14" y1="14" x2="14" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      <Line x1="14" y1="20" x2="14" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      <Line x1="16" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      <Line x1="18" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      <Line x1="16" y1="20" x2="18" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
      <Line x1="20" y1="20" x2="22" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="square" />
    </Svg>
  );
}

/** Image-backed — color prop is accepted for API compat but has no effect. */
export function SupportIcon({ size = 20 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/financial_literacy.webp")} size={size} />;
}

/** Image-backed — color prop is accepted for API compat but has no effect. */
export function BellIcon({ size = 20 }: BankIconProps) {
  return <PackImg src={require("@/assets/icons/stock_market_news.webp")} size={size} />;
}
