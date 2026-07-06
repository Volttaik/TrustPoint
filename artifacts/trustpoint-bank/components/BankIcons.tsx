import React, { useId } from "react";
import Svg, {
  Path,
  Rect,
  Circle,
  Ellipse,
  Line,
  Defs,
  G,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";

const R = "#E11D33";
const R_LIGHT = "#FF5D6C";
const R_DARK = "#8E0E1E";
const W = "#FFFFFF";
const BLK_LIGHT = "#3A3A3F";
const BLK_DARK = "#000000";
const RIM = "rgba(255,255,255,0.55)";

interface BankIconProps {
  size?: number;
  color?: string;
}

/* ─────────────────────────────────────────────
   TRANSFER — two solid extruded arrow chevrons.
   Neutral arrow is solid black with a light rim
   for definition against dark tiles; red arrow
   keeps its glossy red gradient.
───────────────────────────────────────────── */
export function TransferIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-red`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-blk`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
      </Defs>

      {/* outgoing arrow — solid extruded plate */}
      <Path
        d="M2.4 6.9H12.6L12.6 4.4L18.2 8L12.6 11.6L12.6 9.1H2.4Z"
        fill={`url(#${id}-red)`}
        stroke={R_DARK}
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
      <Path
        d="M3.2 7.3H12.2L13 8L12.2 8.7H3.2Z"
        fill={W}
        fillOpacity="0.28"
      />

      {/* incoming arrow — solid black plate with rim light */}
      <Path
        d="M21.6 15.1H11.4L11.4 12.6L5.8 16.2L11.4 19.8L11.4 17.3H21.6Z"
        fill={`url(#${id}-blk)`}
        stroke={RIM}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <Path
        d="M20.8 15.5H11.8L11 16.2L11.8 16.9H20.8Z"
        fill={W}
        fillOpacity="0.22"
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   ADD MONEY / DEPOSIT — solid black tray with an
   extruded red banknote dropping in
───────────────────────────────────────────── */
export function DepositIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-tray`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-note`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
      </Defs>

      {/* tray — solid extruded trapezoid with rim light */}
      <Path
        d="M2.6 13H21.4L18.7 20.7C18.5 21.3 17.9 21.7 17.3 21.7H6.7C6.1 21.7 5.5 21.3 5.3 20.7Z"
        fill={`url(#${id}-tray)`}
        stroke={RIM}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <Path d="M4.6 13H19.4L18.6 15.4H5.4Z" fill="rgba(255,255,255,0.1)" />
      <Path d="M3.4 13.7H20.6" stroke={W} strokeOpacity="0.3" strokeWidth="0.6" />

      {/* banknote — solid extruded rounded plate */}
      <Rect x="8" y="1.4" width="8" height="5.6" rx="1" fill={`url(#${id}-note)`} stroke={R_DARK} strokeWidth="0.4" />
      <Rect x="8.9" y="2.3" width="6.2" height="1" rx="0.5" fill={W} fillOpacity="0.3" />
      <Circle cx="12" cy="4.2" r="1.35" fill={W} fillOpacity="0.85" />
      <Circle cx="12" cy="4.2" r="0.6" fill={R_DARK} />

      {/* drop arrow — solid extruded chevron */}
      <Path
        d="M11 7.6H13V9.6L14.6 8.2L15.6 9.4L12 12.6L8.4 9.4L9.4 8.2L11 9.6Z"
        fill={`url(#${id}-note)`}
      />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   AIRTIME — solid black extruded handset body
   with a light rim, graduated red 3D signal bars
   kept clear of the silhouette
───────────────────────────────────────────── */
export function AirtimeIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
      </Defs>

      <G transform="translate(-1.5, 2.6)">
        <Path
          d="M8.2 2.4H10.6L11.7 5.4L9.7 7C10.7 9.5 12.6 11.4 15.1 12.4L16.7 10.4L19.7 11.5V13.9C19.7 15 18.8 15.8 17.7 15.7C11.2 15.1 6 9.9 5.4 3.4C5.3 2.3 6.1 1.4 7.2 1.4H8.2Z"
          fill={`url(#${id}-body)`}
          stroke={RIM}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <Path
          d="M8.4 3.1L9.3 5.2L8.1 6.2C8 6.6 8.1 7 8.4 7.3"
          stroke={W}
          strokeOpacity="0.4"
          strokeWidth="0.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* graduated 3D signal bars, clear of handset */}
        <Rect x="15.6" y="4.6" width="1.9" height="3.4" rx="0.5" fill={`url(#${id}-bar)`} />
        <Rect x="18.1" y="2.8" width="1.9" height="5.2" rx="0.5" fill={`url(#${id}-bar)`} opacity="0.78" />
        <Rect x="20.6" y="1" width="1.9" height="7" rx="0.5" fill={`url(#${id}-bar)`} opacity="0.55" />
        <Rect x="15.85" y="4.85" width="1.4" height="0.7" rx="0.35" fill={W} fillOpacity="0.35" />
      </G>
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   DATA — concentric solid rings built as filled
   annular sectors; inner ring red, outer rings
   solid black with rim light for depth
───────────────────────────────────────────── */
export function DataIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  const ring = (rOuter: number, rInner: number, opacity: number, fillId: string) => {
    const cx = 12;
    const cy = 19.5;
    const a0 = Math.PI * 1.28;
    const a1 = Math.PI * 1.72;
    const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [ox0, oy0] = p(rOuter, a0);
    const [ox1, oy1] = p(rOuter, a1);
    const [ix1, iy1] = p(rInner, a1);
    const [ix0, iy0] = p(rInner, a0);
    return (
      <Path
        d={`M${ox0} ${oy0} A${rOuter} ${rOuter} 0 0 1 ${ox1} ${oy1} L${ix1} ${iy1} A${rInner} ${rInner} 0 0 0 ${ix0} ${iy0} Z`}
        fill={fillId}
        opacity={opacity}
      />
    );
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <RadialGradient id={`${id}-dot`} cx="0.35" cy="0.3" r="0.8">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </RadialGradient>
        <LinearGradient id={`${id}-ring1`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-ring2`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
      </Defs>

      <G transform="translate(0, -2.2)">
        <Circle cx="12" cy="19.5" r="2" fill={`url(#${id}-dot)`} />
        <Circle cx="11.3" cy="18.8" r="0.6" fill={W} fillOpacity="0.5" />

        {ring(7.2, 5.4, 1, `url(#${id}-ring1)`)}
        {ring(11.4, 9.6, 1, `url(#${id}-ring2)`)}
        {ring(15.6, 13.8, 1, `url(#${id}-ring2)`)}
      </G>
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   BILLS — solid black extruded receipt slip with
   an embossed sawtooth hem and a light rim; the
   checkmark lives in its own red badge, clear of
   the paper's edge
───────────────────────────────────────────── */
export function BillsIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-paper`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-stamp`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
      </Defs>

      <G transform="translate(-1.75, 3.5)">
        <Path
          d="M4.6 1.2H17.4V13.6L16 12.5L14.6 13.6L13.2 12.5L11.8 13.6L10.4 12.5L9 13.6L7.6 12.5L6.2 13.6L4.6 12.4Z"
          fill={`url(#${id}-paper)`}
          stroke={RIM}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <Rect x="6.4" y="3.4" width="9.2" height="1" rx="0.5" fill="rgba(255,255,255,0.22)" />
        <Rect x="6.4" y="5.7" width="9.2" height="1" rx="0.5" fill="rgba(255,255,255,0.22)" />
        <Rect x="6.4" y="8" width="6.2" height="1" rx="0.5" fill="rgba(255,255,255,0.14)" />
        <Rect x="6.4" y="1.9" width="9.2" height="0.8" rx="0.4" fill={W} fillOpacity="0.3" />

        {/* checkmark badge — top-right corner of the paper */}
        <Circle cx="17.5" cy="4.2" r="4.5" fill={`url(#${id}-stamp)`} stroke={R_DARK} strokeWidth="0.4" />
        <Path d="M14.8 3.8L15.4 5.8C15.7 6.1 16.1 6.1 16.4 5.8" stroke={W} strokeOpacity="0.28" strokeWidth="0.5" fill="none" />
        <Path
          d="M14.9 4.4L16.7 6.2L20.2 2.1"
          stroke={W}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   CARDS — solid black extruded debit card with a
   rim light, gold-gradient chip, and contactless
   arcs sized to stay fully inside the card body
───────────────────────────────────────────── */
export function CardsIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-card`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-chip`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F5D785" />
          <Stop offset="1" stopColor="#B4862F" />
        </LinearGradient>
      </Defs>

      <Rect x="1.3" y="4.3" width="21.4" height="15.4" rx="2.4" fill={`url(#${id}-card)`} stroke={RIM} strokeWidth="0.7" />
      <Rect x="1.3" y="8" width="21.4" height="2.6" fill="rgba(255,255,255,0.16)" />
      <Rect x="1.6" y="4.7" width="20.8" height="1.1" rx="0.55" fill={W} fillOpacity="0.28" />

      {/* EMV chip — solid gold plate */}
      <Rect x="3.6" y="12.1" width="5.4" height="4.2" rx="0.8" fill={`url(#${id}-chip)`} stroke="#8A6323" strokeWidth="0.3" />
      <Line x1="6.3" y1="12.1" x2="6.3" y2="16.3" stroke="#8A6323" strokeWidth="0.4" strokeOpacity="0.6" />
      <Line x1="3.6" y1="14.2" x2="9" y2="14.2" stroke="#8A6323" strokeWidth="0.4" strokeOpacity="0.6" />

      {/* embossed number dots */}
      <Circle cx="11.6" cy="16.6" r="0.65" fill={W} fillOpacity="0.6" />
      <Circle cx="13.5" cy="16.6" r="0.65" fill={W} fillOpacity="0.6" />
      <Circle cx="15.4" cy="16.6" r="0.65" fill={W} fillOpacity="0.6" />

      {/* contactless arcs — sized to stay within card bounds */}
      <Path d="M15.6 12.9a2 2 0 0 1 0 3" stroke={W} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <Path d="M17.1 11.7a4 4 0 0 1 0 5.4" stroke={W} strokeWidth="1.4" strokeLinecap="round" fill="none" strokeOpacity="0.65" />
      <Path d="M18.6 10.5a6 6 0 0 1 0 7.8" stroke={W} strokeWidth="1.4" strokeLinecap="round" fill="none" strokeOpacity="0.35" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   SAVINGS — solid black extruded coin stack with
   rim light, beside a red sphere-shaded vault dial
───────────────────────────────────────────── */
export function SavingsIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  const coin = (y: number, opacity: number) => (
    <>
      <Rect x="1.4" y={y} width="8" height="3.2" rx="1.6" fill={`url(#${id}-coin)`} opacity={opacity} stroke={RIM} strokeWidth="0.4" />
      <Rect x="2.2" y={y + 0.4} width="6.4" height="0.8" rx="0.4" fill={W} fillOpacity={0.3 * opacity} />
    </>
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-coin`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <RadialGradient id={`${id}-vault`} cx="0.35" cy="0.3" r="0.85">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </RadialGradient>
      </Defs>

      <G transform="translate(0, -1.4)">
        {coin(16.2, 0.62)}
        {coin(13, 0.8)}
        {coin(9.8, 1)}

        {/* vault sphere — radial gradient for true ball-like 3D */}
        <Circle cx="17.7" cy="14" r="5.8" fill={`url(#${id}-vault)`} stroke={R_DARK} strokeWidth="0.4" />
        <Ellipse cx="16" cy="11.4" rx="2.1" ry="1.3" fill={W} fillOpacity="0.25" />
        <Circle cx="17.7" cy="14" r="2.9" fill="none" stroke={W} strokeOpacity="0.75" strokeWidth="1.3" />
        <Line x1="17.7" y1="11.4" x2="17.7" y2="12.5" stroke={W} strokeWidth="1.3" strokeLinecap="round" />
        <Line x1="17.7" y1="15.5" x2="17.7" y2="16.6" stroke={W} strokeWidth="1.3" strokeLinecap="round" />
        <Line x1="15.1" y1="14" x2="16.2" y2="14" stroke={W} strokeWidth="1.3" strokeLinecap="round" />
        <Line x1="19.2" y1="14" x2="20.3" y2="14" stroke={W} strokeWidth="1.3" strokeLinecap="round" />
      </G>
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   MORE — 2×2 grid of solid extruded tiles; black
   tiles carry a light rim, red tiles pop forward
   via a brighter gradient
───────────────────────────────────────────── */
export function MoreIcon({ size = 24 }: BankIconProps) {
  const id = useId();
  const tile = (x: number, y: number, fillId: string, stroke: string) => (
    <>
      <Rect x={x} y={y} width="9" height="9" rx="1.8" fill={fillId} stroke={stroke} strokeWidth="0.6" />
      <Rect x={x + 0.8} y={y + 0.8} width="7.4" height="1.6" rx="0.8" fill={W} fillOpacity="0.22" />
    </>
  );
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-blk`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
        <LinearGradient id={`${id}-red`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={R_LIGHT} />
          <Stop offset="1" stopColor={R_DARK} />
        </LinearGradient>
      </Defs>
      {tile(2, 2, `url(#${id}-blk)`, RIM)}
      {tile(13, 2, `url(#${id}-red)`, R_DARK)}
      {tile(2, 13, `url(#${id}-red)`, R_DARK)}
      {tile(13, 13, `url(#${id}-blk)`, RIM)}
      <Circle cx="17.5" cy="6.5" r="1.2" fill={W} fillOpacity="0.85" />
      <Circle cx="6.5" cy="17.5" r="1.2" fill={W} fillOpacity="0.85" />
    </Svg>
  );
}

/* ─────────────────────────────────────────────
   HEADER ICONS — same solid black + rim-light
   language applied at smaller scale
───────────────────────────────────────────── */
export function QRIcon({ size = 20, color = W }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-blk`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="2" width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="4.5" y="4.5" width="3" height="3" fill={`url(#${id}-blk)`} stroke={RIM} strokeWidth="0.4" />
      <Rect x="14" y="2" width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="16.5" y="4.5" width="3" height="3" fill={`url(#${id}-blk)`} stroke={RIM} strokeWidth="0.4" />
      <Rect x="2" y="14" width="8" height="8" rx="1.4" fill="none" stroke={color} strokeWidth="1.8" />
      <Rect x="4.5" y="16.5" width="3" height="3" fill={`url(#${id}-blk)`} stroke={RIM} strokeWidth="0.4" />
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
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-blk`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
      </Defs>
      <Path d="M3 13.5a9 9 0 0 1 18 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Rect x="2.5" y="13.5" width="5" height="7" rx="2" fill={`url(#${id}-blk)`} stroke={RIM} strokeWidth="0.5" />
      <Rect x="16.5" y="13.5" width="5" height="7" rx="2" fill={`url(#${id}-blk)`} stroke={RIM} strokeWidth="0.5" />
      <Rect x="3.2" y="14.1" width="1.6" height="2.4" rx="0.8" fill={W} fillOpacity="0.3" />
      <Rect x="17.2" y="14.1" width="1.6" height="2.4" rx="0.8" fill={W} fillOpacity="0.3" />
      <Path d="M21.5 20.5V22a1.5 1.5 0 0 1-1.5 1.5h-3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = W }: BankIconProps) {
  const id = useId();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={`${id}-blk`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BLK_LIGHT} />
          <Stop offset="1" stopColor={BLK_DARK} />
        </LinearGradient>
      </Defs>
      <G transform="translate(0, 1.3)">
        <Path
          d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
          fill={`url(#${id}-blk)`}
          stroke={RIM}
          strokeWidth="0.6"
        />
        <Path d="M6.6 8.6a5.4 5.4 0 0 1 2.6-4" stroke={W} strokeOpacity="0.35" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}
