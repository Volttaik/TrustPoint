import { Redirect } from "expo-router";
import React from "react";
import { useApp } from "@/context/AppContext";

export default function IndexScreen() {
  const { isAuthenticated, user, isLoading } = useApp();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect href="/(main)" />;
  }

  if (user?.onboarded) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(auth)/splash" />;
}
