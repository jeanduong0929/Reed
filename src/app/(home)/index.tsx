import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useClerk, useUser } from "@clerk/expo";

/**
 * Home screen displaying user info and sign-out action.
 */
export default function HomeScreen() {
  // =================================
  //          HOOKS
  // =================================

  const { user } = useUser();
  const { signOut } = useClerk();

  // =================================
  //        RENDERING
  // =================================

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.firstName ?? "there"}!
        </Text>
        <Text className="mb-8 text-base text-gray-500 dark:text-gray-400">
          {user?.emailAddresses[0]?.emailAddress}
        </Text>

        <Pressable
          className="w-full items-center rounded-xl bg-red-500 px-6 py-4 active:opacity-80"
          onPress={() => signOut()}
        >
          <Text className="text-base font-semibold text-white">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
