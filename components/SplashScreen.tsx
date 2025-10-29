import { View, Text } from "react-native";
import { Coffee } from "lucide-react-native";
import LoadingDots from "./LoadingDots";

export default function SplashScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <View className="flex-1 gap-6 items-center justify-center">
        <View className="flex rounded-full items-center justify-center bg-white p-10">
          <Coffee color={"#503B36"} size={90} />
        </View>
        <Text className="text-5xl font-bold text-white">Coffee Buzz</Text>
        <Text className="text-lg text-gray-200">
          Onde cada gole conta uma história
        </Text>
      </View>
      <View className="absolute bottom-10 gap-4">
        <LoadingDots />
        <Text className="text-gray-400 italic">
          Criando a sua experiência perfeita
        </Text>
      </View>
    </View>
  );
}
