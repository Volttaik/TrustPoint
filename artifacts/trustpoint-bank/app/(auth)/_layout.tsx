import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="splash" options={{ animation: "fade" }} />
      <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
      <Stack.Screen name="auth-landing" options={{ animation: "fade" }} />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="pin-verify" />
    </Stack>
  );
}
