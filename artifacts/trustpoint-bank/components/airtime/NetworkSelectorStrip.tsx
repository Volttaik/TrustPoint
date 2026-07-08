/**
 * NetworkSelectorStrip — horizontal scrollable row of network chips.
 * Always visible on airtime & data screens.
 * Respects auto-detected network from phone prefix; user can override.
 */
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { NetworkLogo } from "./NetworkLogo";
import { NETWORK_LIST, type NetworkId } from "./networkDetect";

interface Props {
  /** The currently active network (manually chosen or auto-detected). */
  selected: NetworkId | null;
  onSelect: (id: NetworkId) => void;
}

export function NetworkSelectorStrip({ selected, onSelect }: Props) {
  const colors = useColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {NETWORK_LIST.map((net) => (
        <NetworkChip
          key={net.id}
          id={net.id}
          name={net.name}
          color={net.color}
          selected={selected === net.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(net.id);
          }}
          colors={colors}
        />
      ))}
    </ScrollView>
  );
}

function NetworkChip({
  id, name, color, selected, onPress, colors,
}: {
  id: NetworkId; name: string; color: string;
  selected: boolean; onPress: () => void; colors: any;
}) {
  const scale = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={aStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.94, { damping: 18, stiffness: 320 }); }}
        onPressOut={() => { scale.value = withSpring(1,    { damping: 18, stiffness: 320 }); }}
        style={[
          styles.chip,
          {
            backgroundColor: selected ? color + "14" : colors.card,
            borderColor:     selected ? color + "70" : colors.border,
            borderWidth:     selected ? 1.5 : 1,
          },
        ]}
      >
        <NetworkLogo id={id} size={38} radius={10} />
        <Text
          style={[
            styles.chipName,
            {
              color: selected ? color : colors.text,
              fontFamily: selected ? "Inter_700Bold" : "Inter_500Medium",
            },
          ]}
        >
          {name}
        </Text>

        {/* Selected tick */}
        {selected && (
          <Animated.View
            style={[styles.tick, { backgroundColor: color }]}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  strip: { paddingHorizontal: 20, gap: 10, paddingVertical: 4 },
  chip: {
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    width: 82,
    position: "relative",
  },
  chipName: { fontSize: 12, letterSpacing: -0.2 },
  tick: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
