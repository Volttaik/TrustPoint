import React from "react";
import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop, Ellipse } from "react-native-svg";

interface BankIconProps {
  size?: number;
  color?: string;
  accent?: string;
}

export function TransferIcon({ size = 28, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="tg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.22" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="5" width="24" height="18" rx="5" fill="url(#tg1)" />
      <Rect x="2" y="5" width="24" height="18" rx="5" stroke={color} strokeWidth="1.4" strokeOpacity="0.18" />
      <Path d="M8 17h12M8 17l3-3M8 17l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20 11H8M20 11l-3-3M20 11l-3 3" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Ellipse cx="14" cy="14" rx="3" ry="3" fill={accent} fillOpacity="0.15" />
      <Path d="M14 12v4M12.5 13.5l1.5-1.5 1.5 1.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function DepositIcon({ size = 28, color = "#fff", accent = "#2FBE73" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="dg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.2" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect x="3" y="16" width="22" height="8" rx="3" fill="url(#dg1)" />
      <Rect x="3" y="16" width="22" height="8" rx="3" stroke={color} strokeWidth="1.4" strokeOpacity="0.2" />
      <Path d="M7 20h4M17 20h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <Circle cx="14" cy="20" r="1.5" fill={accent} />
      <Path d="M14 4v12M14 16l-4-4M14 16l4-4" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 8.5a5 5 0 0 1 8 0" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.35" fill="none" />
    </Svg>
  );
}

export function AirtimeIcon({ size = 28, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.12" />
          <Stop offset="1" stopColor={color} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>
      <Rect x="8" y="3" width="12" height="20" rx="3" fill="url(#ag1)" />
      <Rect x="8" y="3" width="12" height="20" rx="3" stroke={color} strokeWidth="1.5" />
      <Rect x="11" y="5.5" width="6" height="1.2" rx="0.6" fill={color} fillOpacity="0.35" />
      <Circle cx="14" cy="20" r="1.2" fill={color} fillOpacity="0.6" />
      <Path d="M10.5 13c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5" stroke={accent} strokeWidth="1.7" strokeLinecap="round" fill="none" />
      <Path d="M7 10.5a8 8 0 0 1 14 0" stroke={accent} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.5" />
      <Circle cx="14" cy="13.5" r="1.5" fill={accent} />
    </Svg>
  );
}

export function DataIcon({ size = 28, color = "#fff", accent = "#3E8BFF" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="dig1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.2" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect x="2" y="6" width="24" height="16" rx="4" fill="url(#dig1)" />
      <Rect x="2" y="6" width="24" height="16" rx="4" stroke={color} strokeWidth="1.3" strokeOpacity="0.15" />
      <Rect x="5" y="18" width="3.5" height="2.5" rx="1" fill={accent} fillOpacity="0.4" />
      <Rect x="10.5" y="15" width="3.5" height="5.5" rx="1" fill={accent} fillOpacity="0.6" />
      <Rect x="16" y="12" width="3.5" height="8.5" rx="1" fill={accent} />
      <Rect x="21.5" y="9" width="3.5" height="11.5" rx="1" fill={accent} />
      <Path d="M3 10a1 1 0 0 1 1-1h20a1 1 0 0 1 0 2H4a1 1 0 0 1-1-1z" fill={color} fillOpacity="0.05" />
      <Path d="M5 10h18" stroke={color} strokeWidth="1" strokeOpacity="0.12" />
    </Svg>
  );
}

export function BillsIcon({ size = 28, color = "#fff", accent = "#E3A008" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.14" />
          <Stop offset="1" stopColor={color} stopOpacity="0.03" />
        </LinearGradient>
      </Defs>
      <Path d="M6 3h16v22l-3-2-3 2-3-2-3 2-4-2V3z" fill="url(#bg1)" />
      <Path d="M6 3h16v22l-3-2-3 2-3-2-3 2-4-2V3z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <Path d="M10 9h8M10 12.5h6M10 16h4" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.5" />
      <Circle cx="19" cy="18" r="4.5" fill={accent} />
      <Path d="M17 18l1.5 1.5L21 16.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CardsIcon({ size = 28, color = "#fff", accent = "#3E8BFF" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.25" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.06" />
        </LinearGradient>
        <LinearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.16" />
          <Stop offset="1" stopColor={color} stopOpacity="0.04" />
        </LinearGradient>
      </Defs>
      <Rect x="4" y="9" width="22" height="14" rx="3.5" fill="url(#cg1)" />
      <Rect x="4" y="9" width="22" height="14" rx="3.5" stroke={accent} strokeWidth="1.3" strokeOpacity="0.5" />
      <Rect x="2" y="5" width="22" height="14" rx="3.5" fill="url(#cg2)" />
      <Rect x="2" y="5" width="22" height="14" rx="3.5" stroke={color} strokeWidth="1.4" strokeOpacity="0.3" />
      <Path d="M2 9h22" stroke={color} strokeWidth="2" strokeOpacity="0.5" />
      <Rect x="5" y="12" width="4.5" height="3" rx="1" fill={color} fillOpacity="0.55" />
      <Path d="M15 14h5M15 16.5h3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.4" />
    </Svg>
  );
}

export function SavingsIcon({ size = 28, color = "#fff", accent = "#2FBE73" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={accent} stopOpacity="0.22" />
          <Stop offset="1" stopColor={accent} stopOpacity="0.05" />
        </LinearGradient>
      </Defs>
      <Path d="M5 13c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.5-1.02 4.76-2.66 6.4H7.66A8.96 8.96 0 0 1 5 13z" fill="url(#sg1)" />
      <Path d="M5 13c0-4.97 4.03-9 9-9s9 4.03 9 9c0 2.5-1.02 4.76-2.66 6.4H7.66A8.96 8.96 0 0 1 5 13z" stroke={color} strokeWidth="1.4" />
      <Rect x="9" y="19.4" width="10" height="3.5" rx="1.75" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      <Circle cx="20.5" cy="12" r="2.5" fill={accent} fillOpacity="0.3" stroke={color} strokeWidth="1.2" strokeOpacity="0.4" />
      <Path d="M14 9v4l2.5 1.5" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="9.5" cy="13" r="1" fill={color} fillOpacity="0.4" />
      <Path d="M12 6.5c0-1.1.9-2 2-2" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.3" fill="none" />
    </Svg>
  );
}

export function MoreIcon({ size = 28, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Defs>
        <LinearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.12" />
          <Stop offset="1" stopColor={color} stopOpacity="0.02" />
        </LinearGradient>
      </Defs>
      <Rect x="3" y="3" width="22" height="22" rx="5" fill="url(#mg1)" />
      <Rect x="3" y="3" width="22" height="22" rx="5" stroke={color} strokeWidth="1.3" strokeOpacity="0.15" />
      <Rect x="7" y="7" width="5" height="5" rx="1.5" fill={color} fillOpacity="0.5" />
      <Rect x="16" y="7" width="5" height="5" rx="1.5" fill={accent} fillOpacity="0.7" />
      <Rect x="7" y="16" width="5" height="5" rx="1.5" fill={accent} fillOpacity="0.5" />
      <Rect x="16" y="16" width="5" height="5" rx="1.5" fill={color} fillOpacity="0.35" />
    </Svg>
  );
}

export function QRIcon({ size = 24, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none" />
      <Rect x="5" y="5" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.7" />
      <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none" />
      <Rect x="16" y="5" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.7" />
      <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.6" fill="none" />
      <Rect x="5" y="16" width="3" height="3" rx="0.5" fill={color} fillOpacity="0.7" />
      <Path d="M14 14h1.5v1.5H14zM16.5 14H18v1.5h-1.5zM19 14h1.5v1.5H19zM14 16.5h1.5V18H14zM16.5 16.5H18V18h-1.5zM19 16.5h1.5V18H19zM14 19h1.5v1.5H14zM16.5 19H18v1.5h-1.5zM19 19h1.5v1.5H19z" fill={color} fillOpacity="0.55" />
    </Svg>
  );
}

export function SupportIcon({ size = 24, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 13a9 9 0 0 1 18 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x="3" y="13" width="5" height="7" rx="2" stroke={color} strokeWidth="1.7" fill="none" />
      <Rect x="16" y="13" width="5" height="7" rx="2" stroke={color} strokeWidth="1.7" fill="none" />
      <Path d="M21 20v1a2 2 0 0 1-2 2h-3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="22" r="1" fill={color} fillOpacity="0.6" />
    </Svg>
  );
}

export function BellIcon({ size = 24, color = "#fff", accent = "#E11D33" }: BankIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
