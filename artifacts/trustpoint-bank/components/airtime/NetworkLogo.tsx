/**
 * NetworkLogo — renders official Nigerian telecom SVG logos.
 * Uses SvgXml from react-native-svg with brand background containers.
 *
 * MTN:      black wordmark on  #FFC300 (brand yellow)
 * Airtel:   red wordmark on    #FFFFFF (white)
 * Glo:      self-contained SVG (has its own green circle)
 * 9mobile:  self-contained SVG (green + yellow-green mark)
 */
import React from "react";
import { StyleSheet, View } from "react-native";
import { SvgXml } from "react-native-svg";
import {
  MTN_SVG,
  AIRTEL_SVG,
  GLO_SVG,
  NINEMOBILE_SVG,
} from "./networkSvgs";
import type { NetworkId } from "./networkDetect";

interface Props {
  id: NetworkId;
  /** Outer container size in dp. Default 44. */
  size?: number;
  /** Override border-radius. Default: size/4. */
  radius?: number;
}

/** Per-network container background and padding fraction */
const CONFIG: Record<NetworkId, { bg: string; padFactor: number; aspectRatio?: number }> = {
  mtn:     { bg: "#FFC300", padFactor: 0.14, aspectRatio: 2 }, // landscape oval
  airtel:  { bg: "#FFFFFF", padFactor: 0.08 },
  glo:     { bg: "transparent", padFactor: 0.02 },
  "9mobile": { bg: "#F0FBF5", padFactor: 0.06 },
};

export function NetworkLogo({ id, size = 44, radius }: Props) {
  const cfg = CONFIG[id] ?? CONFIG.mtn;
  const br  = radius ?? size / 4;
  const pad = Math.round(size * cfg.padFactor);

  /* For MTN (landscape 2:1 oval), constrain inner width so it doesn't overflow */
  const innerSize = size - pad * 2;
  const svgWidth  = cfg.aspectRatio ? innerSize : innerSize;
  const svgHeight = cfg.aspectRatio ? Math.round(innerSize / cfg.aspectRatio) : innerSize;

  const xml =
    id === "mtn"     ? MTN_SVG :
    id === "airtel"  ? AIRTEL_SVG :
    id === "glo"     ? GLO_SVG :
    NINEMOBILE_SVG;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: br,
          backgroundColor: cfg.bg,
          padding: pad,
        },
      ]}
    >
      <SvgXml
        xml={xml}
        width={svgWidth}
        height={svgHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
