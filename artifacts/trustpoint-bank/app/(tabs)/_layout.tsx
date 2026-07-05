import { Redirect } from "expo-router";

// Redirect legacy (tabs) route to new (main) layout
export default function TabsRedirect() {
  return <Redirect href="/(main)" />;
}
