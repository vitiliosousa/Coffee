import { View } from "react-native";

export default function Dots() {
  return (
    <View className="flex-row items-center justify-center gap-2">
      <View className="w-1 h-1 bg-black rounded-full" />
      <View className="w-6 h-1 bg-black rounded-full" />
      <View className="w-1 h-1 bg-black rounded-full" />
    </View>
  );
}