import "@/global.css";

import { Slot } from "expo-router";

import { ClerkProvider } from "@clerk/expo";
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

/**
 * Root layout that provides Clerk auth and theme context.
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
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Slot />
      </ThemeProvider>
    </ClerkProvider>
  );
}
