import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

export function DashboardBackground() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height} viewBox="0 0 400 900" preserveAspectRatio="xMidYMin slice">
        <Defs>
          <LinearGradient id="wave1" x1="100%" y1="0%" x2="0%" y2="60%">
            <Stop offset="0%" stopColor="#3d0000" stopOpacity={1} />
            <Stop offset="45%" stopColor="#ff1a2e" stopOpacity={1} />
            <Stop offset="100%" stopColor="#4d0000" stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="60%">
            <Stop offset="0%" stopColor="#220000" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#e60023" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#330000" stopOpacity={0.9} />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={400} height={900} fill="#000000" />

        <Path
          d="M 430 -20 C 350 60, 460 160, 330 220 C 200 280, 250 360, 90 420"
          stroke="url(#wave1)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          opacity={0.16}
        />
        <Path
          d="M 430 -20 C 350 60, 460 160, 330 220 C 200 280, 250 360, 90 420"
          stroke="url(#wave1)"
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          opacity={0.9}
        />

        <Path
          d="M 430 20 C 360 100, 470 200, 340 260 C 210 320, 260 400, 100 460"
          stroke="url(#wave2)"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          opacity={0.14}
        />
        <Path
          d="M 430 20 C 360 100, 470 200, 340 260 C 210 320, 260 400, 100 460"
          stroke="url(#wave2)"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.85}
        />

        <Path
          d="M 430 60 C 370 140, 480 240, 350 300 C 220 360, 270 440, 110 500"
          stroke="url(#wave1)"
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          opacity={0.12}
        />
        <Path
          d="M 430 60 C 370 140, 480 240, 350 300 C 220 360, 270 440, 110 500"
          stroke="url(#wave1)"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.75}
        />

        <Path
          d="M 430 -40 C 380 20, 460 100, 350 150 C 240 200, 280 260, 150 300"
          stroke="url(#wave2)"
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />

        <Path
          d="M 430 100 C 380 180, 490 280, 360 340 C 230 400, 280 480, 120 540"
          stroke="url(#wave2)"
          strokeWidth={11}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        <Path
          d="M 430 100 C 380 180, 490 280, 360 340 C 230 400, 280 480, 120 540"
          stroke="url(#wave2)"
          strokeWidth={3}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />

        <Path
          d="M 430 140 C 390 220, 500 320, 370 380 C 240 440, 290 520, 130 580"
          stroke="url(#wave1)"
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          opacity={0.1}
        />
        <Path
          d="M 430 140 C 390 220, 500 320, 370 380 C 240 440, 290 520, 130 580"
          stroke="url(#wave1)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />

        <Path
          d="M 430 180 C 400 260, 510 360, 380 420 C 250 480, 300 560, 140 620"
          stroke="url(#wave2)"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
        />

        <Path
          d="M 430 -80 C 400 -20, 470 60, 380 100 C 290 140, 320 190, 200 230"
          stroke="url(#wave1)"
          strokeWidth={3.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.4}
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
