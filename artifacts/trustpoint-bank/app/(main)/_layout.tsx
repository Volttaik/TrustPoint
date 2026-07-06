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
import Svg, { Path, Circle, G, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { TransferIcon, CardsIcon } from "@/components/BankIcons";

const TP_LOGO = require("@/assets/images/icon_transparent.png");

const BAR_H = 64;
const BUMP_H = 30;
const BUMP_W = 38;
const CR = 26;
const LOGO_SIZE = 54;

function NavBarShape({ width, isDark }: { width: number; height: number; isDark: boolean }) {
  const W = width;
  const H = BAR_H;
  const bh = BUMP_H;
  const bw = BUMP_W;
  const cr = CR;
  const mid = W / 2;
  const total = H + bh;

  const d = [
    `M ${cr} ${bh}`,
    `L ${mid - bw} ${bh}`,
    `C ${mid - bw * 0.55} ${bh} ${mid - bw * 0.3} 0 ${mid} 0`,
    `C ${mid + bw * 0.3} 0 ${mid + bw * 0.55} ${bh} ${mid + bw} ${bh}`,
    `L ${W - cr} ${bh}`,
    `Q ${W} ${bh} ${W} ${bh + cr}`,
    `L ${W} ${total}`,
    `L 0 ${total}`,
    `L 0 ${bh + cr}`,
    `Q 0 ${bh} ${cr} ${bh}`,
    `Z`,
  ].join(" ");

  const fill = isDark ? "#131417" : "#FFFFFF";
  const fillAlt = isDark ? "#0C0D0F" : "#F4F5F7";

  return (
    <Svg
      width={W}
      height={total}
      style={{ position: "absolute", top: 0, left: 0 }}
    >
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

function HomeIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGradient id="homeBlk" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3A3A3F" />
          <Stop offset="1" stopColor="#000000" />
        </SvgGradient>
      </Defs>
      <Path
        d="M3.2 10.8L12 3.5L20.8 10.8V20.5H15.2V15.2H8.8V20.5H3.2Z"
        fill={color === "active" ? "url(#homeBlk)" : color}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <Path
        d="M8.8 15.2H15.2V17H8.8Z"
        fill="rgba(255,255,255,0.1)"
      />
      <Path
        d="M4.4 11.6L12 5.2L19.6 11.6"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.5"
        fill="none"
      />
    </Svg>
  );
}

function MoreIcon({ size = 22, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <SvgGradient id="moreBlk" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#3A3A3F" />
          <Stop offset="1" stopColor="#000000" />
        </SvgGradient>
      </Defs>
      <G>
        <Circle cx="5.5" cy="12" r="2.2" fill={color === "active" ? "url(#moreBlk)" : color} stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
        <Circle cx="12" cy="12" r="2.2" fill={color === "active" ? "url(#moreBlk)" : color} stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
        <Circle cx="18.5" cy="12" r="2.2" fill={color === "active" ? "url(#moreBlk)" : color} stroke="rgba(255,255,255,0.45)" strokeWidth="0.5" />
      </G>
    </Svg>
  );
}

type NavTab = {
  name: string;
  label: string;
  icon: (active: boolean, colors: any) => React.ReactNode;
};

const LEFT_TABS: NavTab[] = [
  {
    name: "index",
    label: "Home",
    icon: (active, colors) => (
      <HomeIcon
        size={22}
        color={active ? "active" : colors.mutedForeground}
      />
    ),
  },
  {
    name: "transfers",
    label: "Transfer",
    icon: (active, colors) => (
      <TransferIcon size={22} />
    ),
  },
];

const RIGHT_TABS: NavTab[] = [
  {
    name: "cards",
    label: "Cards",
    icon: (active, colors) => (
      <CardsIcon size={22} />
    ),
  },
  {
    name: "more",
    label: "More",
    icon: (active, colors) => (
      <MoreIcon
        size={22}
        color={active ? "active" : colors.mutedForeground}
      />
    ),
  },
];

function CustomTabBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDark = useColorScheme() === "dark";
  const bottomH = Math.max(insets.bottom, Platform.OS === "web" ? 16 : 0);
  const screenW = Dimensions.get("window").width;
  const MARGIN = 16;
  const barW = screenW - MARGIN * 2;
  const totalH = BAR_H + BUMP_H;

  const isActive = (name: string) => {
    if (name === "index") return pathname === "/(main)" || pathname === "/";
    return pathname.includes(name);
  };

  const TabBtn = ({ tab }: { tab: NavTab }) => {
    const scale = useSharedValue(1);
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
    const scale = useSharedValue(1);
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
      <NavBarShape width={barW} height={BAR_H} isDark={isDark} />

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
    width: 38,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10 },
  logoWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: -(BUMP_H + 8),
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: { width: 30, height: 30 },
});
