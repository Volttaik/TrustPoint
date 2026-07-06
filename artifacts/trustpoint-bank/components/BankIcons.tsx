import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  G,
} from "react-native-svg";

const R = "#E11D33";
const W = "#FFFFFF";

interface BankIconProps {
  size?: number;
  color?: string;
}

/* ─────────────────────────────────────────────
   TRANSFER — two crisp, mitred directional arrows
   representing outbound (red) / inbound (white) funds,
   with a hard vertical divider marking the account split
───────────────────────────────────────────── */
export function TransferIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* outgoing arrow (red) — flat shaft, mitred arrowhead */}
      <Path
        d="M2.5 8H16.2"
        stroke={R}
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      <Path
        d="M13.2 3.8L17.6 8L13.2 12.2"
        stroke={R}
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* incoming arrow (white) */}
      <Path
        d="M21.5 16H7.8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="square"
      />
      <Path
        d="M10.8 20.2L6.4 16L10.8 11.8"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* center account divider tick */}
      <Line x1="12" y1="1.5" x2="12" y2="4.2" stroke={color} strokeWidth="1.6" strokeOpacity="0.45" />
      <Line x1="12" y1="19.8" x2="12" y2="22.5" stroke={color} strokeWidth="1.6" strokeOpacity="0.45" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   ADD MONEY / DEPOSIT — angular open tray with a
   sharp-edged banknote/coin dropping in, plus a bold
   plus-badge for "add" clarity
───────────────────────────────────────────── */
export function DepositIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* tray body — angular trapezoid, mitred */}
      <Path
        d="M3 13.5L5.4 20.5a1.4 1.4 0 0 0 1.32 1H17.28a1.4 1.4 0 0 0 1.32-1L21 13.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="miter"
        fill="none"
      />
      <Path
        d="M2.6 13.5H21.4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="square"
      />
      {/* tray inner shading line */}
      <Path d="M6.2 13.5L7.6 16.8H16.4L17.8 13.5" stroke={color} strokeWidth="1.2" strokeOpacity="0.35" fill="none" />
      {/* banknote falling in */}
      <Rect x="8.3" y="1.5" width="7.4" height="5" rx="0.8" stroke={R} strokeWidth="1.8" fill="none" />
      <Circle cx="12" cy="4" r="1.3" stroke={R} strokeWidth="1.3" fill="none" />
      <Line x1="12" y1="6.8" x2="12" y2="10.5" stroke={R} strokeWidth="2" strokeLinecap="square" />
      <Path d="M9.6 8.5L12 10.9L14.4 8.5" stroke={R} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   AIRTIME — angular handset built from straight
   segments (no soft blob silhouette), radiating signal
   bars in graduated weight for depth
───────────────────────────────────────────── */
export function AirtimeIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.4 3H11.6L13 6.6L10.6 8.6C11.6 10.6 13.2 12.2 15.2 13.2L17.2 10.8L20.8 12.2V15.4C20.8 16.6 19.8 17.5 18.6 17.4C11.7 16.8 6.1 11.2 5.4 4.3C5.3 3.1 6.2 2 7.4 2H8.4Z"
        stroke={color}
        strokeWidth="1.9"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* graduated signal bars, top-right */}
      <Line x1="16.4" y1="7.6" x2="16.4" y2="4.6" stroke={R} strokeWidth="1.9" strokeLinecap="square" />
      <Line x1="18.8" y1="7.6" x2="18.8" y2="3.4" stroke={R} strokeWidth="1.9" strokeLinecap="square" strokeOpacity="0.75" />
      <Line x1="21.2" y1="7.6" x2="21.2" y2="2.2" stroke={R} strokeWidth="1.9" strokeLinecap="square" strokeOpacity="0.5" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   DATA — concentric signal rings rebuilt as clean
   quarter-arcs on a fixed radius grid, solid dot base,
   plus an "LTE" chip badge for extra technical detail
───────────────────────────────────────────── */
export function DataIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="19.5" r="1.7" fill={R} />
      <Path d="M8 16.3a5.7 5.7 0 0 1 8 0" stroke={R} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <Path d="M4.6 12.9a10.6 10.6 0 0 1 14.8 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" fill="none" />
      <Path d="M1.2 9.5a15.5 15.5 0 0 1 21.6 0" stroke={color} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" fill="none" />
      {/* LTE chip badge, bottom-right, hard corners */}
      <Rect x="15.3" y="1.5" width="7.2" height="4.2" rx="0.6" stroke={color} strokeWidth="1.3" fill="none" strokeOpacity="0.7" />
      <Line x1="16.6" y1="3.6" x2="21.2" y2="3.6" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   BILLS — rectilinear receipt with a precise sawtooth
   hem (equal triangles, not soft scallops), ruled text
   lines and a mitred red checkmark stamp
───────────────────────────────────────────── */
export function BillsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 1.5H19V16L17.4 14.8L15.8 16L14.2 14.8L12.6 16L11 14.8L9.4 16L7.8 14.8L6.2 16L5 15V1.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="miter"
        fill="none"
      />
      <Line x1="7.4" y1="5.2" x2="16.6" y2="5.2" stroke={color} strokeWidth="1.6" strokeOpacity="0.55" />
      <Line x1="7.4" y1="8" x2="16.6" y2="8" stroke={color} strokeWidth="1.6" strokeOpacity="0.55" />
      <Line x1="7.4" y1="10.8" x2="12.5" y2="10.8" stroke={color} strokeWidth="1.6" strokeOpacity="0.3" />
      <Path
        d="M7.6 20L10.2 22.5L16.4 16.5"
        stroke={R}
        strokeWidth="2.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   CARDS — precision debit card: mitred body corners,
   full-bleed magnetic stripe, engraved EMV chip grid,
   graduated contactless waves, embossed number dots
───────────────────────────────────────────── */
export function CardsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="1.3" y="4.5" width="21.4" height="15" rx="2.2" stroke={color} strokeWidth="1.8" fill="none" />
      <Path d="M1.3 9H22.7" stroke={R} strokeWidth="2.6" strokeLinecap="square" />
      {/* EMV chip */}
      <Rect x="3.8" y="12.3" width="5.4" height="4" rx="0.7" stroke={color} strokeWidth="1.4" fill="none" />
      <Line x1="6.5" y1="12.3" x2="6.5" y2="16.3" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
      <Line x1="3.8" y1="14.3" x2="9.2" y2="14.3" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
      {/* embossed number dots */}
      <Circle cx="11.6" cy="16.7" r="0.65" fill={color} fillOpacity="0.5" />
      <Circle cx="13.5" cy="16.7" r="0.65" fill={color} fillOpacity="0.5" />
      <Circle cx="15.4" cy="16.7" r="0.65" fill={color} fillOpacity="0.5" />
      {/* contactless arcs, graduated */}
      <Path d="M14.8 12.6a2.3 2.3 0 0 1 0 3.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <Path d="M16.6 11.2a4.6 4.6 0 0 1 0 6.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
      <Path d="M18.4 9.8a7 7 0 0 1 0 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.3" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   SAVINGS — geometric coin stack + vault dial, replacing
   the soft piggy silhouette with hard-edged, aligned
   circles and a precise slot for a sharper "vault" read
───────────────────────────────────────────── */
export function SavingsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* coin stack, bottom-left */}
      <Rect x="1.5" y="15.5" width="9" height="3.4" rx="1.7" stroke={color} strokeWidth="1.6" fill="none" />
      <Rect x="1.5" y="12.2" width="9" height="3.4" rx="1.7" stroke={color} strokeWidth="1.6" fill="none" strokeOpacity="0.7" />
      <Rect x="1.5" y="8.9" width="9" height="3.4" rx="1.7" stroke={color} strokeWidth="1.6" fill="none" strokeOpacity="0.4" />
      <Line x1="6" y1="10.1" x2="6" y2="17.8" stroke={color} strokeWidth="1" strokeOpacity="0.3" />
      {/* vault / piggy body — precise circle, not a soft blob */}
      <Circle cx="17" cy="14" r="6.2" stroke={color} strokeWidth="1.9" fill="none" />
      <Circle cx="17" cy="14" r="3.1" stroke={R} strokeWidth="1.6" fill="none" />
      <Line x1="17" y1="10.9" x2="17" y2="12.2" stroke={R} strokeWidth="1.6" strokeLinecap="round" />
      <Line x1="17" y1="15.8" x2="17" y2="17.1" stroke={R} strokeWidth="1.6" strokeLinecap="round" />
      <Line x1="13.9" y1="14" x2="15.2" y2="14" stroke={R} strokeWidth="1.6" strokeLinecap="round" />
      <Line x1="18.8" y1="14" x2="20.1" y2="14" stroke={R} strokeWidth="1.6" strokeLinecap="round" />
      {/* coin slot on vault top edge */}
      <Line x1="15.4" y1="8.6" x2="18.6" y2="8.6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   MORE — 2×2 grid of true squares (hard corners) with
   a single red accent cell and an aligned center dot,
   crisper than the previous heavily-rounded tiles
───────────────────────────────────────────── */
export function MoreIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.9" fill="none" />
      <Rect x="13" y="2" width="9" height="9" rx="1.5" stroke={R} strokeWidth="1.9" fill="rgba(225,29,51,0.12)" />
      <Rect x="2" y="13" width="9" height="9" rx="1.5" stroke={R} strokeWidth="1.9" fill="rgba(225,29,51,0.12)" />
      <Rect x="13" y="13" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.9" fill="none" />
      <Circle cx="17.5" cy="6.5" r="1.3" fill={R} />
      <Circle cx="6.5" cy="17.5" r="1.3" fill={R} />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   HEADER ICONS
───────────────────────────────────────────── */
export function QRIcon({ size = 20, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="8" height="8" rx="1.2" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="4.5" y="4.5" width="3" height="3" fill={color} fillOpacity="0.85" />
      <Rect x="14" y="2" width="8" height="8" rx="1.2" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="16.5" y="4.5" width="3" height="3" fill={color} fillOpacity="0.85" />
      <Rect x="2" y="14" width="8" height="8" rx="1.2" stroke={color} strokeWidth="1.8" fill="none" />
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

export function SupportIcon({ size = 20, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 13.5a9 9 0 0 1 18 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <Rect x="2.5" y="13.5" width="5" height="7" rx="2" stroke={color} strokeWidth="1.9" fill="none" />
      <Rect x="16.5" y="13.5" width="5" height="7" rx="2" stroke={color} strokeWidth="1.9" fill="none" />
      <Path d="M21.5 20.5V22a1.5 1.5 0 0 1-1.5 1.5h-3" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
