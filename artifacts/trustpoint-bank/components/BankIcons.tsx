import React from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Line,
  Ellipse,
  G,
  Defs,
  ClipPath,
} from "react-native-svg";

const R = "#E11D33";
const W = "#FFFFFF";
const WD = "rgba(255,255,255,0.35)";

interface BankIconProps {
  size?: number;
  color?: string;
}

/* ─────────────────────────────────────────────
   TRANSFER — two offset horizontal arrows, red top / white bottom,
   with a thin vertical divider separating "accounts"
───────────────────────────────────────────── */
export function TransferIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* right-pointing arrow (red = outgoing) */}
      <Path
        d="M3 8.5H18"
        stroke={R}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M14 5l4 3.5-4 3.5"
        stroke={R}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* left-pointing arrow (white = incoming) */}
      <Path
        d="M21 15.5H6"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M10 12l-4 3.5 4 3.5"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   ADD MONEY / DEPOSIT — a wallet body with a flap open at the top
   and a bold downward arrow entering it
───────────────────────────────────────────── */
export function DepositIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* wallet body */}
      <Path
        d="M3 9.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* wallet flap / top edge */}
      <Path
        d="M1.5 9.5h21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* fold detail at top-left corner */}
      <Path
        d="M5 9.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
      />
      {/* coin slot */}
      <Rect x="10" y="13.5" width="4" height="2.5" rx="1.25" fill={R} />
      {/* downward arrow */}
      <Path
        d="M12 2v6M9.5 5.5L12 8l2.5-2.5"
        stroke={R}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   AIRTIME — classic handset silhouette with signal arcs
   emanating from the top-right corner
───────────────────────────────────────────── */
export function AirtimeIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* phone handset path */}
      <Path
        d="M6.6 2h4.6a1 1 0 0 1 .95.68l1.3 3.9a1 1 0 0 1-.28 1.06l-1.9 1.7a11.8 11.8 0 0 0 3.38 3.38l1.7-1.9a1 1 0 0 1 1.06-.28l3.9 1.3a1 1 0 0 1 .68.95V17.4A1.6 1.6 0 0 1 20.4 19C10.7 19 3 11.3 3 3.6A1.6 1.6 0 0 1 4.6 2z"
        stroke={color}
        strokeWidth="1.9"
        strokeLinejoin="round"
        fill="none"
      />
      {/* signal arc 1 (inner) */}
      <Path
        d="M15.5 4a3 3 0 0 1 2.5 2.5"
        stroke={R}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
      {/* signal arc 2 (outer) */}
      <Path
        d="M15.5 1.5a5.5 5.5 0 0 1 5 5"
        stroke={R}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
        strokeOpacity="0.5"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   DATA — precise WiFi / signal arcs with solid dot,
   plus a small "LTE" block for extra detail
───────────────────────────────────────────── */
export function DataIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* outer arc */}
      <Path
        d="M1.5 9.5a14.1 14.1 0 0 1 21 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.3"
        fill="none"
      />
      {/* middle arc */}
      <Path
        d="M5 13a10 10 0 0 1 14 0"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
        fill="none"
      />
      {/* inner arc — red, boldest */}
      <Path
        d="M8.5 16.5a5 5 0 0 1 7 0"
        stroke={R}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* signal dot */}
      <Circle cx="12" cy="20.5" r="2" fill={R} />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   BILLS — receipt with authentic zigzag torn bottom,
   two text lines and a bold red checkmark
───────────────────────────────────────────── */
export function BillsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* receipt body */}
      <Path
        d="M5 2h14v14.5l-1.4-1-1.6 1-1.6-1-1.6 1-1.6-1-1.6 1-1.6-1L5 16.5V2z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* text lines on receipt */}
      <Line
        x1="8.5"
        y1="6.5"
        x2="15.5"
        y2="6.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <Line
        x1="8.5"
        y1="9.5"
        x2="13"
        y2="9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
      {/* red checkmark */}
      <Path
        d="M8 13l2.5 2.5L16 10"
        stroke={R}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   CARDS — detailed credit card: body + EMV chip +
   horizontal stripe + contactless symbol
───────────────────────────────────────────── */
export function CardsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* card body */}
      <Rect
        x="1.5"
        y="5"
        width="21"
        height="14"
        rx="3"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* card stripe */}
      <Path
        d="M1.5 9.5h21"
        stroke={R}
        strokeWidth="3"
      />
      {/* EMV chip */}
      <Rect
        x="4"
        y="13"
        width="5"
        height="3.5"
        rx="1"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <Line x1="6.5" y1="13" x2="6.5" y2="16.5" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <Line x1="4" y1="14.75" x2="9" y2="14.75" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      {/* contactless payment arcs */}
      <Path d="M14 13.5a2.5 2.5 0 0 1 0 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <Path d="M16 12a5 5 0 0 1 0 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
      <Path d="M18 10.5a7.5 7.5 0 0 1 0 9" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none" strokeOpacity="0.3" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   SAVINGS — classic piggy bank silhouette:
   round body, ear, snout, coin slot, legs, tail, eye
───────────────────────────────────────────── */
export function SavingsIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* body */}
      <Ellipse
        cx="11"
        cy="13"
        rx="7.5"
        ry="6"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
      {/* snout / nose */}
      <Ellipse
        cx="17.5"
        cy="13"
        rx="2.5"
        ry="2"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />
      {/* nostril dots */}
      <Circle cx="17" cy="13" r="0.6" fill={color} />
      <Circle cx="18.5" cy="13" r="0.6" fill={color} />
      {/* ear */}
      <Path
        d="M7.5 7.5 C7 6 8.5 5 9.5 6L10.5 7.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* coin slot on top of body */}
      <Path
        d="M10 7.5h3"
        stroke={R}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* eye */}
      <Circle cx="9.5" cy="11" r="0.9" fill={color} />
      {/* front legs */}
      <Line x1="7" y1="18.5" x2="7" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Line x1="10" y1="18.8" x2="10" y2="21.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* back leg */}
      <Line x1="14" y1="18.8" x2="14" y2="21.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* tail */}
      <Path
        d="M3.5 11 C2 10 2 8 3.5 8.5 C2.5 9 2.5 11 3.5 11z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* coin going in */}
      <Circle cx="20.5" cy="7" r="2" stroke={R} strokeWidth="1.8" fill="none" />
      <Line x1="20.5" y1="9" x2="20.5" y2="7.5" stroke={R} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   MORE — 2×2 grid of rounded squares with top-right
   square in red to suggest "more options available"
───────────────────────────────────────────── */
export function MoreIcon({ size = 24, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* top-left */}
      <Rect x="2.5" y="2.5" width="8.5" height="8.5" rx="2.5" stroke={color} strokeWidth="2" fill="none" />
      {/* top-right (red, filled subtly) */}
      <Rect x="13" y="2.5" width="8.5" height="8.5" rx="2.5" stroke={R} strokeWidth="2" fill="rgba(225,29,51,0.15)" />
      {/* bottom-left (red, filled subtly) */}
      <Rect x="2.5" y="13" width="8.5" height="8.5" rx="2.5" stroke={R} strokeWidth="2" fill="rgba(225,29,51,0.15)" />
      {/* bottom-right */}
      <Rect x="13" y="13" width="8.5" height="8.5" rx="2.5" stroke={color} strokeWidth="2" fill="none" />
      {/* small dot in top-right square */}
      <Circle cx="17.25" cy="6.75" r="1.5" fill={R} />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   HEADER ICONS
───────────────────────────────────────────── */
export function QRIcon({ size = 20, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="2" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="4.5" y="4.5" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.85" />
      <Rect x="14" y="2" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="16.5" y="4.5" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.85" />
      <Rect x="2" y="14" width="8" height="8" rx="1.5" stroke={color} strokeWidth="1.8" fill="none" />
      <Rect x="4.5" y="16.5" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.85" />
      <Line x1="14" y1="14" x2="14" y2="18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="14" y1="20" x2="14" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="16" y1="14" x2="22" y2="14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="18" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="16" y1="20" x2="18" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="20" y1="20" x2="22" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function SupportIcon({ size = 20, color = W }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 13.5a9 9 0 0 1 18 0" stroke={color} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      <Rect x="2.5" y="13.5" width="5" height="7" rx="2.5" stroke={color} strokeWidth="1.9" fill="none" />
      <Rect x="16.5" y="13.5" width="5" height="7" rx="2.5" stroke={color} strokeWidth="1.9" fill="none" />
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
