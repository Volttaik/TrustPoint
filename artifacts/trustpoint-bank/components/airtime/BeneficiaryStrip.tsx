import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { NetworkLogo } from "./NetworkLogo";
import { detectNetwork, type NetworkId } from "./networkDetect";

export interface BeneficiaryItem {
  id: string;
  name?: string;
  phone: string;
  avatarColor?: string;
}

interface Props {
  beneficiaries: BeneficiaryItem[];
  onSelect: (phone: string) => void;
  selectedPhone?: string;
}

export function BeneficiaryStrip({ beneficiaries, onSelect, selectedPhone }: Props) {
  const colors = useColors();

  if (beneficiaries.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.emptyText, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}>
          No recent recipients
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {beneficiaries.map((b) => (
        <BeneficiaryChip
          key={b.id}
          item={b}
          selected={selectedPhone === b.phone}
          onPress={() => onSelect(b.phone)}
          colors={colors}
        />
      ))}
    </ScrollView>
  );
}

function BeneficiaryChip({
  item,
  selected,
  onPress,
  colors,
}: {
  item: BeneficiaryItem;
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const networkId = detectNetwork(item.phone);
  const initials = item.name
    ? item.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : item.phone.slice(-4);
  const avatarBg = item.avatarColor ?? "#457B9D";

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.93, { damping: 14, stiffness: 220 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 14, stiffness: 220 }); }}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? colors.primary + "12" : colors.card,
            borderColor: selected ? colors.primary + "60" : colors.border,
          },
        ]}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Text style={[styles.initials, { fontFamily: "Inter_700Bold" }]}>
              {initials}
            </Text>
          </View>
          {networkId && (
            <View style={styles.netBadge}>
              <NetworkLogo id={networkId} size={16} />
            </View>
          )}
        </View>

        {/* Info */}
        {item.name ? (
          <Text
            style={[styles.chipName, { color: colors.text, fontFamily: "Inter_600SemiBold" }]}
            numberOfLines={1}
          >
            {item.name.split(" ")[0]}
          </Text>
        ) : null}
        <Text
          style={[styles.chipPhone, { color: colors.mutedForeground, fontFamily: "Inter_400Regular" }]}
          numberOfLines={1}
        >
          {item.phone.slice(0, 8)}…
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: { paddingHorizontal: 20, gap: 10, paddingVertical: 2 },
  empty: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
  emptyText: { fontSize: 13 },
  chip: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 6,
    width: 84,
  },
  avatarWrap: { position: "relative", width: 44, height: 44 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { fontSize: 14, color: "#fff" },
  netBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    borderRadius: 5,
    overflow: "hidden",
  },
  chipName:  { fontSize: 11, textAlign: "center", width: "100%" },
  chipPhone: { fontSize: 10, textAlign: "center", width: "100%" },
});
