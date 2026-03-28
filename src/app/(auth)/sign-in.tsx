import { useCallback, useEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";

import { useSSO } from "@clerk/expo";

WebBrowser.maybeCompleteAuthSession();

/**
 * Warms up the Android browser for faster OAuth redirects.
 */
function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

/**
 * Sign-in screen with Google OAuth.
 */
export default function SignInScreen() {
  // =================================
  //          HOOKS
  // =================================

  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  // =================================
  //        FUNCTIONS
  // =================================

  /**
   * Initiates the Google OAuth sign-in flow via browser redirect.
   */
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Google sign-in error:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  // =================================
  //        RENDERING
  // =================================

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to Reed
        </Text>
        <Text className="mb-12 text-base text-gray-500 dark:text-gray-400">
          Sign in to get started
        </Text>

        <Pressable
          className="w-full items-center rounded-xl bg-gray-900 px-6 py-4 active:opacity-80 dark:bg-white"
          onPress={handleGoogleSignIn}
        >
          <Text className="text-base font-semibold text-white dark:text-gray-900">
            Sign in with Google
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
