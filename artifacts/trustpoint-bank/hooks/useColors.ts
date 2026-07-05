import { useContext } from "react";
import { useColorScheme } from "react-native";

import { AppContext } from "@/context/AppContext";
import colors from "@/constants/colors";

export function useColors() {
  const scheme = useColorScheme();
  const ctx = useContext(AppContext);
  const themeMode: "dark" | "light" = ctx?.theme ?? (scheme === "light" ? "light" : "dark");
  const palette = themeMode === "light" ? colors.light : colors.dark;
  return { ...palette, radius: colors.radius };
}
