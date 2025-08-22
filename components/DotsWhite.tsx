import { View } from "react-native";

export default function DotsWhite() {
  return (
    <View className="flex-row items-center justify-center gap-2">
      <View className="w-1 h-1 bg-white rounded-full" />
      <View className="w-6 h-1 bg-white rounded-full" />
      <View className="w-1 h-1 bg-white rounded-full" />
    </View>
  );
}