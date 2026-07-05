import React from "react";
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Polygon,
  G,
} from "react-native-svg";

export type TpIconName =
  | "arrow-left"
  | "arrow-right"
  | "arrow-down-left"
  | "arrow-up-right"
  | "chevron-right"
  | "chevron-down"
  | "chevron-up"
  | "bell"
  | "check"
  | "check-circle"
  | "x"
  | "eye"
  | "eye-off"
  | "search"
  | "sliders"
  | "delete"
  | "lock"
  | "unlock"
  | "alert-circle"
  | "alert-triangle"
  | "info"
  | "user"
  | "user-plus"
  | "users"
  | "inbox"
  | "zap"
  | "shuffle"
  | "globe"
  | "calendar"
  | "refresh-cw"
  | "settings"
  | "credit-card"
  | "dollar-sign"
  | "map-pin"
  | "mail"
  | "phone"
  | "camera"
  | "edit-2"
  | "copy"
  | "share-2"
  | "key"
  | "fingerprint"
  | "shield"
  | "smartphone"
  | "trash-2"
  | "log-out"
  | "star"
  | "link"
  | "pie-chart"
  | "trending-up"
  | "file-text"
  | "gift"
  | "moon"
  | "sun"
  | "help-circle"
  | "send"
  | "map"
  | "wifi"
  | "tv"
  | "book"
  | "droplet"
  | "activity"
  | "home"
  | "more-horizontal";

interface TpIconProps {
  name: TpIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

type IconRenderer = (color: string, sw: number) => React.ReactNode;

const ICONS: Record<TpIconName, IconRenderer> = {
  "arrow-left": (c, sw) => (
    <>
      <Path d="M19 12H5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 19l-7-7 7-7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "arrow-right": (c, sw) => (
    <>
      <Path d="M5 12h14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 5l7 7-7 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "arrow-down-left": (c, sw) => (
    <>
      <Path d="M17 7L7 17" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M17 17H7V7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "arrow-up-right": (c, sw) => (
    <>
      <Path d="M7 17L17 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 7h10v10" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "chevron-right": (c, sw) => (
    <Path d="M9 18l6-6-6-6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-down": (c, sw) => (
    <Path d="M6 9l6 6 6-6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  "chevron-up": (c, sw) => (
    <Path d="M18 15l-6-6-6 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  bell: (c, sw) => (
    <>
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  check: (c, sw) => (
    <Path d="M20 6L9 17l-5-5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  ),
  "check-circle": (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M9 12l2 2 4-4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  x: (c, sw) => (
    <>
      <Path d="M18 6L6 18" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M6 6l12 12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  eye: (c, sw) => (
    <>
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
    </>
  ),
  "eye-off": (c, sw) => (
    <>
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.73 10.73a3 3 0 1 0 4.1 4.1" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M1 1l22 22" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  search: (c, sw) => (
    <>
      <Circle cx="11" cy="11" r="8" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M21 21l-4.35-4.35" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  sliders: (c, sw) => (
    <>
      <Line x1="4" y1="21" x2="4" y2="14" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4" y1="10" x2="4" y2="3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="21" x2="12" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="8" x2="12" y2="3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="20" y1="21" x2="20" y2="16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="20" y1="12" x2="20" y2="3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="1" y1="14" x2="7" y2="14" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="9" y1="8" x2="15" y2="8" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="17" y1="16" x2="23" y2="16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  delete: (c, sw) => (
    <>
      <Path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="18" y1="9" x2="12" y2="15" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="9" x2="18" y2="15" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  lock: (c, sw) => (
    <>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  unlock: (c, sw) => (
    <>
      <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M7 11V7a5 5 0 0 1 9.9-1" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "alert-circle": (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="12" y1="8" x2="12" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="16" x2="12.01" y2="16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  "alert-triangle": (c, sw) => (
    <>
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="12" y1="9" x2="12" y2="13" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="17" x2="12.01" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  info: (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="12" y1="16" x2="12" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="8" x2="12.01" y2="8" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  user: (c, sw) => (
    <>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="12" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
    </>
  ),
  "user-plus": (c, sw) => (
    <>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="8.5" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="20" y1="8" x2="20" y2="14" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="23" y1="11" x2="17" y2="11" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  users: (c, sw) => (
    <>
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="9" cy="7" r="4" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  inbox: (c, sw) => (
    <>
      <Polyline points="22 12 16 12 14 15 10 15 8 12 2 12" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  zap: (c, sw) => (
    <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  shuffle: (c, sw) => (
    <>
      <Polyline points="16 3 21 3 21 8" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="4" y1="20" x2="21" y2="3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polyline points="21 16 21 21 16 21" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="15" y1="15" x2="21" y2="21" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4" y1="4" x2="9" y2="9" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  globe: (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="2" y1="12" x2="22" y2="12" stroke={c} strokeWidth={sw} />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  calendar: (c, sw) => (
    <>
      <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="16" y1="2" x2="16" y2="6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="8" y1="2" x2="8" y2="6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="3" y1="10" x2="21" y2="10" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  "refresh-cw": (c, sw) => (
    <>
      <Polyline points="23 4 23 10 17 10" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="1 20 1 14 7 14" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  settings: (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={c} strokeWidth={sw} fill="none" />
    </>
  ),
  "credit-card": (c, sw) => (
    <>
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="1" y1="10" x2="23" y2="10" stroke={c} strokeWidth={sw} />
    </>
  ),
  "dollar-sign": (c, sw) => (
    <>
      <Line x1="12" y1="1" x2="12" y2="23" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "map-pin": (c, sw) => (
    <>
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="12" cy="10" r="3" stroke={c} strokeWidth={sw} fill="none" />
    </>
  ),
  mail: (c, sw) => (
    <>
      <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="22,6 12,13 2,6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  phone: (c, sw) => (
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.93 15a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  camera: (c, sw) => (
    <>
      <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="12" cy="13" r="4" stroke={c} strokeWidth={sw} fill="none" />
    </>
  ),
  "edit-2": (c, sw) => (
    <Path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  copy: (c, sw) => (
    <>
      <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  "share-2": (c, sw) => (
    <>
      <Circle cx="18" cy="5" r="3" stroke={c} strokeWidth={sw} fill="none" />
      <Circle cx="6" cy="12" r="3" stroke={c} strokeWidth={sw} fill="none" />
      <Circle cx="18" cy="19" r="3" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  key: (c, sw) => (
    <>
      <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  fingerprint: (c, sw) => (
    <>
      <Path d="M12 10a2 2 0 0 0-2 2v4" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 7a5 5 0 0 1 5 5v1" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 4a8 8 0 0 1 8 8v3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M4 12a8 8 0 0 1 4.93-7.37" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M9 21l1-5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M14.5 21.5c1.2-2 2.5-4 2.5-9.5" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  shield: (c, sw) => (
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  smartphone: (c, sw) => (
    <>
      <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="12" y1="18" x2="12.01" y2="18" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  "trash-2": (c, sw) => (
    <>
      <Polyline points="3 6 5 6 21 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="10" y1="11" x2="10" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="14" y1="11" x2="14" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  "log-out": (c, sw) => (
    <>
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="16 17 21 12 16 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="21" y1="12" x2="9" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  star: (c, sw) => (
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  link: (c, sw) => (
    <>
      <Path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "pie-chart": (c, sw) => (
    <>
      <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M22 12A10 10 0 0 0 12 2v10z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "trending-up": (c, sw) => (
    <>
      <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="17 6 23 6 23 12" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "file-text": (c, sw) => (
    <>
      <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="14 2 14 8 20 8" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="16" y1="13" x2="8" y2="13" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="16" y1="17" x2="8" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polyline points="10 9 9 9 8 9" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  gift: (c, sw) => (
    <>
      <Polyline points="20 12 20 22 4 22 4 12" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x="2" y="7" width="20" height="5" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="12" y1="22" x2="12" y2="7" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  moon: (c, sw) => (
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  sun: (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="5" stroke={c} strokeWidth={sw} fill="none" />
      <Line x1="12" y1="1" x2="12" y2="3" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="12" y1="21" x2="12" y2="23" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="1" y1="12" x2="3" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="21" y1="12" x2="23" y2="12" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  "help-circle": (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="10" stroke={c} strokeWidth={sw} fill="none" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="12" y1="17" x2="12.01" y2="17" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  send: (c, sw) => (
    <>
      <Line x1="22" y1="2" x2="11" y2="13" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Polygon points="22 2 15 22 11 13 2 9 22 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  map: (c, sw) => (
    <>
      <Polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="8" y1="2" x2="8" y2="18" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <Line x1="16" y1="6" x2="16" y2="22" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  wifi: (c, sw) => (
    <>
      <Path d="M1.42 9a16 16 0 0 1 21.16 0" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M5 12.55a11 11 0 0 1 14.08 0" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Line x1="12" y1="20" x2="12.01" y2="20" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </>
  ),
  tv: (c, sw) => (
    <>
      <Rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke={c} strokeWidth={sw} fill="none" />
      <Polyline points="17 2 12 7 7 2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  book: (c, sw) => (
    <>
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  droplet: (c, sw) => (
    <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  activity: (c, sw) => (
    <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  ),
  home: (c, sw) => (
    <>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Polyline points="9 22 9 12 15 12 15 22" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  "more-horizontal": (c, sw) => (
    <>
      <Circle cx="12" cy="12" r="1" stroke={c} strokeWidth={sw} fill={c} />
      <Circle cx="19" cy="12" r="1" stroke={c} strokeWidth={sw} fill={c} />
      <Circle cx="5" cy="12" r="1" stroke={c} strokeWidth={sw} fill={c} />
    </>
  ),
};

export function TpIcon({ name, size = 24, color = "#fff", strokeWidth = 2 }: TpIconProps) {
  const renderer = ICONS[name];
  if (!renderer) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {renderer(color, strokeWidth)}
    </Svg>
  );
}
