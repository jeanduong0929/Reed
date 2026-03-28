import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Home screen.
 */
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="text-2xl font-bold">
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}
