import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Tabs, router, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useColorScheme } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

const TABS = [
  { name: "index", label: "Home", icon: "home" as const },
  { name: "transfers", label: "Transfer", icon: "send" as const },
  { name: "cards", label: "Cards", icon: "credit-card" as const },
  { name: "more", label: "More", icon: "menu" as const },
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

  const TabBtn = ({ tab }: { tab: (typeof TABS)[0] }) => {
    const scale = useSharedValue(1);
    const active = isActive(tab.name);
    const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

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
          <Feather
            name={tab.icon}
            size={22}
            color={active ? colors.primary : colors.mutedForeground}
          />
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

  // Center FAB (Payments)
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
          <Feather name="zap" size={26} color="#fff" />
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
});
