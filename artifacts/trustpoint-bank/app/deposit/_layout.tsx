import { Stack } from "expo-router";

export default function DepositLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cash" />
      <Stack.Screen name="card" />
      <Stack.Screen name="ussd" />
      <Stack.Screen name="qr" />
    </Stack>
  );
}
