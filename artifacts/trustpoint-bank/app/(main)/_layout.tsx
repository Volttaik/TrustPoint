import React from "react";
import {
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
import * as Haptics from "expo-haptics";
import { TpIcon } from "@/components/TpIcon";
import { useColors } from "@/hooks/useColors";

const NAV_HOME_ACTIVE = require("@/assets/images/icons/nav_home_active.png");
const NAV_HOME_INACTIVE = require("@/assets/images/icons/nav_home_inactive.png");
const NAV_TRANSFER_ACTIVE = require("@/assets/images/icons/nav_transfer_active.png");
const NAV_TRANSFER_INACTIVE = require("@/assets/images/icons/nav_transfer_inactive.png");
const NAV_CARDS_ACTIVE = require("@/assets/images/icons/nav_cards_active.png");
const NAV_CARDS_INACTIVE = require("@/assets/images/icons/nav_cards_inactive.png");
const TP_LOGO = require("@/assets/images/icon_transparent.png");

type NavTab = {
  name: string;
  label: string;
  getImages: () => { active: any; inactive: any } | null;
};

const LEFT_TABS: NavTab[] = [
  {
    name: "index",
    label: "Home",
    getImages: () => ({ active: NAV_HOME_ACTIVE, inactive: NAV_HOME_INACTIVE }),
  },
  {
    name: "transfers",
    label: "Transfer",
    getImages: () => ({ active: NAV_TRANSFER_ACTIVE, inactive: NAV_TRANSFER_INACTIVE }),
  },
];

const RIGHT_TABS: NavTab[] = [
  {
    name: "cards",
    label: "Cards",
    getImages: () => ({ active: NAV_CARDS_ACTIVE, inactive: NAV_CARDS_INACTIVE }),
  },
  {
    name: "more",
    label: "More",
    getImages: () => null,
  },
];

function CustomTabBar() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isDark = useColorScheme() === "dark";
  const bottomH = Math.max(insets.bottom, Platform.OS === "web" ? 20 : 0);

  const isActive = (name: string) => {
    if (name === "index") return pathname === "/(main)" || pathname === "/";
    return pathname.includes(name);
  };

  const TabBtn = ({ tab }: { tab: NavTab }) => {
    const scale = useSharedValue(1);
    const active = isActive(tab.name);
    const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    const images = tab.getImages();

    return (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          scale.value = withSpring(0.85, { damping: 12 }, () => {
            scale.value = withSpring(1, { damping: 12 });
          });
          if (tab.name === "index") router.replace("/(main)");
          else router.push(`/(main)/${tab.name}` as any);
        }}
        style={styles.tabBtn}
      >
        <Animated.View style={[styles.tabContent, aStyle]}>
          <View style={[styles.iconSlot, active && { backgroundColor: colors.primary + "17" }]}>
            {images ? (
              <Image
                source={active ? images.active : images.inactive}
                style={[styles.navIcon, !active && { opacity: 0.55 }]}
                resizeMode="contain"
              />
            ) : (
              <TpIcon
                name="more-horizontal"
                size={21}
                color={active ? colors.primary : colors.mutedForeground}
                strokeWidth={2}
              />
            )}
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
    const active = isActive("dashboard-hub");
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
    <View style={[styles.barWrapper, { paddingBottom: bottomH }]}>
      <LinearGradient
        colors={isDark ? ["#131417", "#0C0D0F"] : ["#FFFFFF", "#F4F5F7"]}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.topEdge, { backgroundColor: colors.borderStrong }]} />
      <View style={styles.bar}>
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
  barWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "visible",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  topEdge: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 6,
  },
  tabBtn: { flex: 1, alignItems: "center" },
  tabContent: { alignItems: "center", gap: 4 },
  iconSlot: {
    width: 40,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10.5 },
  navIcon: { width: 24, height: 24 },
  logoWrapper: { alignItems: "center", marginTop: -26, flex: 1 },
  logoRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
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
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E11D33",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E11D33",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  logoImg: { width: 26, height: 26 },
});
