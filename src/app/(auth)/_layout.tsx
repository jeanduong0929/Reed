import { Redirect, Stack } from "expo-router";
import { useConvexAuth } from "convex/react";

/**
 * Layout for the (auth) route group. Redirects to home once Convex auth is ready.
 */
export default function AuthLayout() {
  // =================================
  //          HOOKS
  // =================================

  const { isAuthenticated, isLoading } = useConvexAuth();

  // =================================
  //        RENDERING
  // =================================

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/(home)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
