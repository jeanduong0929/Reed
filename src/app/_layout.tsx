import "@/global.css";

import { Slot } from "expo-router";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";

// =================================
//          CONSTANTS
// =================================

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env.local file.",
  );
}

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!convexUrl) {
  throw new Error(
    "Missing EXPO_PUBLIC_CONVEX_URL. Add it to your .env.local file.",
  );
}

const convex = new ConvexReactClient(convexUrl);

/**
 * Root layout that provides Clerk auth, Convex backend, and theme context.
 */
export default function RootLayout() {
  // =================================
  //          HOOKS
  // =================================

  const colorScheme = useColorScheme();

  // =================================
  //        RENDERING
  // =================================

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Slot />
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
