import { Redirect, Stack } from "expo-router";

import { useAuth } from "@clerk/expo";

/**
 * Layout for the (auth) route group. Redirects to home if already signed in.
 */
export default function AuthLayout() {
  // =================================
  //          HOOKS
  // =================================

  const { isSignedIn, isLoaded } = useAuth();

  // =================================
  //        RENDERING
  // =================================

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/(home)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
