import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="security" />
      <Stack.Screen name="theme" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="change-pin" />
      <Stack.Screen name="biometrics" />
      <Stack.Screen name="devices" />
      <Stack.Screen name="help" />
      <Stack.Screen name="about" />
      <Stack.Screen name="upgrade" />
    </Stack>
  );
}
