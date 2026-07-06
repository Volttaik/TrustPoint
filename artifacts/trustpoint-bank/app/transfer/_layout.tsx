import { Stack } from "expo-router";

export default function TransferLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="method" />
      <Stack.Screen name="beneficiary" />
      <Stack.Screen name="amount" />
      <Stack.Screen name="review" />
      <Stack.Screen name="pin" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
