import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export function DashboardBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 400 900" preserveAspectRatio="xMidYMin slice">
        <Defs>
          <LinearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="40%">
            <Stop offset="0%" stopColor="#4d0000" stopOpacity={1} />
            <Stop offset="45%" stopColor="#ff1a2e" stopOpacity={1} />
            <Stop offset="100%" stopColor="#3d0000" stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="40%">
            <Stop offset="0%" stopColor="#330000" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#e60023" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#220000" stopOpacity={0.9} />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={400} height={900} fill="#000000" />

        <Path
          d="M -20 260 C 60 180, 140 340, 220 220 C 300 100, 360 160, 430 60"
          stroke="url(#wave1)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          opacity={0.16}
        />
        <Path
          d="M -20 260 C 60 180, 140 340, 220 220 C 300 100, 360 160, 430 60"
          stroke="url(#wave1)"
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />

        <Path
          d="M -20 300 C 60 220, 140 380, 220 260 C 300 140, 360 200, 430 100"
          stroke="url(#wave2)"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          opacity={0.14}
        />
        <Path
          d="M -20 300 C 60 220, 140 380, 220 260 C 300 140, 360 200, 430 100"
          stroke="url(#wave2)"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.85}
        />

        <Path
          d="M -20 340 C 60 260, 140 420, 220 300 C 300 180, 360 240, 430 140"
          stroke="url(#wave1)"
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={0.12}
        />
        <Path
          d="M -20 340 C 60 260, 140 420, 220 300 C 300 180, 360 240, 430 140"
          stroke="url(#wave1)"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />

        <Path
          d="M -20 200 C 80 140, 160 260, 240 160 C 320 60, 370 100, 430 40"
          stroke="url(#wave2)"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
    overflow: "hidden",
  },
});
