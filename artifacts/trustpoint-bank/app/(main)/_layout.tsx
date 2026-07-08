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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { TpIcon, TpIconName } from "@/components/TpIcon";

const TP_LOGO = require("@/assets/images/icon_transparent.png");

const BAR_H = 64;
const BUMP_H = 0;
const BUMP_W = 0;
const BCR = 0;
const CR = 8;
const LOGO_SIZE = 36;

function NavBarShape({ width, isDark, extraH = 0 }: { width: number; isDark: boolean; extraH?: number }) {
  const W = width;
  const bh = BUMP_H;
  const cr = CR;
  const bcr = BCR;
  const total = BAR_H + bh + extraH;

  const d = [
    `M ${cr} 0`,
    `L ${W - cr} 0`,
    `Q ${W} 0 ${W} ${cr}`,
    `L ${W} ${total - bcr}`,
    `Q ${W} ${total} ${W - bcr} ${total}`,
    `L ${bcr} ${total}`,
    `Q 0 ${total} 0 ${total - bcr}`,
    `L 0 ${cr}`,
    `Q 0 0 ${cr} 0`,
    `Z`,
  ].join(" ");

  const fill    = isDark ? "#000000" : "#FFFFFF";
  const fillAlt = isDark ? "#080808" : "#F4F5F7";

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

type NavTab = {
  name: string;
  label: string;
  icon: TpIconName;
};

const LEFT_TABS: NavTab[] = [
  { name: "index",     label: "Home",     icon: "home" },
  { name: "transfers", label: "Transfer", icon: "shuffle" },
];

const RIGHT_TABS: NavTab[] = [
  { name: "cards", label: "Cards",    icon: "credit-card" },
  { name: "more",  label: "Settings", icon: "settings" },
];

function CustomTabBar() {
  const colors   = useColors();
  const insets   = useSafeAreaInsets();
  const pathname = usePathname();
  const isDark   = colors.background !== "#F4F5F7";
  const bottomH  = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 0);
  const screenW  = Dimensions.get("window").width;
  const barW     = screenW;
  const totalH   = BAR_H + BUMP_H;

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
            <TpIcon
              name={tab.icon}
              size={22}
              color={active ? colors.primary : colors.mutedForeground}
              strokeWidth={active ? 2.1 : 1.7}
            />
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
            colors={isDark ? ["#1A1A1A", "#000000"] : ["#ECEDF0", "#D8DADF"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={[
              styles.logoRing,
              { borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.1)" },
            ]}
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
          bottom: 0,
          left: 0,
          right: 0,
          height: totalH + bottomH,
          backgroundColor: colors.tabBackground,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.14)",
        },
      ]}
    >
      <NavBarShape width={barW} isDark={isDark} extraH={bottomH} />

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
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
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
    width: 44,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10 },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoRing: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
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
    backgroundColor: "rgba(255,255,255,0.05)",
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
