import "@/global.css";

import { Stack } from "expo-router";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useColorScheme } from "@/hooks/use-color-scheme";

/**
 * Root layout that provides theme context and top-level navigation.
 */
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
