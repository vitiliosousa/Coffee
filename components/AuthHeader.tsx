import { View, Text } from "react-native";
import { Coffee } from "lucide-react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="flex-row items-center mt-12">
      <View className="w-16 h-16 bg-fundoescuro rounded-2xl items-center justify-center">
        <Coffee size={30} color="#503B36" />
      </View>
      <View className="ml-3">
        <Text className="text-3xl font-bold text-background">{title}</Text>
        <Text className="text-gray-600 text-xl">{subtitle}</Text>
      </View>
    </View>
  );
}
