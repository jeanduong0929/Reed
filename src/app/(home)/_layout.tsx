import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useConvexAuth, useMutation } from "convex/react";

import { api } from "@/../convex/_generated/api";

/**
 * Layout for the (home) route group. Redirects to sign-in if not authenticated.
 * Syncs the authenticated user to the Convex database on sign-in.
 */
export default function HomeLayout() {
  // =================================
  //          HOOKS
  // =================================

  const syncUser = useMutation(api.users.syncUser);

  const { isAuthenticated, isLoading } = useConvexAuth();

  // =================================
  //          EFFECTS
  // =================================

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      void syncUser();
    }
  }, [isAuthenticated, isLoading, syncUser]);

  // =================================
  //        RENDERING
  // =================================

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
