import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Tabs, router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { TransferIcon, CardsIcon } from "@/components/BankIcons";

const TP_LOGO = require("@/assets/images/icon_transparent.png");

const BAR_H = 64;
const BUMP_H = 36;
const BUMP_W = 62;
const BCR = 36;   // bottom corner radius
const CR = 36;    // top corner radius
const LOGO_SIZE = 56;

function NavBarShape({ width, isDark }: { width: number; isDark: boolean }) {
  const W = width;
  const bh = BUMP_H;
  const bw = BUMP_W;
  const cr = CR;
  const bcr = BCR;
  const mid = W / 2;
  const total = BAR_H + bh;

  /* True ellipse-arc approximation using κ = 0.5523.
     CP1 is at the outer edge partway up, CP2 is wide from the peak —
     this gives a genuine smooth semicircle instead of a triangle. */
  const k = 0.5523;
  const d = [
    `M ${cr} ${bh}`,
    `L ${mid - bw} ${bh}`,
    `C ${mid - bw} ${bh * (1 - k)} ${mid - bw * k} 0 ${mid} 0`,
    `C ${mid + bw * k} 0 ${mid + bw} ${bh * (1 - k)} ${mid + bw} ${bh}`,
    `L ${W - cr} ${bh}`,
    `Q ${W} ${bh} ${W} ${bh + cr}`,
    `L ${W} ${total - bcr}`,
    `Q ${W} ${total} ${W - bcr} ${total}`,
    `L ${bcr} ${total}`,
    `Q 0 ${total} 0 ${total - bcr}`,
    `L 0 ${bh + cr}`,
    `Q 0 ${bh} ${cr} ${bh}`,
    `Z`,
  ].join(" ");

  const fill    = isDark ? "#131417" : "#FFFFFF";
  const fillAlt = isDark ? "#0C0D0F" : "#F4F5F7";

  return (
    <Svg width={W} height={total} style={{ position: "absolute", top: 0, left: 0 }}>
      <Defs>
        <SvgGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={fill} />
          <Stop offset="1" stopColor={fillAlt} />
        </SvgGradient>
      </Defs>
      <Path d={d} fill="url(#barGrad)" />
    </Svg>
  );
}

/* ─── Nav icons ─────────────────────────────────────── */

function HomeIcon({ size = 28, active }: { size?: number; active: boolean }) {
  const fill = active ? "#1A1A1F" : "#6B6B72";
  const rim  = active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.4 11.2L12 4.2L20.6 11.2V20.8H14.8V15H9.2V20.8H3.4Z"
        fill={fill}
        stroke={rim}
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <Path d="M9.2 15H14.8V17H9.2Z" fill="rgba(255,255,255,0.12)" />
      <Path d="M4.8 12.1L12 5.8L19.2 12.1" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" fill="none" />
    </Svg>
  );
}

function SettingsIcon({ size = 28, active }: { size?: number; active: boolean }) {
  const fill = active ? "#1A1A1F" : "#6B6B72";
  const rim  = active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
  /* 8-tooth gear path */
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.4L13.6 5.1A7.2 7.2 0 0 1 15.6 5.8L18.5 4.6L19.4 6.3L17 8.1A7.3 7.3 0 0 1 17.2 10L19.6 11.5L18.8 13.3L16.1 12.6A7.3 7.3 0 0 1 14.5 14.1L14.8 17H12.8L12.4 14.1A7.3 7.3 0 0 1 10.8 12.9L8.1 14.1L6.9 12.5L9.2 10.9A7.3 7.3 0 0 1 9 9.2L6.5 7.7L7.5 6L10.2 7.3A7.2 7.2 0 0 1 12 6.6L12 2.4Z"
        fill={fill}
        stroke={rim}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="10" r="2.6" fill="rgba(255,255,255,0.18)" stroke={rim} strokeWidth="0.5" />
    </Svg>
  );
}

/* ─── Tab definitions ───────────────────────────────── */

type NavTab = {
  name: string;
  label: string;
  icon: (active: boolean, colors: any) => React.ReactNode;
};

const LEFT_TABS: NavTab[] = [
  {
    name: "index",
    label: "Home",
    icon: (active) => <HomeIcon size={27} active={active} />,
  },
  {
    name: "transfers",
    label: "Transfer",
    icon: () => <TransferIcon size={27} />,
  },
];

const RIGHT_TABS: NavTab[] = [
  {
    name: "cards",
    label: "Cards",
    icon: () => <CardsIcon size={27} />,
  },
  {
    name: "more",
    label: "Settings",
    icon: (active) => <SettingsIcon size={27} active={active} />,
  },
];

/* ─── Custom tab bar ────────────────────────────────── */

function CustomTabBar() {
  const colors  = useColors();
  const insets  = useSafeAreaInsets();
  const pathname = usePathname();
  const isDark  = useColorScheme() === "dark";
  const bottomH = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 0);
  const screenW = Dimensions.get("window").width;
  const MARGIN  = 16;
  const barW    = screenW - MARGIN * 2;
  const totalH  = BAR_H + BUMP_H;

  const isActive = (name: string) => {
    if (name === "index") return pathname === "/(main)" || pathname === "/";
    return pathname.includes(name);
  };

  const TabBtn = ({ tab }: { tab: NavTab }) => {
    const scale  = useSharedValue(1);
    const active = isActive(tab.name);
    const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          scale.value = withSpring(0.82, { damping: 12 }, () => {
            scale.value = withSpring(1, { damping: 12 });
          });
          if (tab.name === "index") router.replace("/(main)");
          else router.push(`/(main)/${tab.name}` as any);
        }}
        style={styles.tabBtn}
      >
        <Animated.View style={[styles.tabContent, aStyle]}>
          <View style={[styles.iconSlot, active && { backgroundColor: colors.primary + "17" }]}>
            {tab.icon(active, colors)}
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: active ? colors.primary : colors.mutedForeground,
                fontFamily: active ? "Inter_600SemiBold" : "Inter_500Medium",
              },
            ]}
          >
            {tab.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  const LogoBtn = () => {
    const scale  = useSharedValue(1);
    const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          scale.value = withSpring(0.85, { damping: 12 }, () => {
            scale.value = withSpring(1, { damping: 12 });
          });
          router.push("/(main)/payments" as any);
        }}
        style={styles.logoWrapper}
      >
        <Animated.View style={aStyle}>
          <LinearGradient
            colors={["#2E3036", "#131417"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.logoRing}
          >
            <View pointerEvents="none" style={styles.logoTopHighlight} />
            <View style={styles.logoInner}>
              <Image source={TP_LOGO} style={styles.logoImg} resizeMode="contain" />
            </View>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.outerWrapper,
        {
          bottom: bottomH + 12,
          left: MARGIN,
          right: MARGIN,
          height: totalH,
        },
      ]}
    >
      <NavBarShape width={barW} isDark={isDark} />

      <View style={[styles.bar, { paddingTop: BUMP_H }]}>
        {LEFT_TABS.map((t) => (
          <TabBtn key={t.name} tab={t} />
        ))}
        <LogoBtn />
        {RIGHT_TABS.map((t) => (
          <TabBtn key={t.name} tab={t} />
        ))}
      </View>
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      tabBar={() => <CustomTabBar />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="transfers" />
      <Tabs.Screen name="payments" />
      <Tabs.Screen name="cards" />
      <Tabs.Screen name="more" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: "absolute",
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 20,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    flex: 1,
  },
  tabBtn: { flex: 1, alignItems: "center" },
  tabContent: { alignItems: "center", gap: 3 },
  iconSlot: {
    width: 42,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10 },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: -(BUMP_H + 6),
  },
  logoRing: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
    overflow: "hidden",
  },
  logoTopHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  logoInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: { width: 32, height: 32 },
});
