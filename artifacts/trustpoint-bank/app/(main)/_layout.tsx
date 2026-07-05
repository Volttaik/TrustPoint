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
import { BlurView } from "expo-blur";
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
const NAV_PAY_CENTER = require("@/assets/images/icons/nav_pay_center.png");

type NavTab = {
  name: string;
  label: string;
  getImages: () => { active: any; inactive: any } | null;
};

const TABS: NavTab[] = [
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
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const isIOS = Platform.OS === "ios";
  const bottomH = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

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
          {images ? (
            <Image
              source={active ? images.active : images.inactive}
              style={styles.navIcon}
              resizeMode="contain"
            />
          ) : (
            <TpIcon
              name="more-horizontal"
              size={22}
              color={active ? colors.primary : colors.mutedForeground}
              strokeWidth={2}
            />
          )}
          <Text
            style={[
              styles.tabLabel,
              {
                color: active ? colors.primary : colors.mutedForeground,
                fontFamily: "Inter_500Medium",
              },
            ]}
          >
            {tab.label}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  const PayBtn = () => {
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
        style={styles.fabWrapper}
      >
        <Animated.View style={[styles.fab, { backgroundColor: colors.primary }, aStyle]}>
          <Image source={NAV_PAY_CENTER} style={styles.fabIcon} resizeMode="contain" />
        </Animated.View>
        <Text style={[styles.tabLabel, { color: colors.mutedForeground, fontFamily: "Inter_500Medium", marginTop: 2 }]}>
          Pay
        </Text>
      </Pressable>
    );
  };

  const Content = () => (
    <View style={[styles.bar, { paddingBottom: bottomH }]}>
      {TABS.slice(0, 2).map((t) => (
        <TabBtn key={t.name} tab={t} />
      ))}
      <PayBtn />
      {TABS.slice(2).map((t) => (
        <TabBtn key={t.name} tab={t} />
      ))}
    </View>
  );

  return (
    <View style={[styles.barWrapper, { borderTopColor: colors.border }]}>
      {isIOS ? (
        <BlurView
          intensity={85}
          tint={isDark ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBackground }]} />
      )}
      <Content />
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
    borderTopWidth: 0.5,
    overflow: "hidden",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  tabBtn: { flex: 1, alignItems: "center" },
  tabContent: { alignItems: "center", gap: 3 },
  tabLabel: { fontSize: 10.5 },
  navIcon: { width: 26, height: 26 },
  fabWrapper: { alignItems: "center", marginTop: -20, flex: 1 },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { width: 30, height: 30 },
});
