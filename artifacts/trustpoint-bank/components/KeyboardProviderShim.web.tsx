// Web no-op — react-native-keyboard-controller is native-only
import React from "react";
export function KeyboardProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
