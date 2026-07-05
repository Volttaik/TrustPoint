import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
  hasOnline?: boolean;
}

export function Avatar({ initials, color = "#E63946", size = 48, style, hasOnline }: AvatarProps) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color + "22",
            borderColor: color + "55",
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color,
              fontSize: size * 0.36,
              fontFamily: "Inter_600SemiBold",
            },
          ]}
        >
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      {hasOnline && (
        <View
          style={[
            styles.online,
            { right: size * 0.04, bottom: size * 0.04, width: size * 0.22, height: size * 0.22, borderRadius: size * 0.11 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  circle: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  online: {
    position: "absolute",
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#0A0A0A",
  },
});
